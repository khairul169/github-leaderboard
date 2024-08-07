CREATE TABLE `repositories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`name` text NOT NULL,
	`uri` text NOT NULL,
	`language` text NOT NULL,
	`stars` integer NOT NULL,
	`last_update` text NOT NULL,
	`languages` text,
	`contributors` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`name` text NOT NULL,
	`avatar` text,
	`location` text,
	`followers` integer DEFAULT 0 NOT NULL,
	`following` integer DEFAULT 0 NOT NULL,
	`achievements` text DEFAULT '[]',
	`points` integer DEFAULT 0 NOT NULL,
	`commits` integer DEFAULT 0 NOT NULL,
	`line_of_codes` integer DEFAULT 0 NOT NULL,
	`github_id` integer,
	`access_token` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `repositories_name_idx` ON `repositories` (`name`);--> statement-breakpoint
CREATE INDEX `repositories_uri_idx` ON `repositories` (`uri`);--> statement-breakpoint
CREATE INDEX `repositories_language_idx` ON `repositories` (`language`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_github_id_unique` ON `users` (`github_id`);