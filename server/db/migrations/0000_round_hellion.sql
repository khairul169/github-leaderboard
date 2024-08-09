CREATE TABLE IF NOT EXISTS "repository_languages" (
	"id" serial PRIMARY KEY NOT NULL,
	"repo_id" integer NOT NULL,
	"name" varchar NOT NULL,
	"percentage" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "repositories" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar NOT NULL,
	"uri" varchar NOT NULL,
	"language" varchar NOT NULL,
	"stars" integer NOT NULL,
	"forks" integer NOT NULL,
	"last_update" varchar NOT NULL,
	"contributors" jsonb,
	"is_pending" boolean DEFAULT false NOT NULL,
	"is_error" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" varchar NOT NULL,
	"name" varchar NOT NULL,
	"avatar" varchar,
	"location" varchar,
	"followers" integer DEFAULT 0 NOT NULL,
	"following" integer DEFAULT 0 NOT NULL,
	"achievements" jsonb DEFAULT '[]'::jsonb,
	"points" integer DEFAULT 0 NOT NULL,
	"commits" integer DEFAULT 0 NOT NULL,
	"line_of_codes" integer DEFAULT 0 NOT NULL,
	"github_id" integer,
	"access_token" varchar,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_github_id_unique" UNIQUE("github_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "repository_languages" ADD CONSTRAINT "repository_languages_repo_id_repositories_id_fk" FOREIGN KEY ("repo_id") REFERENCES "public"."repositories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "repositories" ADD CONSTRAINT "repositories_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "repository_languages_name_idx" ON "repository_languages" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "repositories_name_idx" ON "repositories" USING btree ("name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "repositories_uri_idx" ON "repositories" USING btree ("uri");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "repositories_language_idx" ON "repositories" USING btree ("language");