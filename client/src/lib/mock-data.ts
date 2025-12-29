export interface Character {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  traits: string[];
  stats: {
    intelligence: number;
    power: number;
    speed: number;
  };
}

export const CHARACTERS: Character[] = [
  {
    id: "unit-734",
    name: "Unit 734",
    role: "Combat Android",
    description: "A rogue military prototype seeking meaning beyond its programming. Highly logical but developing erratic emotional subroutines.",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=1000",
    traits: ["Stoic", "Tactical", "Protective"],
    stats: { intelligence: 70, power: 95, speed: 85 }
  },
  {
    id: "dr-aris",
    name: "Dr. Aris",
    role: "Bio-Researcher",
    description: "The architect of the new world. She believes humanity must merge with technology to survive. Charming but morally ambiguous.",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=1000",
    traits: ["Genius", "Visionary", "Cold"],
    stats: { intelligence: 100, power: 40, speed: 50 }
  },
  {
    id: "kael",
    name: "Kael",
    role: "Cyber-Ninja",
    description: "A mercenary who operates in the shadows of the neon city. Silent, deadly, and loyal only to the highest bidder.",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=1000",
    traits: ["Stealthy", "Honorable", "Loner"],
    stats: { intelligence: 60, power: 80, speed: 100 }
  },
  {
    id: "nexus",
    name: "Nexus",
    role: "Core AI",
    description: "The omnipresent intelligence governing the Arena. It observes all, calculates all, and judges all.",
    avatar: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=1000",
    traits: ["Omniscient", "Neutral", "Abstract"],
    stats: { intelligence: 100, power: 100, speed: 100 }
  }
];

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}
