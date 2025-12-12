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
            winner: "B",
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
            winner: "B",
            method: "KO/TKO",
            round: 1,
            time: "0:26",
            weightClass: "Flyweight",
            isTitleBout: true,
          },
          {
            id: "ufc323-main3",
            fighterA: { name: "Brandon Moreno", country: "Mexico", countryCode: "MX" },
            fighterB: { name: "Tatsuro Taira", country: "Japan", countryCode: "JP" },
            winner: "B",
            method: "KO/TKO",
            round: 2,
            time: "2:24",
            weightClass: "Flyweight",
          },
        ],
      },
      {
        type: "prelims",
        fights: [
          {
            id: "ufc323-prelim1",
            fighterA: { name: "Grant Dawson", country: "United States", countryCode: "US" },
            fighterB: { name: "Manuel Torres", country: "Mexico", countryCode: "MX" },
            winner: "B",
            method: "KO/TKO",
            round: 1,
            time: "2:25",
            weightClass: "Lightweight",
            bonuses: ["Performance of the Night"],
          },
          {
            id: "ufc323-prelim2",
            fighterA: { name: "Henry Cejudo", country: "United States", countryCode: "US" },
            fighterB: { name: "Payton Talbott", country: "United States", countryCode: "US" },
            winner: "B",
            method: "Decision - Unanimous",
            round: 3,
            time: "5:00",
            weightClass: "Bantamweight",
          },
          {
            id: "ufc323-prelim3",
            fighterA: { name: "Jan Błachowicz", country: "Poland", countryCode: "PL" },
            fighterB: { name: "Bogdan Guskov", country: "Uzbekistan", countryCode: "UZ" },
            winner: "draw",
            method: "Decision - Majority",
            round: 3,
            time: "5:00",
            weightClass: "Light Heavyweight",
          },
          {
            id: "ufc323-prelim4",
            fighterA: { name: "Terrance McKinney", country: "United States", countryCode: "US" },
            fighterB: { name: "Chris Duncan", country: "Scotland", countryCode: "GB" },
            winner: "B",
            method: "Submission",
            round: 1,
            time: "2:30",
            weightClass: "Lightweight",
          },
          {
            id: "ufc323-prelim5",
            fighterA: { name: "Maycee Barber", country: "United States", countryCode: "US" },
            fighterB: { name: "Karine Silva", country: "Brazil", countryCode: "BR" },
            winner: "A",
            method: "Decision - Unanimous",
            round: 3,
            time: "5:00",
            weightClass: "Women's Flyweight",
          },
          {
            id: "ufc323-prelim6",
            fighterA: { name: "Nazim Sadykhov", country: "Azerbaijan", countryCode: "AZ" },
            fighterB: { name: "Farès Ziam", country: "France", countryCode: "FR" },
            winner: "B",
            method: "KO/TKO",
            round: 2,
            time: "4:59",
            weightClass: "Lightweight",
          },
        ],
      },
      {
        type: "early-prelims",
        fights: [
          {
            id: "ufc323-early1",
            fighterA: { name: "Marvin Vettori", country: "Italy", countryCode: "IT" },
            fighterB: { name: "Brunno Ferreira", country: "Brazil", countryCode: "BR" },
            winner: "B",
            method: "Decision - Unanimous",
            round: 3,
            time: "5:00",
            weightClass: "Middleweight",
          },
          {
            id: "ufc323-early2",
            fighterA: { name: "Edson Barboza", country: "Brazil", countryCode: "BR" },
            fighterB: { name: "Jalin Turner", country: "United States", countryCode: "US" },
            winner: "B",
            method: "KO/TKO",
            round: 1,
            time: "2:24",
            weightClass: "Lightweight",
          },
          {
            id: "ufc323-early3",
            fighterA: { name: "Iwo Baraniewski", country: "Poland", countryCode: "PL" },
            fighterB: { name: "Ibo Aslan", country: "Türkiye", countryCode: "TR" },
            winner: "A",
            method: "KO/TKO",
            round: 1,
            time: "1:29",
            weightClass: "Light Heavyweight",
            bonuses: ["Performance of the Night"],
          },
          {
            id: "ufc323-early4",
            fighterA: { name: "Mansur Abdul-Malik", country: "United States", countryCode: "US" },
            fighterB: { name: "Antonio Trocoli", country: "Brazil", countryCode: "BR" },
            winner: "A",
            method: "Submission",
            round: 1,
            time: "1:09",
            weightClass: "Middleweight",
          },
          {
            id: "ufc323-early5",
            fighterA: { name: "Muhammad Naimov", country: "Tajikistan", countryCode: "TJ" },
            fighterB: { name: "Mairon Santos", country: "Brazil", countryCode: "BR" },
            winner: "B",
            method: "KO/TKO",
            round: 3,
            time: "0:21",
            weightClass: "Featherweight",
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
    venue: "Etihad Arena",
    location: "Abu Dhabi",
    country: "United Arab Emirates",
    eventType: "fight-night",
    cards: [
      {
        type: "main",
        fights: [
          {
            id: "ufcfn-nov22-main1",
            fighterA: { name: "Arman Tsarukyan", country: "Armenia", countryCode: "AM", rank: "#1" },
            fighterB: { name: "Dan Hooker", country: "New Zealand", countryCode: "NZ", rank: "#6" },
            winner: "A",
            method: "Submission",
            round: 2,
            time: "3:34",
            weightClass: "Lightweight",
            bonuses: ["Performance of the Night"],
          },
          {
            id: "ufcfn-nov22-main2",
            fighterA: { name: "Belal Muhammad", country: "Palestine", countryCode: "PS", rank: "#2" },
            fighterB: { name: "Ian Machado Garry", country: "Ireland", countryCode: "IE", rank: "#6" },
            winner: "B",
            method: "Decision - Unanimous",
            round: 3,
            time: "5:00",
            weightClass: "Welterweight",
          },
          {
            id: "ufcfn-nov22-main3",
            fighterA: { name: "Volkan Oezdemir", country: "Switzerland", countryCode: "CH", rank: "#9" },
            fighterB: { name: "Alonzo Menifield", country: "United States", countryCode: "US", rank: "#14" },
            winner: "B",
            method: "KO/TKO",
            round: 1,
            time: "1:27",
            weightClass: "Light Heavyweight",
          },
          {
            id: "ufcfn-nov22-main4",
            fighterA: { name: "Jack Hermansson", country: "Sweden", countryCode: "SE" },
            fighterB: { name: "Myktybek Orolbai", country: "Kyrgyzstan", countryCode: "KG" },
            winner: "B",
            method: "KO/TKO",
            round: 1,
            time: "2:46",
            weightClass: "Welterweight",
          },
          {
            id: "ufcfn-nov22-main5",
            fighterA: { name: "Waldo Cortes Acosta", country: "Dominican Republic", countryCode: "DO", rank: "#6" },
            fighterB: { name: "Shamil Gaziev", country: "Bahrain", countryCode: "BH", rank: "#11" },
            winner: "A",
            method: "KO/TKO",
            round: 1,
            time: "1:22",
            weightClass: "Heavyweight",
            bonuses: ["Performance of the Night"],
          },
          {
            id: "ufcfn-nov22-main6",
            fighterA: { name: "Tagir Ulanbekov", country: "Russia", countryCode: "RU", rank: "#11" },
            fighterB: { name: "Kyoji Horiguchi", country: "Japan", countryCode: "JP" },
            winner: "B",
            method: "Submission",
            round: 3,
            time: "2:18",
            weightClass: "Flyweight",
            bonuses: ["Performance of the Night"],
          },
        ],
      },
      {
        type: "prelims",
        fights: [
          {
            id: "ufcfn-nov22-prelim1",
            fighterA: { name: "Bogdan Grad", country: "Austria", countryCode: "AT" },
            fighterB: { name: "Luke Riley", country: "England", countryCode: "GB" },
            winner: "B",
            method: "KO/TKO",
            round: 2,
            time: "0:30",
            weightClass: "Featherweight",
            bonuses: ["Performance of the Night"],
          },
          {
            id: "ufcfn-nov22-prelim2",
            fighterA: { name: "Nicolas Dalby", country: "Denmark", countryCode: "DK" },
            fighterB: { name: "Saygid Izagakhmaev", country: "Russia", countryCode: "RU" },
            winner: "A",
            method: "Decision - Split",
            round: 3,
            time: "5:00",
            weightClass: "Welterweight",
          },
          {
            id: "ufcfn-nov22-prelim3",
            fighterA: { name: "Alex Perez", country: "United States", countryCode: "US", rank: "#7" },
            fighterB: { name: "Asu Almabayev", country: "Kazakhstan", countryCode: "KZ", rank: "#8" },
            winner: "B",
            method: "Submission",
            round: 3,
            time: "0:22",
            weightClass: "Flyweight",
          },
          {
            id: "ufcfn-nov22-prelim4",
            fighterA: { name: "Abdul Rakhman Yakhyaev", country: "Türkiye", countryCode: "TR" },
            fighterB: { name: "Rafael Cerqueira", country: "Brazil", countryCode: "BR" },
            winner: "A",
            method: "Submission",
            round: 1,
            time: "0:33",
            weightClass: "Light Heavyweight",
          },
          {
            id: "ufcfn-nov22-prelim5",
            fighterA: { name: "Bekzat Almakhan", country: "Kazakhstan", countryCode: "KZ" },
            fighterB: { name: "Aleksandre Topuria", country: "Georgia", countryCode: "GE" },
            winner: "B",
            method: "Decision - Unanimous",
            round: 3,
            time: "5:00",
            weightClass: "Bantamweight",
          },
          {
            id: "ufcfn-nov22-prelim6",
            fighterA: { name: "Ismail Naurdiev", country: "Morocco", countryCode: "MA" },
            fighterB: { name: "Ryan Loder", country: "United States", countryCode: "US" },
            winner: "A",
            method: "KO/TKO",
            round: 1,
            time: "1:26",
            weightClass: "Middleweight",
          },
          {
            id: "ufcfn-nov22-prelim7",
            fighterA: { name: "Nurullo Aliev", country: "Tajikistan", countryCode: "TJ" },
            fighterB: { name: "Shem Rock", country: "United States", countryCode: "US" },
            winner: "A",
            method: "Decision - Unanimous",
            round: 3,
            time: "5:00",
            weightClass: "Lightweight",
          },
          {
            id: "ufcfn-nov22-prelim8",
            fighterA: { name: "Marek Bujlo", country: "Poland", countryCode: "PL" },
            fighterB: { name: "Denzel Freeman", country: "United States", countryCode: "US" },
            winner: "B",
            method: "Decision - Unanimous",
            round: 3,
            time: "5:00",
            weightClass: "Heavyweight",
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
