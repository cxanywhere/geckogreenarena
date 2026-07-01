import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, real, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  role: text("role").notNull().default("rep"),
  status: text("status").notNull().default("onboarding"),
  avatarInitials: text("avatar_initials"),
  managerId: varchar("manager_id"),
  profilePhoto: text("profile_photo"),
  warriorAvatar: text("warrior_avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  archivedAt: timestamp("archived_at"),
  certificationEmailSentAt: timestamp("certification_email_sent_at"),
  certificationToken: text("certification_token").unique(),
  certifiedAt: timestamp("certified_at"),
});

export const chapters = pgTable("chapters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").unique(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  description: text("description").notNull(),
  duration: text("duration").notNull(),
  pdfUrl: text("pdf_url"),
  coverImage: text("cover_image"),
  agenda: jsonb("agenda").$type<string[]>().notNull(),
  slides: jsonb("slides").$type<any[]>().notNull(),
  slideCount: integer("slide_count").default(0),
  orderIndex: integer("order_index").notNull().default(0),
});

export const roleplays = pgTable("roleplays", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").unique(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  description: text("description").notNull(),
  avatar: text("avatar"),
  traits: jsonb("traits").$type<string[]>().notNull(),
  difficulty: text("difficulty").notNull(),
  stats: jsonb("stats").$type<{resistance: number; objections: number; buy_signal: number}>().notNull(),
  chapterId: varchar("chapter_id"),
  phase: text("phase"),
  placement: text("placement"),
  passCriteria: text("pass_criteria"),
  failConditions: text("fail_conditions"),
  winningResponse: text("winning_response"),
  losingResponse: text("losing_response"),
  orderIndex: integer("order_index").default(0),
});

export const battlecards = pgTable("battlecards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  phase: text("phase").notNull(),
  title: text("title").notNull(),
  situation: text("situation").notNull(),
  script: text("script").notNull(),
  keyPoints: jsonb("key_points").$type<string[]>().notNull(),
  type: text("type").notNull(),
  image: text("image"),
});

export const resources = pgTable("resources", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  learningOutcome: text("learning_outcome").notNull(),
  duration: text("duration").notNull(),
  author: text("author").notNull(),
  thumbnail: text("thumbnail"),
  tags: jsonb("tags").$type<string[]>().notNull(),
});

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  chapterId: varchar("chapter_id"),
  quizScore: integer("quiz_score"),
  completed: integer("completed").notNull().default(0),
  completedAt: timestamp("completed_at"),
  currentSlide: integer("current_slide").default(0),
  totalSlides: integer("total_slides").default(0),
  slidesViewed: jsonb("slides_viewed").$type<number[]>().default([]),
});

export const roleplayAttempts = pgTable("roleplay_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  roleplayId: varchar("roleplay_id").notNull(),
  score: integer("score").notNull(),
  passed: integer("passed").default(0),
  duration: text("duration"),
  feedback: text("feedback"),
  metrics: jsonb("metrics").$type<{resistance: string; clarity: string; tone: string}>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Usage tracking for billing - tracks duration and cost of roleplay sessions
export const usageSessions = pgTable("usage_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  roleplayId: varchar("roleplay_id").notNull(),
  roleplayAttemptId: varchar("roleplay_attempt_id"),
  vapiCallId: text("vapi_call_id").unique(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  durationSeconds: integer("duration_seconds").default(0),
  billedMinutes: integer("billed_minutes").default(0),
  rateCentsPerMinute: integer("rate_cents_per_minute").default(15),
  costCents: integer("cost_cents").default(0),
  sessionType: text("session_type").default("voice"),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Quiz questions generated by AI for each chapter
export const quizQuestions = pgTable("quiz_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  chapterId: varchar("chapter_id").notNull(),
  slideIndex: integer("slide_index").notNull(),
  questionOrder: integer("question_order").notNull().default(0),
  question: text("question").notNull(),
  options: jsonb("options").$type<string[]>().notNull(),
  correctAnswer: integer("correct_answer").notNull(),
  explanation: text("explanation"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => [
  uniqueIndex("quiz_questions_composite_idx").on(table.chapterId, table.slideIndex, table.questionOrder),
]);

// User quiz attempts and scores
export const quizAttempts = pgTable("quiz_attempts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  chapterId: varchar("chapter_id").notNull(),
  questionId: varchar("question_id").notNull(),
  selectedAnswer: integer("selected_answer").notNull(),
  isCorrect: integer("is_correct").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Buyer personas for sales training
export const buyerPersonas = pgTable("buyer_personas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  subtitle: text("subtitle"),
  avatar: text("avatar"),
  attributes: jsonb("attributes").$type<string[]>().notNull(),
  whatTheyCareAbout: jsonb("what_they_care_about").$type<string[]>().notNull(),
  whatTriggersResistance: jsonb("what_triggers_resistance").$type<string[]>().notNull(),
  howToWin: jsonb("how_to_win").$type<string[]>().notNull(),
  bestPlays: jsonb("best_plays").$type<string[]>().notNull(),
  orderIndex: integer("order_index").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Certifications for sales reps
export const certifications = pgTable("certifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  certificateNumber: text("certificate_number").unique().notNull(),
  awardedAt: timestamp("awarded_at").defaultNow().notNull(),
  chaptersCompleted: integer("chapters_completed").notNull(),
  roleplaysCompleted: integer("roleplays_completed").notNull(),
  quizAverage: integer("quiz_average").notNull(),
  roleplayPassRate: integer("roleplay_pass_rate").notNull(),
  pdfUrl: text("pdf_url"),
  status: text("status").default("active"),
});

// Coaching notes from managers
export const coachingNotes = pgTable("coaching_notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  repId: varchar("rep_id").notNull(),
  managerId: varchar("manager_id").notNull(),
  roleplayAttemptId: varchar("roleplay_attempt_id"),
  content: text("content").notNull(),
  noteType: text("note_type").default("general"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Coaching tasks assigned by managers
export const coachingTasks = pgTable("coaching_tasks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  repId: varchar("rep_id").notNull(),
  managerId: varchar("manager_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date"),
  status: text("status").default("pending"),
  priority: text("priority").default("medium"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Progress nudges/notifications
export const progressNudges = pgTable("progress_nudges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  nudgeType: text("nudge_type").notNull(),
  message: text("message").notNull(),
  sentVia: text("sent_via").default("in_app"),
  sentAt: timestamp("sent_at").defaultNow().notNull(),
  readAt: timestamp("read_at"),
  dismissed: integer("dismissed").default(0),
});

// Expert coaches for marketplace
export const experts = pgTable("experts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  bio: text("bio").notNull(),
  avatar: text("avatar"),
  website: text("website"),
  specialties: jsonb("specialties").$type<string[]>().notNull(),
  credentials: jsonb("credentials").$type<string[]>(),
  aiCoachRate: integer("ai_coach_rate").default(0),
  consultationRate: integer("consultation_rate").default(0),
  callReviewRate: integer("call_review_rate").default(0),
  featured: integer("featured").default(0),
  orderIndex: integer("order_index").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  manager: one(users, {
    fields: [users.managerId],
    references: [users.id],
  }),
  progress: many(userProgress),
  attempts: many(roleplayAttempts),
}));

export const chaptersRelations = relations(chapters, ({ many }) => ({
  roleplays: many(roleplays),
  progress: many(userProgress),
}));

export const roleplaysRelations = relations(roleplays, ({ one, many }) => ({
  chapter: one(chapters, {
    fields: [roleplays.chapterId],
    references: [chapters.id],
  }),
  attempts: many(roleplayAttempts),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  chapter: one(chapters, {
    fields: [userProgress.chapterId],
    references: [chapters.id],
  }),
}));

export const roleplayAttemptsRelations = relations(roleplayAttempts, ({ one }) => ({
  user: one(users, {
    fields: [roleplayAttempts.userId],
    references: [users.id],
  }),
  roleplay: one(roleplays, {
    fields: [roleplayAttempts.roleplayId],
    references: [roleplays.id],
  }),
}));

export const usageSessionsRelations = relations(usageSessions, ({ one }) => ({
  user: one(users, {
    fields: [usageSessions.userId],
    references: [users.id],
  }),
  roleplay: one(roleplays, {
    fields: [usageSessions.roleplayId],
    references: [roleplays.id],
  }),
  roleplayAttempt: one(roleplayAttempts, {
    fields: [usageSessions.roleplayAttemptId],
    references: [roleplayAttempts.id],
  }),
}));

// Comic stories for Victory Playbook
export const comicStories = pgTable("comic_stories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roleplayId: varchar("roleplay_id").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  phase: text("phase").notNull(),
  description: text("description"),
  orderIndex: integer("order_index").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const comicPanels = pgTable("comic_panels", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  storyId: varchar("story_id").notNull(),
  panelOrder: integer("panel_order").notNull(),
  imageUrl: text("image_url"),
  speaker: text("speaker").notNull(),
  dialogue: text("dialogue").notNull(),
  setting: text("setting"),
  emotion: text("emotion"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const comicStoriesRelations = relations(comicStories, ({ one, many }) => ({
  roleplay: one(roleplays, {
    fields: [comicStories.roleplayId],
    references: [roleplays.id],
  }),
  panels: many(comicPanels),
}));

export const comicPanelsRelations = relations(comicPanels, ({ one }) => ({
  story: one(comicStories, {
    fields: [comicPanels.storyId],
    references: [comicStories.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertChapterSchema = createInsertSchema(chapters).omit({
  id: true,
});

const baseInsertRoleplaySchema = createInsertSchema(roleplays).omit({
  id: true,
});
export const insertRoleplaySchema = baseInsertRoleplaySchema.extend({
  id: z.string().optional(),
});

export const insertBattlecardSchema = createInsertSchema(battlecards).omit({
  id: true,
});

export const insertResourceSchema = createInsertSchema(resources).omit({
  id: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  completedAt: true,
});

export const insertRoleplayAttemptSchema = createInsertSchema(roleplayAttempts).omit({
  id: true,
  createdAt: true,
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).omit({
  id: true,
  createdAt: true,
});

export const insertQuizAttemptSchema = createInsertSchema(quizAttempts).omit({
  id: true,
  createdAt: true,
});

export const insertUsageSessionSchema = createInsertSchema(usageSessions).omit({
  id: true,
  createdAt: true,
});

export const insertBuyerPersonaSchema = createInsertSchema(buyerPersonas).omit({
  id: true,
  createdAt: true,
});

export const insertCertificationSchema = createInsertSchema(certifications).omit({
  id: true,
  awardedAt: true,
});

export const insertCoachingNoteSchema = createInsertSchema(coachingNotes).omit({
  id: true,
  createdAt: true,
});

export const insertCoachingTaskSchema = createInsertSchema(coachingTasks).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertProgressNudgeSchema = createInsertSchema(progressNudges).omit({
  id: true,
  sentAt: true,
  readAt: true,
});

export const insertExpertSchema = createInsertSchema(experts).omit({
  id: true,
  createdAt: true,
});

export const insertComicStorySchema = createInsertSchema(comicStories).omit({
  id: true,
  createdAt: true,
});

export const insertComicPanelSchema = createInsertSchema(comicPanels).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertChapter = z.infer<typeof insertChapterSchema>;
export type Chapter = typeof chapters.$inferSelect;

export type InsertRoleplay = z.infer<typeof insertRoleplaySchema>;
export type Roleplay = typeof roleplays.$inferSelect;

export type InsertBattlecard = z.infer<typeof insertBattlecardSchema>;
export type Battlecard = typeof battlecards.$inferSelect;

export type InsertResource = z.infer<typeof insertResourceSchema>;
export type Resource = typeof resources.$inferSelect;

export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UserProgress = typeof userProgress.$inferSelect;

export type InsertRoleplayAttempt = z.infer<typeof insertRoleplayAttemptSchema>;
export type RoleplayAttempt = typeof roleplayAttempts.$inferSelect;

export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;
export type QuizQuestion = typeof quizQuestions.$inferSelect;

export type InsertQuizAttempt = z.infer<typeof insertQuizAttemptSchema>;
export type QuizAttempt = typeof quizAttempts.$inferSelect;

export type InsertUsageSession = z.infer<typeof insertUsageSessionSchema>;
export type UsageSession = typeof usageSessions.$inferSelect;

export type InsertBuyerPersona = z.infer<typeof insertBuyerPersonaSchema>;
export type BuyerPersona = typeof buyerPersonas.$inferSelect;

export type InsertCertification = z.infer<typeof insertCertificationSchema>;
export type Certification = typeof certifications.$inferSelect;

export type InsertCoachingNote = z.infer<typeof insertCoachingNoteSchema>;
export type CoachingNote = typeof coachingNotes.$inferSelect;

export type InsertCoachingTask = z.infer<typeof insertCoachingTaskSchema>;
export type CoachingTask = typeof coachingTasks.$inferSelect;

export type InsertProgressNudge = z.infer<typeof insertProgressNudgeSchema>;
export type ProgressNudge = typeof progressNudges.$inferSelect;

export type InsertExpert = z.infer<typeof insertExpertSchema>;
export type Expert = typeof experts.$inferSelect;

export type InsertComicStory = z.infer<typeof insertComicStorySchema>;
export type ComicStory = typeof comicStories.$inferSelect;

export type InsertComicPanel = z.infer<typeof insertComicPanelSchema>;
export type ComicPanel = typeof comicPanels.$inferSelect;

// Pitch Practice - Decks and Sessions
export const pitchDecks = pgTable("pitch_decks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").unique().notNull(),
  clientName: text("client_name").notNull(),
  clientLogo: text("client_logo"),
  industry: text("industry").notNull(),
  buyerName: text("buyer_name").notNull(),
  buyerRole: text("buyer_role").notNull(),
  buyerAvatar: text("buyer_avatar"),
  buyerContext: text("buyer_context").notNull(),
  description: text("description").notNull(),
  difficulty: text("difficulty").notNull().default("Intermediate"),
  slideCount: integer("slide_count").default(0),
  estimatedMinutes: integer("estimated_minutes").default(15),
  coverImage: text("cover_image"),
  orderIndex: integer("order_index").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pitchDeckSlides = pgTable("pitch_deck_slides", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  deckId: varchar("deck_id").notNull(),
  slideOrder: integer("slide_order").notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  content: text("content").notNull(),
  talkingPoints: jsonb("talking_points").$type<string[]>().notNull(),
  evaluationCriteria: jsonb("evaluation_criteria").$type<string[]>().notNull(),
  imageUrl: text("image_url"),
  imagePrompt: text("image_prompt"),
  slideType: text("slide_type").notNull().default("content"),
  narrationScript: text("narration_script"),
  narrationAudioUrl: text("narration_audio_url"),
});

export const pitchSessions = pgTable("pitch_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  deckId: varchar("deck_id").notNull(),
  status: text("status").notNull().default("active"),
  currentSlideOrder: integer("current_slide_order").default(0),
  transcript: text("transcript"),
  structuredTranscript: jsonb("structured_transcript").$type<Array<{ role: string; content: string; timestamp: number; slideIndex: number }>>(),
  overallScore: integer("overall_score"),
  overallFeedback: text("overall_feedback"),
  pilotSignedOff: integer("pilot_signed_off").default(0),
  durationSeconds: integer("duration_seconds").default(0),
  dimensionScores: jsonb("dimension_scores").$type<DimensionScores>(),
  deliveryMetrics: jsonb("delivery_metrics").$type<DeliveryMetrics>(),
  acousticScores: jsonb("acoustic_scores").$type<AcousticScores>(),
  timestampedMoments: jsonb("timestamped_moments").$type<TimestampedMoment[]>(),
  betterResponses: jsonb("better_responses").$type<BetterPhrasing[]>(),
  missedPoints: jsonb("missed_points").$type<MissedPoint[]>(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
});

export const pitchSessionFeedback = pgTable("pitch_session_feedback", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").notNull(),
  slideOrder: integer("slide_order").notNull(),
  slideTitle: text("slide_title").notNull(),
  score: integer("score"),
  feedback: text("feedback"),
  strengths: jsonb("strengths").$type<string[]>(),
  improvements: jsonb("improvements").$type<string[]>(),
});

export const pitchDecksRelations = relations(pitchDecks, ({ many }) => ({
  slides: many(pitchDeckSlides),
  sessions: many(pitchSessions),
}));

export const pitchDeckSlidesRelations = relations(pitchDeckSlides, ({ one }) => ({
  deck: one(pitchDecks, {
    fields: [pitchDeckSlides.deckId],
    references: [pitchDecks.id],
  }),
}));

export const pitchSessionsRelations = relations(pitchSessions, ({ one, many }) => ({
  user: one(users, {
    fields: [pitchSessions.userId],
    references: [users.id],
  }),
  deck: one(pitchDecks, {
    fields: [pitchSessions.deckId],
    references: [pitchDecks.id],
  }),
  feedback: many(pitchSessionFeedback),
}));

export const pitchSessionFeedbackRelations = relations(pitchSessionFeedback, ({ one }) => ({
  session: one(pitchSessions, {
    fields: [pitchSessionFeedback.sessionId],
    references: [pitchSessions.id],
  }),
}));

export const insertPitchDeckSchema = createInsertSchema(pitchDecks).omit({ id: true, createdAt: true });
export const insertPitchDeckSlideSchema = createInsertSchema(pitchDeckSlides).omit({ id: true });
export const insertPitchSessionSchema = createInsertSchema(pitchSessions).omit({ id: true, startedAt: true });
export const insertPitchSessionFeedbackSchema = createInsertSchema(pitchSessionFeedback).omit({ id: true });

export type InsertPitchDeck = z.infer<typeof insertPitchDeckSchema>;
export type PitchDeck = typeof pitchDecks.$inferSelect;
export type InsertPitchDeckSlide = z.infer<typeof insertPitchDeckSlideSchema>;
export type PitchDeckSlide = typeof pitchDeckSlides.$inferSelect;
export type InsertPitchSession = z.infer<typeof insertPitchSessionSchema>;
export type PitchSession = typeof pitchSessions.$inferSelect;
export type InsertPitchSessionFeedback = z.infer<typeof insertPitchSessionFeedbackSchema>;
export type PitchSessionFeedback = typeof pitchSessionFeedback.$inferSelect;

// ABM Practice tables
export const abmAccounts = pgTable("abm_accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").unique().notNull(),
  companyName: text("company_name").notNull(),
  industry: text("industry").notNull(),
  companySize: text("company_size").notNull(),
  description: text("description").notNull(),
  currentStack: jsonb("current_stack").$type<string[]>().default([]),
  strategicInitiative: text("strategic_initiative").notNull(),
  budgetSignal: text("budget_signal").notNull(),
  decisionTimeline: text("decision_timeline").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const abmCommitteeMembers = pgTable("abm_committee_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  accountId: varchar("account_id").notNull(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  role: text("role").notNull(),
  influence: text("influence").notNull(),
  avatar: text("avatar").default(""),
  whatTheyCareAbout: jsonb("what_they_care_about").$type<string[]>().default([]),
  resistanceTriggers: jsonb("resistance_triggers").$type<string[]>().default([]),
  personalContext: text("personal_context").notNull(),
  openingLine: text("opening_line").notNull(),
  orderIndex: integer("order_index").default(0),
});

export const abmPracticeSessions = pgTable("abm_practice_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  accountId: varchar("account_id").notNull(),
  memberId: varchar("member_id").notNull(),
  status: text("status").default("active"),
  transcript: text("transcript"),
  score: integer("score"),
  passed: integer("passed").default(0),
  feedback: text("feedback"),
  durationSeconds: integer("duration_seconds"),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  endedAt: timestamp("ended_at"),
});

export const abmAccountsRelations = relations(abmAccounts, ({ many }) => ({
  members: many(abmCommitteeMembers),
  sessions: many(abmPracticeSessions),
}));

export const abmCommitteeMembersRelations = relations(abmCommitteeMembers, ({ one, many }) => ({
  account: one(abmAccounts, {
    fields: [abmCommitteeMembers.accountId],
    references: [abmAccounts.id],
  }),
  sessions: many(abmPracticeSessions),
}));

export const abmPracticeSessionsRelations = relations(abmPracticeSessions, ({ one }) => ({
  user: one(users, {
    fields: [abmPracticeSessions.userId],
    references: [users.id],
  }),
  account: one(abmAccounts, {
    fields: [abmPracticeSessions.accountId],
    references: [abmAccounts.id],
  }),
  member: one(abmCommitteeMembers, {
    fields: [abmPracticeSessions.memberId],
    references: [abmCommitteeMembers.id],
  }),
}));

export const insertAbmAccountSchema = createInsertSchema(abmAccounts).omit({ id: true, createdAt: true });
export const insertAbmCommitteeMemberSchema = createInsertSchema(abmCommitteeMembers).omit({ id: true });
export const insertAbmPracticeSessionSchema = createInsertSchema(abmPracticeSessions).omit({ id: true, startedAt: true });

export type InsertAbmAccount = z.infer<typeof insertAbmAccountSchema>;
export type AbmAccount = typeof abmAccounts.$inferSelect;
export type InsertAbmCommitteeMember = z.infer<typeof insertAbmCommitteeMemberSchema>;
export type AbmCommitteeMember = typeof abmCommitteeMembers.$inferSelect;
export type InsertAbmPracticeSession = z.infer<typeof insertAbmPracticeSessionSchema>;
export type AbmPracticeSession = typeof abmPracticeSessions.$inferSelect;

// Migrations tracking table - for one-time data migrations
export const migrations = pgTable("migrations", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  executedAt: timestamp("executed_at").defaultNow().notNull(),
});

export type Migration = typeof migrations.$inferSelect;

// ============================================================
// Base Camp — Duolingo-style B2B Marketing Fundamentals
// ============================================================

export const basecampUnits = pgTable("basecamp_units", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle").notNull(),
  icon: text("icon"),
  color: text("color").notNull().default("#0A66C2"),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const basecampLessons = pgTable("basecamp_lessons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  unitId: varchar("unit_id").notNull(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  conceptCard: jsonb("concept_card"),
  conceptImageUrl: text("concept_image_url"),
  orderIndex: integer("order_index").notNull().default(0),
  xpReward: integer("xp_reward").notNull().default(20),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const basecampQuestions = pgTable("basecamp_questions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  lessonId: varchar("lesson_id").notNull(),
  type: text("type").notNull(),
  prompt: text("prompt").notNull(),
  options: jsonb("options"),
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation").notNull(),
  visual: jsonb("visual"),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const basecampProgress = pgTable("basecamp_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  lessonId: varchar("lesson_id").notNull(),
  completed: integer("completed").notNull().default(0),
  score: integer("score").notNull().default(0),
  xpEarned: integer("xp_earned").notNull().default(0),
  answers: jsonb("answers"),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const basecampStreaks = pgTable("basecamp_streaks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().unique(),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  totalXp: integer("total_xp").notNull().default(0),
  lastActivityDate: text("last_activity_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBasecampUnitSchema = createInsertSchema(basecampUnits).omit({ id: true, createdAt: true });
export const insertBasecampLessonSchema = createInsertSchema(basecampLessons).omit({ id: true, createdAt: true });
export const insertBasecampQuestionSchema = createInsertSchema(basecampQuestions).omit({ id: true, createdAt: true });
export const insertBasecampProgressSchema = createInsertSchema(basecampProgress).omit({ id: true, createdAt: true });
export const insertBasecampStreakSchema = createInsertSchema(basecampStreaks).omit({ id: true, createdAt: true });

export type InsertBasecampUnit = z.infer<typeof insertBasecampUnitSchema>;
export type BasecampUnit = typeof basecampUnits.$inferSelect;
export type InsertBasecampLesson = z.infer<typeof insertBasecampLessonSchema>;
export type BasecampLesson = typeof basecampLessons.$inferSelect;
export type InsertBasecampQuestion = z.infer<typeof insertBasecampQuestionSchema>;
export type BasecampQuestion = typeof basecampQuestions.$inferSelect;
export type InsertBasecampProgress = z.infer<typeof insertBasecampProgressSchema>;
export type BasecampProgress = typeof basecampProgress.$inferSelect;
export type InsertBasecampStreak = z.infer<typeof insertBasecampStreakSchema>;
export type BasecampStreak = typeof basecampStreaks.$inferSelect;

// ---------------------------------------------------------------------------
// Smarter Call Grading + Skills Map shared types
// Used by roleplay, pitch, and ABM evaluation flows on both server and client.
// ---------------------------------------------------------------------------

export interface DimensionScores {
  discovery: number;
  objectionHandling: number;
  valueFraming: number;
  delivery: number;
  activeListening: number;
  nextStepClarity: number;
}

export const DIMENSION_LABELS: Record<keyof DimensionScores, string> = {
  discovery: "Discovery",
  objectionHandling: "Objection Handling",
  valueFraming: "Value Framing",
  delivery: "Delivery",
  activeListening: "Active Listening",
  nextStepClarity: "Next-Step Clarity",
};

export interface DeliveryMetrics {
  available: boolean;
  paceWpm: number;
  paceBand: "too slow" | "ideal" | "too fast";
  fillerWordCount: number;
  fillerWordsPerMin: number;
  talkListenRatio: number; // % of speaking time that was the rep
  interruptions: number;
  longestMonologueSec: number;
  avgResponseDelaySec: number;
  repSpeakingSec: number;
  buyerSpeakingSec: number;
  // "measured" when real per-turn audio timing was available (e.g. VAPI turn
  // durations); "estimated" when derived from a fixed words-per-second heuristic.
  timingSource: "measured" | "estimated";
}

export interface AcousticScores {
  available: boolean;
  vocalConfidence: number; // 0-100
  energy: number; // 0-100
  composureUnderPressure: number; // 0-100
  repSentimentArc: string;
  buyerSentimentShift: string;
  summary: string;
}

export interface TimestampedMoment {
  timestampSec: number | null;
  type: "strength" | "weakness";
  label: string;
  quote?: string;
}

// "How you could have said it better" — grounded rewrites of what the rep
// actually said. youSaid is a real quote from the transcript, betterVersion is
// the improved phrasing, why is a one-line reason it lands better.
export interface BetterPhrasing {
  youSaid: string;
  betterVersion: string;
  why: string;
}

// "What you missed saying" — points or questions the rep should have raised but
// didn't, each with a short why-it-matters.
export interface MissedPoint {
  point: string;
  why: string;
}

// Export chat models for OpenAI integration
export * from "./models/chat";
