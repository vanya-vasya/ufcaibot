/**
 * Loads the historical UFC CSVs into Postgres (FightHistory, FighterProfile).
 *
 * Usage:  DATABASE_URL=... node scripts/seed-fight-data.js
 * Safe to re-run: tables are cleared and refilled inside one transaction.
 */
const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const DATA_DIR = path.join(__dirname, "..", "prisma", "data");
const BATCH_SIZE = 500;

const parseCsv = (text) => {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"') inQuotes = true;
    else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && text[i + 1] === "\n") i += 1;
      row.push(field);
      field = "";
      if (row.some((value) => value !== "")) rows.push(row);
      row = [];
    } else field += char;
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const [header, ...body] = rows;
  return body.map((values) =>
    Object.fromEntries(header.map((name, index) => [name, values[index] ?? ""]))
  );
};

const readCsv = (fileName) =>
  parseCsv(fs.readFileSync(path.join(DATA_DIR, fileName), "utf8"));

const text = (value) => (value === "" || value === undefined ? null : value.trim());
const float = (value) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
};
const int = (value) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? Math.round(parsed) : null;
};
const bool = (value) => String(value).trim().toLowerCase() === "true";

const FIGHT_CORE_COLUMNS = [
  "RedFighter",
  "BlueFighter",
  "Date",
  "Location",
  "Country",
  "Winner",
  "TitleBout",
  "WeightClass",
  "Gender",
  "NumberOfRounds",
  "RedOdds",
  "BlueOdds",
  "Finish",
  "FinishDetails",
  "FinishRound",
  "FinishRoundTime",
  "TotalFightTimeSecs",
];

const toFightRecord = (row) => {
  const details = {};
  Object.entries(row).forEach(([column, value]) => {
    if (FIGHT_CORE_COLUMNS.includes(column) || value === "") return;
    const numeric = Number(value);
    details[column] = Number.isFinite(numeric) ? numeric : value;
  });

  return {
    redFighter: row.RedFighter.trim(),
    blueFighter: row.BlueFighter.trim(),
    date: new Date(`${row.Date}T00:00:00.000Z`),
    location: text(row.Location),
    country: text(row.Country),
    winner: text(row.Winner),
    titleBout: bool(row.TitleBout),
    weightClass: text(row.WeightClass),
    gender: text(row.Gender),
    numberOfRounds: int(row.NumberOfRounds),
    redOdds: int(row.RedOdds),
    blueOdds: int(row.BlueOdds),
    finish: text(row.Finish),
    finishDetails: text(row.FinishDetails),
    finishRound: int(row.FinishRound),
    finishRoundTime: text(row.FinishRoundTime),
    totalFightTimeSecs: int(row.TotalFightTimeSecs),
    details,
  };
};

const toProfileRecord = (row) => ({
  fighterId: row.Fighter_Id.trim(),
  fullName: row["Full Name"].trim(),
  nickname: text(row.Nickname),
  heightFt: float(row["Ht."]),
  weightLbs: float(row["Wt."]),
  stance: text(row.Stance),
  wins: int(row.W),
  losses: int(row.L),
  draws: int(row.D),
  belt: bool(row.Belt),
  avgRounds: float(row["Avg Rounds"]),
  avgFightTime: float(row["Avg Fight Time"]),
  knockdowns: float(row.KD),
  strikes: float(row.STR),
  takedowns: float(row.TD),
  submissions: float(row.SUB),
  control: float(row.Ctrl),
  sigStrPct: float(row["Sig. Str. %"]),
  headPct: float(row["Head_%"]),
  bodyPct: float(row["Body_%"]),
  legPct: float(row["Leg_%"]),
  distancePct: float(row["Distance_%"]),
  clinchPct: float(row["Clinch_%"]),
  groundPct: float(row["Ground_%"]),
  subAttempts: float(row["Sub. Att"]),
  reversals: float(row["Rev."]),
  weightClass: text(row.Weight_Class),
  gender: text(row.Gender),
  fightingStyle: text(row["Fighting Style"]),
});

const insertInBatches = async (model, records) => {
  for (let start = 0; start < records.length; start += BATCH_SIZE) {
    await model.createMany({
      data: records.slice(start, start + BATCH_SIZE),
      skipDuplicates: true,
    });
  }
};

const main = async () => {
  const prisma = new PrismaClient();
  try {
    const fights = readCsv("ufc-data.csv").map(toFightRecord);
    const profiles = readCsv("ufc-fighters-stats.csv").map(toProfileRecord);

    await prisma.$transaction(
      async (tx) => {
        await tx.fightHistory.deleteMany();
        await tx.fighterProfile.deleteMany();
        await insertInBatches(tx.fightHistory, fights);
        await insertInBatches(tx.fighterProfile, profiles);
      },
      { timeout: 120000, maxWait: 30000 }
    );

    console.log(
      `Seeded ${fights.length} fights and ${profiles.length} fighter profiles`
    );
  } finally {
    await prisma.$disconnect();
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
