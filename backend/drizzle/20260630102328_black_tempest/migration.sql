CREATE TYPE "difficulty" AS ENUM('EASY', 'MEDIUM', 'HARD');--> statement-breakpoint
CREATE TABLE "problems" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"title" text NOT NULL,
	"description" text NOT NULL,
	"difficulty" "difficulty" NOT NULL,
	"tags" text[] NOT NULL,
	"userId" uuid NOT NULL,
	"examples" jsonb NOT NULL,
	"constraints" text[] NOT NULL,
	"hints" text[],
	"editorial" text,
	"testCases" jsonb NOT NULL,
	"codeSnippets" jsonb[] NOT NULL,
	"referenceSolutions" jsonb NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "problems" ADD CONSTRAINT "problems_userId_users_id_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id");