CREATE TABLE "trial_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"service_type" text NOT NULL,
	"market" text NOT NULL,
	"liquidity_size" text,
	"currency" text,
	"status" text DEFAULT 'NEW' NOT NULL,
	"user_id" text,
	"created_at" text DEFAULT (current_timestamp) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "stocks" ADD COLUMN "is_conventional_finance" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "stocks" ADD COLUMN "debt_ratio" real;--> statement-breakpoint
ALTER TABLE "stocks" ADD COLUMN "cash_ratio" real;--> statement-breakpoint
ALTER TABLE "stocks" ADD COLUMN "non_compliant_income_ratio" real;--> statement-breakpoint
ALTER TABLE "trial_requests" ADD CONSTRAINT "trial_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;