CREATE TABLE "Account" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(255),
	"balance" bigint DEFAULT 0,
	CONSTRAINT "Account_username_unique" UNIQUE("username")
);
