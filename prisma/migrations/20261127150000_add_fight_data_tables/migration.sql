CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE "FightHistory" (
    "id" TEXT NOT NULL,
    "redFighter" TEXT NOT NULL,
    "blueFighter" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "location" TEXT,
    "country" TEXT,
    "winner" TEXT,
    "titleBout" BOOLEAN NOT NULL DEFAULT false,
    "weightClass" TEXT,
    "gender" TEXT,
    "numberOfRounds" INTEGER,
    "redOdds" INTEGER,
    "blueOdds" INTEGER,
    "finish" TEXT,
    "finishDetails" TEXT,
    "finishRound" INTEGER,
    "finishRoundTime" TEXT,
    "totalFightTimeSecs" INTEGER,
    "details" JSONB NOT NULL,

    CONSTRAINT "FightHistory_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "FighterProfile" (
    "fighterId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "nickname" TEXT,
    "heightFt" DOUBLE PRECISION,
    "weightLbs" DOUBLE PRECISION,
    "stance" TEXT,
    "wins" INTEGER,
    "losses" INTEGER,
    "draws" INTEGER,
    "belt" BOOLEAN NOT NULL DEFAULT false,
    "avgRounds" DOUBLE PRECISION,
    "avgFightTime" DOUBLE PRECISION,
    "knockdowns" DOUBLE PRECISION,
    "strikes" DOUBLE PRECISION,
    "takedowns" DOUBLE PRECISION,
    "submissions" DOUBLE PRECISION,
    "control" DOUBLE PRECISION,
    "sigStrPct" DOUBLE PRECISION,
    "headPct" DOUBLE PRECISION,
    "bodyPct" DOUBLE PRECISION,
    "legPct" DOUBLE PRECISION,
    "distancePct" DOUBLE PRECISION,
    "clinchPct" DOUBLE PRECISION,
    "groundPct" DOUBLE PRECISION,
    "subAttempts" DOUBLE PRECISION,
    "reversals" DOUBLE PRECISION,
    "weightClass" TEXT,
    "gender" TEXT,
    "fightingStyle" TEXT,

    CONSTRAINT "FighterProfile_pkey" PRIMARY KEY ("fighterId")
);

CREATE TABLE "AnalysisCache" (
    "key" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalysisCache_pkey" PRIMARY KEY ("key")
);

CREATE INDEX "FightHistory_redFighter_idx" ON "FightHistory"("redFighter");
CREATE INDEX "FightHistory_blueFighter_idx" ON "FightHistory"("blueFighter");
CREATE INDEX "FightHistory_date_idx" ON "FightHistory"("date" DESC);
CREATE INDEX "FighterProfile_fullName_idx" ON "FighterProfile"("fullName");
CREATE INDEX "AnalysisCache_expiresAt_idx" ON "AnalysisCache"("expiresAt");
CREATE INDEX "FightHistory_redFighter_trgm_idx" ON "FightHistory" USING gin (lower("redFighter") gin_trgm_ops);
CREATE INDEX "FightHistory_blueFighter_trgm_idx" ON "FightHistory" USING gin (lower("blueFighter") gin_trgm_ops);
CREATE INDEX "FighterProfile_fullName_trgm_idx" ON "FighterProfile" USING gin (lower("fullName") gin_trgm_ops);
