CREATE TABLE "tasks" (
"id" SERIAL PRIMARY KEY,
"name" VARCHAR(80),
"done" BOOLEAN
);

INSERT INTO "tasks" ("name","done")
VALUES ('Groceries',FALSE),('Laundry',FALSE),('Wash the Car',FALSE),('Mow the lawn',TRUE),('Clean the bathroom',TRUE);

