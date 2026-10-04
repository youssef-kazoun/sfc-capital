ALTER TABLE "payments" ALTER COLUMN "currency" SET DEFAULT 'USD';--> statement-breakpoint
ALTER TABLE "stocks" ALTER COLUMN "exchange" SET DEFAULT 'NASDAQ';--> statement-breakpoint
ALTER TABLE "stocks" ALTER COLUMN "currency" SET DEFAULT 'USD';