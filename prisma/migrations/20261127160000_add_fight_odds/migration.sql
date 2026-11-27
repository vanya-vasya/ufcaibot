-- CreateTable
CREATE TABLE "FightOdds" (
    "id" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "fighterA" TEXT NOT NULL,
    "fighterB" TEXT NOT NULL,
    "fighterAKey" TEXT NOT NULL,
    "fighterBKey" TEXT NOT NULL,
    "oddsA" INTEGER NOT NULL,
    "oddsB" INTEGER NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'ufc.com',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FightOdds_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FightOdds_fighterAKey_idx" ON "FightOdds"("fighterAKey");

-- CreateIndex
CREATE INDEX "FightOdds_fighterBKey_idx" ON "FightOdds"("fighterBKey");

-- CreateIndex
CREATE UNIQUE INDEX "FightOdds_fighterAKey_fighterBKey_key" ON "FightOdds"("fighterAKey", "fighterBKey");

