CREATE TABLE "urls" (
	"id" serial PRIMARY KEY,
	"longurl" text NOT NULL,
	"urlcode" text NOT NULL UNIQUE,
	"created_at" timestamp DEFAULT now() NOT NULL
);
