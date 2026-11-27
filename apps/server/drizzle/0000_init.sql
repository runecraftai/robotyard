CREATE TABLE `agent_session` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`bot_id` integer NOT NULL,
	`started_at` integer NOT NULL,
	`ended_at` integer,
	FOREIGN KEY (`bot_id`) REFERENCES `bot`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `bot` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`callsign` text NOT NULL,
	`mascot_look` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bot_callsign_unique` ON `bot` (`callsign`);--> statement-breakpoint
CREATE TABLE `mission` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`state` text NOT NULL,
	`created_at` integer NOT NULL
);
