CREATE TYPE "public"."roles" AS ENUM('user');--> statement-breakpoint
CREATE TABLE "auths" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"password" varchar(255) NOT NULL,
	"user_id" uuid NOT NULL,
	"refresh_token" varchar,
	"verification_otp" varchar,
	"roles" "roles" DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" varchar(200) NOT NULL,
	"last_name" varchar(200) NOT NULL,
	"email" varchar(322) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "auths" ADD CONSTRAINT "auths_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "auth_idx" ON "auths" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_idx" ON "users" USING btree ("id");--> statement-breakpoint
CREATE UNIQUE INDEX "user_email_idx" ON "users" USING btree ("email");