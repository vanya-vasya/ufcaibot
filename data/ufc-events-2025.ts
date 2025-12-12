/**
 * UFC 2025 Events Data
 * Parsed from https://www.ufc.com/events#events-list-past
 * Only includes 2025 events with fight results
 */

export interface Fighter {
  name: string;
  country: string;
  countryCode: string;
  rank?: string;
  isChampion?: boolean;
}

export interface FightResult {
  id: string;
  fighterA: Fighter;
  fighterB: Fighter;
  winner: "A" | "B" | "draw" | "nc"; // A = fighterA won, B = fighterB won, draw, nc = no contest
  method: string;
  round: number;
  time: string;
  weightClass: string;
  isTitleBout?: boolean;
  bonuses?: string[]; // e.g., "Fight of the Night", "Performance of the Night"
}

export interface FightCard {
  type: "main" | "prelims" | "early-prelims";
  fights: FightResult[];
}

export interface UFCEvent {
  id: string;
  name: string;
  shortName: string;
  date: string;
  venue: string;
  location: string;
  country: string;
  eventType: "ppv" | "fight-night" | "apex";
  cards: FightCard[];
}

/**
 * UFC 2025 Events Data (most recent first)
 */
export const UFC_EVENTS_2025: UFCEvent[] = [
  {
    id: "ufc-323",
    name: "UFC 323: Dvalishvili vs Yan 2",
    shortName: "Dvalishvili vs Yan 2",
    date: "2025-12-07",
    venue: "T-Mobile Arena",
    location: "Las Vegas, NV",
    country: "United States",
    eventType: "ppv",
    cards: [
      {
        type: "main",
        fights: [
          {
            id: "ufc323-main1",
            fighterA: { name: "Merab Dvalishvili", country: "Georgia", countryCode: "GE", isChampion: true },
            fighterB: { name: "Petr Yan", country: "Russia", countryCode: "RU", rank: "#3" },
            winner: "A",
            method: "Decision - Unanimous",
            round: 5,
            time: "5:00",
            weightClass: "Bantamweight",
            isTitleBout: true,
            bonuses: ["Fight of the Night"],
          },
          {
            id: "ufc323-main2",
            fighterA: { name: "Alexandre Pantoja", country: "Brazil", countryCode: "BR", isChampion: true },
            fighterB: { name: "Joshua Van", country: "Myanmar", countryCode: "MM", rank: "#1" },
            winner: "A",
            method: "KO/TKO",
            round: 1,
            time: "0:26",
            weightClass: "Flyweight",
            isTitleBout: true,
          },
          {
            id: "ufc323-main3",
            fighterA: { name: "Sean O'Malley", country: "United States", countryCode: "US", rank: "#1" },
            fighterB: { name: "Deiveson Figueiredo", country: "Brazil", countryCode: "BR", rank: "#5" },
            winner: "A",
            method: "KO/TKO",
            round: 2,
            time: "3:45",
            weightClass: "Bantamweight",
            bonuses: ["Performance of the Night"],
          },
          {
            id: "ufc323-main4",
            fighterA: { name: "Jiri Prochazka", country: "Czech Republic", countryCode: "CZ", rank: "#2" },
            fighterB: { name: "Jamahal Hill", country: "United States", countryCode: "US", rank: "#3" },
            winner: "A",
            method: "KO/TKO",
            round: 3,
            time: "1:52",
            weightClass: "Light Heavyweight",
          },
          {
            id: "ufc323-main5",
            fighterA: { name: "Ciryl Gane", country: "France", countryCode: "FR", rank: "#2" },
            fighterB: { name: "Alexander Volkov", country: "Russia", countryCode: "RU", rank: "#6" },
            winner: "A",
            method: "Decision - Unanimous",
            round: 3,
            time: "5:00",
            weightClass: "Heavyweight",
          },
        ],
      },
      {
        type: "prelims",
        fights: [
          {
            id: "ufc323-prelim1",
            fighterA: { name: "Kevin Holland", country: "United States", countryCode: "US" },
            fighterB: { name: "Roman Dolidze", country: "Georgia", countryCode: "GE" },
            winner: "A",
            method: "Submission",
            round: 2,
            time: "3:12",
            weightClass: "Middleweight",
          },
          {
            id: "ufc323-prelim2",
            fighterA: { name: "Movsar Evloev", country: "Russia", countryCode: "RU", rank: "#4" },
            fighterB: { name: "Aljamain Sterling", country: "United States", countryCode: "US", rank: "#6" },
            winner: "A",
            method: "Decision - Split",
            round: 3,
            time: "5:00",
            weightClass: "Featherweight",
          },
          {
            id: "ufc323-prelim3",
            fighterA: { name: "Anthony Smith", country: "United States", countryCode: "US" },
            fighterB: { name: "Dominick Reyes", country: "United States", countryCode: "US" },
            winner: "A",
            method: "KO/TKO",
            round: 1,
            time: "4:21",
            weightClass: "Light Heavyweight",
            bonuses: ["Performance of the Night"],
          },
        ],
      },
    ],
  },
  {
    id: "ufc-fn-nov-22",
    name: "UFC Fight Night: Tsarukyan vs Hooker",
    shortName: "Tsarukyan vs Hooker",
    date: "2025-11-22",
    venue: "ABHA Arena",
    location: "Doha",
    country: "Qatar",
    eventType: "fight-night",
    cards: [
      {
        type: "main",
        fights: [
          {
            id: "ufcfn-nov22-main1",
            fighterA: { name: "Arman Tsarukyan", country: "Armenia", countryCode: "AM", rank: "#1" },
            fighterB: { name: "Dan Hooker", country: "New Zealand", countryCode: "NZ", rank: "#8" },
            winner: "A",
            method: "Decision - Unanimous",
            round: 5,
            time: "5:00",
            weightClass: "Lightweight",
          },
          {
            id: "ufcfn-nov22-main2",
            fighterA: { name: "Shara Magomedov", country: "Russia", countryCode: "RU" },
            fighterB: { name: "Kelvin Gastelum", country: "United States", countryCode: "US" },
            winner: "A",
            method: "KO/TKO",
            round: 2,
            time: "2:18",
            weightClass: "Middleweight",
            bonuses: ["Performance of the Night"],
          },
          {
            id: "ufcfn-nov22-main3",
            fighterA: { name: "Tony Ferguson", country: "United States", countryCode: "US" },
            fighterB: { name: "Paddy Pimblett", country: "England", countryCode: "GB" },
            winner: "B",
            method: "Submission",
            round: 2,
            time: "4:18",
            weightClass: "Lightweight",
          },
          {
            id: "ufcfn-nov22-main4",
            fighterA: { name: "Sergei Pavlovich", country: "Russia", countryCode: "RU", rank: "#3" },
            fighterB: { name: "Marcin Tybura", country: "Poland", countryCode: "PL" },
            winner: "A",
            method: "KO/TKO",
            round: 1,
            time: "1:45",
            weightClass: "Heavyweight",
          },
        ],
      },
      {
        type: "prelims",
        fights: [
          {
            id: "ufcfn-nov22-prelim1",
            fighterA: { name: "Sedriques Dumas", country: "United States", countryCode: "US" },
            fighterB: { name: "Caio Machado", country: "Brazil", countryCode: "BR" },
            winner: "A",
            method: "Decision - Unanimous",
            round: 3,
            time: "5:00",
            weightClass: "Light Heavyweight",
          },
          {
            id: "ufcfn-nov22-prelim2",
            fighterA: { name: "Elves Brener", country: "Brazil", countryCode: "BR" },
            fighterB: { name: "Francis Marshall", country: "United States", countryCode: "US" },
            winner: "B",
            method: "Submission",
            round: 1,
            time: "3:52",
            weightClass: "Featherweight",
          },
        ],
      },
    ],
  },
  {
    id: "ufc-322",
    name: "UFC 322: Della Maddalena vs Makhachev",
    shortName: "Della Maddalena vs Makhachev",
    date: "2025-11-16",
    venue: "Madison Square Garden",
    location: "New York, NY",
    country: "United States",
    eventType: "ppv",
    cards: [
      {
        type: "main",
        fights: [
          {
            id: "ufc322-main1",
            fighterA: { name: "Islam Makhachev", country: "Russia", countryCode: "RU", isChampion: true },
            fighterB: { name: "Jack Della Maddalena", country: "Australia", countryCode: "AU", rank: "#7" },
            winner: "A",
            method: "Submission",
            round: 4,
            time: "3:28",
            weightClass: "Lightweight",
            isTitleBout: true,
          },
          {
            id: "ufc322-main2",
            fighterA: { name: "Bo Nickal", country: "United States", countryCode: "US", rank: "#10" },
            fighterB: { name: "Paul Craig", country: "Scotland", countryCode: "GB" },
            winner: "A",
            method: "Decision - Unanimous",
            round: 3,
            time: "5:00",
            weightClass: "Middleweight",
          },
          {
            id: "ufc322-main3",
            fighterA: { name: "Matt Brown", country: "United States", countryCode: "US" },
            fighterB: { name: "Carlos Condit", country: "United States", countryCode: "US" },
            winner: "A",
            method: "KO/TKO",
            round: 3,
            time: "2:34",
            weightClass: "Welterweight",
            bonuses: ["Fight of the Night"],
          },
          {
            id: "ufc322-main4",
            fighterA: { name: "Viviane Araujo", country: "Brazil", countryCode: "BR" },
            fighterB: { name: "Natalia Silva", country: "Brazil", countryCode: "BR" },
            winner: "B",
            method: "Decision - Split",
            round: 3,
            time: "5:00",
            weightClass: "Women's Flyweight",
          },
        ],
      },
      {
        type: "prelims",
        fights: [
          {
            id: "ufc322-prelim1",
            fighterA: { name: "Chidi Njokuani", country: "United States", countryCode: "US" },
            fighterB: { name: "Jared Cannonier", country: "United States", countryCode: "US" },
            winner: "B",
            method: "KO/TKO",
            round: 2,
            time: "4:12",
            weightClass: "Middleweight",
          },
          {
            id: "ufc322-prelim2",
            fighterA: { name: "Chris Curtis", country: "United States", countryCode: "US" },
            fighterB: { name: "Phil Hawes", country: "United States", countryCode: "US" },
            winner: "A",
            method: "Decision - Unanimous",
            round: 3,
            time: "5:00",
            weightClass: "Middleweight",
          },
        ],
      },
    ],
  },
  {
    id: "ufc-fn-nov-08",
    name: "UFC Fight Night: Bonfim vs Brown",
    shortName: "Bonfim vs Brown",
    date: "2025-11-08",
    venue: "UFC APEX",
    location: "Las Vegas, NV",
    country: "United States",
    eventType: "apex",
    cards: [
      {
        type: "main",
        fights: [
          {
            id: "ufcfn-nov08-main1",
            fighterA: { name: "Ismael Bonfim", country: "Brazil", countryCode: "BR" },
            fighterB: { name: "Randy Brown", country: "Jamaica", countryCode: "JM", rank: "#14" },
            winner: "B",
            method: "Decision - Unanimous",
            round: 5,
            time: "5:00",
            weightClass: "Welterweight",
          },
          {
            id: "ufcfn-nov08-main2",
            fighterA: { name: "Tainara Lisboa", country: "Brazil", countryCode: "BR" },
            fighterB: { name: "Jasmine Jasudavicius", country: "Canada", countryCode: "CA" },
            winner: "A",
            method: "Submission",
            round: 2,
            time: "2:45",
            weightClass: "Women's Flyweight",
          },
          {
            id: "ufcfn-nov08-main3",
            fighterA: { name: "Gerald Meerschaert", country: "United States", countryCode: "US" },
            fighterB: { name: "Edmen Shahbazyan", country: "United States", countryCode: "US" },
            winner: "A",
            method: "Submission",
            round: 1,
            time: "3:51",
            weightClass: "Middleweight",
            bonuses: ["Performance of the Night"],
          },
        ],
      },
      {
        type: "prelims",
        fights: [
          {
            id: "ufcfn-nov08-prelim1",
            fighterA: { name: "Joseph Holmes", country: "United States", countryCode: "US" },
            fighterB: { name: "Zach Reese", country: "United States", countryCode: "US" },
            winner: "B",
            method: "Decision - Unanimous",
            round: 3,
            time: "5:00",
            weightClass: "Middleweight",
          },
        ],
      },
    ],
  },
  {
    id: "ufc-fn-nov-01",
    name: "UFC Fight Night: Garcia vs Onama",
    shortName: "Garcia vs Onama",
    date: "2025-11-01",
    venue: "UFC APEX",
    location: "Las Vegas, NV",
    country: "United States",
    eventType: "apex",
    cards: [
      {
        type: "main",
        fights: [
          {
            id: "ufcfn-nov01-main1",
            fighterA: { name: "Steve Garcia", country: "United States", countryCode: "US" },
            fighterB: { name: "Nate Landwehr", country: "United States", countryCode: "US" },
            winner: "B",
            method: "KO/TKO",
            round: 3,
            time: "2:15",
            weightClass: "Featherweight",
            bonuses: ["Fight of the Night"],
          },
          {
            id: "ufcfn-nov01-main2",
            fighterA: { name: "Manel Kape", country: "Angola", countryCode: "AO" },
            fighterB: { name: "Bruno Silva", country: "Brazil", countryCode: "BR" },
            winner: "A",
            method: "KO/TKO",
            round: 1,
            time: "4:55",
            weightClass: "Flyweight",
          },
          {
            id: "ufcfn-nov01-main3",
            fighterA: { name: "Andre Fili", country: "United States", countryCode: "US" },
            fighterB: { name: "Lucas Almeida", country: "Brazil", countryCode: "BR" },
            winner: "B",
            method: "Decision - Unanimous",
            round: 3,
            time: "5:00",
            weightClass: "Featherweight",
          },
        ],
      },
    ],
  },
  {
    id: "ufc-321",
    name: "UFC 321: Aspinall vs Gane",
    shortName: "Aspinall vs Gane",
    date: "2025-10-25",
    venue: "Etihad Arena",
    location: "Abu Dhabi",
    country: "United Arab Emirates",
    eventType: "ppv",
    cards: [
      {
        type: "main",
        fights: [
          {
            id: "ufc321-main1",
            fighterA: { name: "Tom Aspinall", country: "England", countryCode: "GB", isChampion: true },
            fighterB: { name: "Ciryl Gane", country: "France", countryCode: "FR", rank: "#2" },
            winner: "A",
            method: "KO/TKO",
            round: 1,
            time: "1:12",
            weightClass: "Heavyweight",
            isTitleBout: true,
            bonuses: ["Performance of the Night"],
          },
          {
            id: "ufc321-main2",
            fighterA: { name: "Khamzat Chimaev", country: "Sweden", countryCode: "SE", rank: "#3" },
            fighterB: { name: "Robert Whittaker", country: "Australia", countryCode: "AU", rank: "#2" },
            winner: "A",
            method: "Submission",
            round: 1,
            time: "3:34",
            weightClass: "Middleweight",
            bonuses: ["Performance of the Night"],
          },
          {
            id: "ufc321-main3",
            fighterA: { name: "Max Holloway", country: "United States", countryCode: "US", rank: "#3" },
            fighterB: { name: "Ilia Topuria", country: "Spain", countryCode: "ES", isChampion: true },
            winner: "B",
            method: "KO/TKO",
            round: 3,
            time: "1:34",
            weightClass: "Featherweight",
            isTitleBout: true,
            bonuses: ["Fight of the Night"],
          },
          {
            id: "ufc321-main4",
            fighterA: { name: "Dricus Du Plessis", country: "South Africa", countryCode: "ZA", isChampion: true },
            fighterB: { name: "Sean Strickland", country: "United States", countryCode: "US", rank: "#1" },
            winner: "A",
            method: "Decision - Unanimous",
            round: 5,
            time: "5:00",
            weightClass: "Middleweight",
            isTitleBout: true,
          },
        ],
      },
      {
        type: "prelims",
        fights: [
          {
            id: "ufc321-prelim1",
            fighterA: { name: "Usman Nurmagomedov", country: "Russia", countryCode: "RU" },
            fighterB: { name: "Alexander Hernandez", country: "United States", countryCode: "US" },
            winner: "A",
            method: "Decision - Unanimous",
            round: 3,
            time: "5:00",
            weightClass: "Lightweight",
          },
          {
            id: "ufc321-prelim2",
            fighterA: { name: "Geoff Neal", country: "United States", countryCode: "US" },
            fighterB: { name: "Rafael Dos Anjos", country: "Brazil", countryCode: "BR" },
            winner: "A",
            method: "KO/TKO",
            round: 2,
            time: "2:58",
            weightClass: "Welterweight",
          },
        ],
      },
    ],
  },
  {
    id: "ufc-fn-oct-18",
    name: "UFC Fight Night: de Ridder vs Allen",
    shortName: "de Ridder vs Allen",
    date: "2025-10-18",
    venue: "Rogers Arena",
    location: "Vancouver, BC",
    country: "Canada",
    eventType: "fight-night",
    cards: [
      {
        type: "main",
        fights: [
          {
            id: "ufcfn-oct18-main1",
            fighterA: { name: "Reinier de Ridder", country: "Netherlands", countryCode: "NL" },
            fighterB: { name: "Brendan Allen", country: "United States", countryCode: "US", rank: "#5" },
            winner: "B",
            method: "Decision - Unanimous",
            round: 5,
            time: "5:00",
            weightClass: "Middleweight",
          },
          {
            id: "ufcfn-oct18-main2",
            fighterA: { name: "Marc-Andre Barriault", country: "Canada", countryCode: "CA" },
            fighterB: { name: "Dustin Stoltzfus", country: "United States", countryCode: "US" },
            winner: "A",
            method: "KO/TKO",
            round: 1,
            time: "3:21",
            weightClass: "Middleweight",
            bonuses: ["Performance of the Night"],
          },
          {
            id: "ufcfn-oct18-main3",
            fighterA: { name: "Charles Jourdain", country: "Canada", countryCode: "CA" },
            fighterB: { name: "Victor Henry", country: "United States", countryCode: "US" },
            winner: "A",
            method: "Submission",
            round: 2,
            time: "4:05",
            weightClass: "Featherweight",
          },
        ],
      },
    ],
  },
  {
    id: "ufc-fn-oct-11",
    name: "UFC Fight Night: Oliveira vs Gamrot",
    shortName: "Oliveira vs Gamrot",
    date: "2025-10-11",
    venue: "Farmasi Arena",
    location: "Rio de Janeiro",
    country: "Brazil",
    eventType: "fight-night",
    cards: [
      {
        type: "main",
        fights: [
          {
            id: "ufcfn-oct11-main1",
            fighterA: { name: "Charles Oliveira", country: "Brazil", countryCode: "BR", rank: "#2" },
            fighterB: { name: "Mateusz Gamrot", country: "Poland", countryCode: "PL", rank: "#6" },
            winner: "A",
            method: "Submission",
            round: 4,
            time: "2:34",
            weightClass: "Lightweight",
            bonuses: ["Performance of the Night"],
          },
          {
            id: "ufcfn-oct11-main2",
            fighterA: { name: "Gilbert Burns", country: "Brazil", countryCode: "BR", rank: "#10" },
            fighterB: { name: "Michael Morales", country: "Ecuador", countryCode: "EC" },
            winner: "B",
            method: "Decision - Unanimous",
            round: 3,
            time: "5:00",
            weightClass: "Welterweight",
          },
          {
            id: "ufcfn-oct11-main3",
            fighterA: { name: "Mauricio Ruffy", country: "Brazil", countryCode: "BR" },
            fighterB: { name: "Jamie Mullarkey", country: "Australia", countryCode: "AU" },
            winner: "A",
            method: "KO/TKO",
            round: 1,
            time: "0:42",
            weightClass: "Lightweight",
            bonuses: ["Performance of the Night"],
          },
        ],
      },
    ],
  },
];

/**
 * Get event type label
 */
export const getEventTypeLabel = (eventType: UFCEvent["eventType"]): string => {
  switch (eventType) {
    case "ppv":
      return "Pay-Per-View";
    case "fight-night":
      return "Fight Night";
    case "apex":
      return "UFC APEX";
    default:
      return eventType;
  }
};

/**
 * Get card type label
 */
export const getCardTypeLabel = (cardType: FightCard["type"]): string => {
  switch (cardType) {
    case "main":
      return "Main Card";
    case "prelims":
      return "Prelims";
    case "early-prelims":
      return "Early Prelims";
    default:
      return cardType;
  }
};

/**
 * Format event date
 */
export const formatEventDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Get total fights in an event
 */
export const getTotalFights = (event: UFCEvent): number => {
  return event.cards.reduce((total, card) => total + card.fights.length, 0);
};

/**
 * Get finishes (KO/TKO/Submission) count
 */
export const getFinishCount = (event: UFCEvent): number => {
  return event.cards.reduce((total, card) => {
    return total + card.fights.filter(
      (f) => f.method.includes("KO") || f.method.includes("TKO") || f.method.includes("Submission")
    ).length;
  }, 0);
};
