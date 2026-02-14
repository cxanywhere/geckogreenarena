import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  ChevronDown, 
  ChevronUp, 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  MessageSquare,
  Clock,
  Target,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { format } from "date-fns";

interface AttemptNote {
  id: string;
  content: string;
  createdAt: string | null;
  managerId: string;
}

interface Attempt {
  id: string;
  score: number | null;
  passed: boolean;
  createdAt: string | null;
  feedback: any;
  recordingUrl: string | null;
  notes: AttemptNote[];
}

interface RoleplayHistoryItem {
  roleplay: {
    id: string;
    name: string;
    role: string;
    difficulty: string;
    chapterId: string | null;
    phase: string | null;
    orderIndex: number | null;
  };
  attempts: Attempt[];
  totalAttempts: number;
  hasPassed: boolean;
  remainingAttempts: number;
  permanentlyFailed: boolean;
}

interface RoleplayAttemptHistoryProps {
  history: Record<string, RoleplayHistoryItem>;
  onTryAgain?: (roleplayId: string, chapterId: string | null) => void;
  filterRoleplayId?: string;
  showRoleplayHeader?: boolean;
}

function AttemptCard({ attempt, attemptNumber }: { attempt: Attempt; attemptNumber: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const feedback = attempt.feedback || {};

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {attempt.passed ? (
            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
              <XCircle className="w-4 h-4 text-red-500" />
            </div>
          )}
          <div className="text-left">
            <div className="font-medium text-foreground">
              Attempt {attemptNumber}
              {attempt.passed && <span className="ml-2 text-green-500 text-sm">Passed</span>}
              {!attempt.passed && <span className="ml-2 text-red-500 text-sm">Failed</span>}
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              {attempt.createdAt && (
                <span>{format(new Date(attempt.createdAt), "MMM d, yyyy 'at' h:mm a")}</span>
              )}
              {attempt.score !== null && (
                <>
                  <span>•</span>
                  <span>Score: {attempt.score}%</span>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {attempt.notes.length > 0 && (
            <div className="flex items-center gap-1 px-2 py-1 bg-magenta/10 rounded text-xs text-magenta">
              <MessageSquare className="w-3 h-3" />
              {attempt.notes.length} note{attempt.notes.length !== 1 ? 's' : ''}
            </div>
          )}
          {isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border"
          >
            <div className="p-4 space-y-4">
              {attempt.recordingUrl && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">Recording</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={togglePlayback}
                      className="h-8"
                    >
                      {isPlaying ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
                      {isPlaying ? "Pause" : "Play"}
                    </Button>
                  </div>
                  <audio
                    ref={audioRef}
                    src={attempt.recordingUrl}
                    onEnded={() => setIsPlaying(false)}
                    className="hidden"
                  />
                </div>
              )}

              {feedback.strengths && feedback.strengths.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-green-500 mb-2 flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    Strengths
                  </h4>
                  <ul className="space-y-1">
                    {feedback.strengths.map((s: string, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-green-500">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {feedback.improvements && feedback.improvements.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-amber-500 mb-2 flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" />
                    Areas to Improve
                  </h4>
                  <ul className="space-y-1">
                    {feedback.improvements.map((s: string, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-amber-500">
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {feedback.tips && feedback.tips.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-blue-500 mb-2">Tips for Next Time</h4>
                  <ul className="space-y-1">
                    {feedback.tips.slice(0, 2).map((tip: string, i: number) => (
                      <li key={i} className="text-sm text-muted-foreground pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-blue-500">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {attempt.notes.length > 0 && (
                <div className="border-t border-border pt-4">
                  <h4 className="text-sm font-medium text-magenta mb-2 flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    Manager Coaching Notes
                  </h4>
                  <div className="space-y-2">
                    {attempt.notes.map((note) => (
                      <div key={note.id} className="bg-magenta/5 rounded-lg p-3 border border-magenta/10">
                        <p className="text-sm text-foreground">{note.content}</p>
                        {note.createdAt && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(note.createdAt), "MMM d, yyyy")}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function RoleplayCard({ 
  item, 
  onTryAgain,
  showHeader = true 
}: { 
  item: RoleplayHistoryItem; 
  onTryAgain?: (roleplayId: string, chapterId: string | null) => void;
  showHeader?: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const canRetry = !item.hasPassed && item.remainingAttempts > 0 && !item.permanentlyFailed;

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {showHeader && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              item.hasPassed 
                ? 'bg-green-500/20' 
                : item.permanentlyFailed 
                  ? 'bg-red-500/20' 
                  : 'bg-amber-500/20'
            }`}>
              {item.hasPassed ? (
                <CheckCircle className="w-5 h-5 text-green-500" />
              ) : item.permanentlyFailed ? (
                <XCircle className="w-5 h-5 text-red-500" />
              ) : (
                <Clock className="w-5 h-5 text-amber-500" />
              )}
            </div>
            <div className="text-left">
              <div className="font-medium text-foreground">{item.roleplay.role}</div>
              <div className="text-sm text-muted-foreground">
                {item.roleplay.phase} • {item.totalAttempts} attempt{item.totalAttempts !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {item.hasPassed ? (
              <span className="px-2 py-1 bg-green-500/20 text-green-500 rounded text-xs font-medium">
                Passed
              </span>
            ) : item.permanentlyFailed ? (
              <span className="px-2 py-1 bg-red-500/20 text-red-500 rounded text-xs font-medium">
                Failed
              </span>
            ) : (
              <span className="px-2 py-1 bg-amber-500/20 text-amber-500 rounded text-xs font-medium">
                {item.remainingAttempts} attempt{item.remainingAttempts !== 1 ? 's' : ''} left
              </span>
            )}
            {isExpanded ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
          </div>
        </button>
      )}

      <AnimatePresence>
        {(isExpanded || !showHeader) && (
          <motion.div
            initial={showHeader ? { height: 0, opacity: 0 } : false}
            animate={{ height: "auto", opacity: 1 }}
            exit={showHeader ? { height: 0, opacity: 0 } : undefined}
            transition={{ duration: 0.2 }}
            className={showHeader ? "border-t border-border" : ""}
          >
            <div className="p-4 space-y-3">
              {!showHeader && (
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-muted-foreground">
                    {item.totalAttempts} attempt{item.totalAttempts !== 1 ? 's' : ''} • 
                    {item.hasPassed ? (
                      <span className="text-green-500 ml-1">Passed</span>
                    ) : item.permanentlyFailed ? (
                      <span className="text-red-500 ml-1">No attempts remaining</span>
                    ) : (
                      <span className="text-amber-500 ml-1">{item.remainingAttempts} attempt{item.remainingAttempts !== 1 ? 's' : ''} remaining</span>
                    )}
                  </div>
                </div>
              )}
              
              {item.attempts.map((attempt, index) => (
                <AttemptCard 
                  key={attempt.id} 
                  attempt={attempt} 
                  attemptNumber={item.totalAttempts - index}
                />
              ))}

              {canRetry && onTryAgain && (
                <Button
                  onClick={() => onTryAgain(item.roleplay.id, item.roleplay.chapterId)}
                  className="w-full mt-4"
                  variant="outline"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function RoleplayAttemptHistory({ 
  history, 
  onTryAgain,
  filterRoleplayId,
  showRoleplayHeader = true
}: RoleplayAttemptHistoryProps) {
  const historyItems = Object.values(history);
  
  const filteredItems = filterRoleplayId 
    ? historyItems.filter(item => item.roleplay.id === filterRoleplayId)
    : historyItems;

  if (filteredItems.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p>No roleplay attempts yet</p>
        <p className="text-sm">Complete your first roleplay to see your history here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredItems.map((item) => (
        <RoleplayCard 
          key={item.roleplay.id} 
          item={item} 
          onTryAgain={onTryAgain}
          showHeader={showRoleplayHeader}
        />
      ))}
    </div>
  );
}
