CREATE TABLE `scotty_bookings` (
	`id` varchar(36) NOT NULL,
	`sessionHash` varchar(64) NOT NULL,
	`rideId` varchar(64) NOT NULL,
	`date` varchar(10) NOT NULL,
	`passengers` int NOT NULL,
	`total` int NOT NULL,
	`status` enum('confirmed','cancelled') NOT NULL,
	`reference` varchar(40) NOT NULL,
	`requestId` varchar(96) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `scotty_bookings_id` PRIMARY KEY(`id`),
	CONSTRAINT `scotty_bookings_reference_unique` UNIQUE(`reference`),
	CONSTRAINT `scotty_bookings_session_request_unique` UNIQUE(`sessionHash`,`requestId`)
);
--> statement-breakpoint
CREATE TABLE `scotty_schedule_locks` (
	`id` varchar(96) NOT NULL,
	`rideId` varchar(64) NOT NULL,
	`date` varchar(10) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `scotty_schedule_locks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `scotty_sessions` (
	`tokenHash` varchar(64) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `scotty_sessions_tokenHash` PRIMARY KEY(`tokenHash`)
);
--> statement-breakpoint
CREATE TABLE `scotty_wallet_transactions` (
	`id` varchar(36) NOT NULL,
	`sessionHash` varchar(64) NOT NULL,
	`bookingId` varchar(36),
	`label` varchar(160) NOT NULL,
	`amount` int NOT NULL,
	`reference` varchar(80) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `scotty_wallet_transactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `scotty_wallet_transactions_session_reference_unique` UNIQUE(`sessionHash`,`reference`)
);
--> statement-breakpoint
CREATE TABLE `scotty_wallets` (
	`sessionHash` varchar(64) NOT NULL,
	`balance` int NOT NULL DEFAULT 500,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `scotty_wallets_sessionHash` PRIMARY KEY(`sessionHash`)
);
--> statement-breakpoint
CREATE INDEX `scotty_bookings_session_created_idx` ON `scotty_bookings` (`sessionHash`,`createdAt`);--> statement-breakpoint
CREATE INDEX `scotty_bookings_schedule_status_idx` ON `scotty_bookings` (`rideId`,`date`,`status`);--> statement-breakpoint
CREATE INDEX `scotty_wallet_transactions_session_created_idx` ON `scotty_wallet_transactions` (`sessionHash`,`createdAt`);