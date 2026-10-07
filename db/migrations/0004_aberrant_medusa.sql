ALTER TABLE "packages" ADD COLUMN "price_monthly_sar" real;--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "price_yearly_sar" real;--> statement-breakpoint
ALTER TABLE "payments" ADD COLUMN "moyasar_payment_id" text;