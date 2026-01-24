import { db } from "../server/db";
import { users } from "../shared/schema";
import { generateSecurePassword, getAvatarInitials } from "../server/password-generator";
import * as fs from "fs";

const MANAGERS = [
  { name: "Joshua Couch", email: "jcouch@geckogreen.com" },
  { name: "Shawn Singleton", email: "ssingleton@geckogreen.com" },
  { name: "Thomas Adam", email: "tadam@geckogreen.com" },
  { name: "Thomas Greer", email: "tgreer@geckogreen.com" },
  { name: "Thomas Adams", email: "tadams@geckogreen.com" },
  { name: "Nick Lilljedahl", email: "nlilljedahl@geckogreen.com" },
  { name: "Clint Brown", email: "cbrown@geckogreen.com" },
];

interface ManagerCredential {
  name: string;
  email: string;
  password: string;
}

async function createManagers() {
  console.log("=== Creating Manager Accounts ===\n");

  const credentials: ManagerCredential[] = [];
  const sqlStatements: string[] = [];

  for (const manager of MANAGERS) {
    const password = generateSecurePassword();
    const avatarInitials = getAvatarInitials(manager.name);

    credentials.push({
      name: manager.name,
      email: manager.email,
      password,
    });

    try {
      const [newUser] = await db
        .insert(users)
        .values({
          name: manager.name,
          email: manager.email,
          password: password,
          role: "manager",
          status: "active",
          avatarInitials,
        })
        .returning();

      console.log(`Created: ${manager.name} (${manager.email})`);

      const escapedName = manager.name.replace(/'/g, "''");
      const escapedEmail = manager.email.replace(/'/g, "''");
      const escapedPassword = password.replace(/'/g, "''");
      const escapedInitials = avatarInitials.replace(/'/g, "''");

      sqlStatements.push(
        `INSERT INTO users (name, email, password, role, status, avatar_initials) VALUES ('${escapedName}', '${escapedEmail}', '${escapedPassword}', 'manager', 'active', '${escapedInitials}') ON CONFLICT (email) DO NOTHING;`
      );
    } catch (error: any) {
      if (error.code === "23505") {
        console.log(`Skipped (already exists): ${manager.email}`);
      } else {
        console.error(`Error creating ${manager.email}:`, error.message);
      }
    }
  }

  console.log("\n=== Manager Credentials ===\n");
  console.log("| Name | Email | Password |");
  console.log("|------|-------|----------|");
  for (const cred of credentials) {
    console.log(`| ${cred.name} | ${cred.email} | ${cred.password} |`);
  }

  const sqlScript = `-- Manager accounts for production database
-- Run this SQL in the production database pane

${sqlStatements.join("\n")}
`;

  fs.writeFileSync("scripts/production-managers.sql", sqlScript);
  console.log("\n=== SQL Script saved to scripts/production-managers.sql ===\n");

  return credentials;
}

createManagers()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
