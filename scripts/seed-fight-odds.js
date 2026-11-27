/**
 * Upserts bookmaker odds from prisma/data/fight-odds.csv into the FightOdds table.
 * The table is the PRIMARY odds source for the ODDS analysis; the odds API is only
 * called for fights that are not in it.
 *
 * CSV columns: event,fighter_a,fighter_b,odds_a,odds_b   (American moneyline, e.g. -170 / +140)
 *
 * Usage:  DATABASE_URL=... node scripts/seed-fight-odds.js
 * Safe to re-run: rows are matched by the fighter pair (either order is stored as given)
 * and other rows in the table are left untouched.
 */
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const CSV_PATH = path.join(__dirname, "..", "prisma", "data", "fight-odds.csv");

/** Must stay identical to normalizeName in lib/analysis/names.ts */
const normalizeName = (name) =>
  name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const parseAmerican = (value, label) => {
  const parsed = Number.parseInt(String(value).replace("+", "").trim(), 10);
  if (!Number.isFinite(parsed) || parsed === 0) throw new Error(`Invalid odds "${value}" (${label})`);
  return parsed;
};

const readRows = () => {
  const [header, ...lines] = fs
    .readFileSync(CSV_PATH, "utf8")
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "");
  const columns = header.split(",").map((column) => column.trim());

  return lines.map((line) => {
    const values = line.split(",").map((value) => value.trim());
    const row = Object.fromEntries(columns.map((column, index) => [column, values[index]]));
    const label = `${row.fighter_a} vs ${row.fighter_b}`;
    return {
      eventName: row.event,
      fighterA: row.fighter_a,
      fighterB: row.fighter_b,
      fighterAKey: normalizeName(row.fighter_a),
      fighterBKey: normalizeName(row.fighter_b),
      oddsA: parseAmerican(row.odds_a, label),
      oddsB: parseAmerican(row.odds_b, label),
    };
  });
};

const main = async () => {
  const prisma = new PrismaClient();
  try {
    const rows = readRows();
    for (const row of rows) {
      await prisma.fightOdds.upsert({
        where: { fighterAKey_fighterBKey: { fighterAKey: row.fighterAKey, fighterBKey: row.fighterBKey } },
        create: row,
        update: row,
      });
    }
    console.log(`FightOdds: upserted ${rows.length} rows`);
  } finally {
    await prisma.$disconnect();
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
