CREATE TABLE "problem_solved" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"userId" uuid NOT NULL,
	"problemId" uuid NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_problem_unique" UNIQUE("userId","problemId")
);
--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"userId" uuid NOT NULL,
	"problemId" uuid NOT NULL,
	"sourceCode" jsonb NOT NULL,
	"language" text NOT NULL,
	"stdin" text,
	"stdout" text,
	"stderr" text,
	"compileOutput" text,
	"status" text NOT NULL,
	"memory" text,
	"time" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "test_case_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"submissionId" uuid NOT NULL,
	"testCaseNo" integer NOT NULL,
	"passed" boolean NOT NULL,
	"stdout" text,
	"expected" text NOT NULL,
	"stderr" text,
	"compileOutput" text,
	"status" text NOT NULL,
	"memory" text,
	"time" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "submission_id_idx" ON "test_case_results" ("submissionId");--> statement-breakpoint
ALTER TABLE "problem_solved" ADD CONSTRAINT "problem_solved_userId_users_id_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "problem_solved" ADD CONSTRAINT "problem_solved_problemId_problems_id_fkey" FOREIGN KEY ("problemId") REFERENCES "problems"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_userId_users_id_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "submissions" ADD CONSTRAINT "submissions_problemId_problems_id_fkey" FOREIGN KEY ("problemId") REFERENCES "problems"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "test_case_results" ADD CONSTRAINT "test_case_results_submissionId_submissions_id_fkey" FOREIGN KEY ("submissionId") REFERENCES "submissions"("id") ON DELETE CASCADE;