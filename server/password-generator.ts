import crypto from 'crypto';

const ADJECTIVES = [
  'Swift', 'Bold', 'Bright', 'Cool', 'Fast', 'Green', 'Happy', 'Lucky', 
  'Quick', 'Sharp', 'Smart', 'Strong', 'Super', 'Wise', 'Epic', 'Prime',
  'Brave', 'Calm', 'Deep', 'Elite', 'Fresh', 'Grand', 'Keen', 'Noble',
  'Proud', 'Rare', 'Safe', 'True', 'Vast', 'Wild', 'Zinc', 'Alpha',
  'Beta', 'Cyber', 'Delta', 'Echo', 'Focal', 'Gamma', 'Hyper', 'Ionic',
  'Jade', 'Kilo', 'Laser', 'Mega', 'Nova', 'Omega', 'Pixel', 'Quantum'
];

const NOUNS = [
  'Lion', 'Eagle', 'Tiger', 'Hawk', 'Wolf', 'Bear', 'Falcon', 'Shark',
  'Dragon', 'Phoenix', 'Storm', 'Thunder', 'Star', 'Blaze', 'Spark', 'Flash',
  'Arrow', 'Blade', 'Cloud', 'Drift', 'Ember', 'Frost', 'Glyph', 'Haven',
  'Jade', 'Knight', 'Lunar', 'Matrix', 'Nexus', 'Orbit', 'Prism', 'Quartz',
  'Ridge', 'Sigma', 'Terra', 'Unity', 'Vertex', 'Wave', 'Xenon', 'Zephyr',
  'Anchor', 'Beacon', 'Canyon', 'Dune', 'Flare', 'Grove', 'Helix', 'Isle'
];

const SPECIAL_CHARS = ['!', '@', '#', '$', '%', '&', '*'];

function secureRandomInt(max: number): number {
  return crypto.randomInt(0, max);
}

export function generateSecurePassword(): string {
  const adjective = ADJECTIVES[secureRandomInt(ADJECTIVES.length)];
  const noun = NOUNS[secureRandomInt(NOUNS.length)];
  const number = secureRandomInt(9000) + 1000;
  const special1 = SPECIAL_CHARS[secureRandomInt(SPECIAL_CHARS.length)];
  const special2 = SPECIAL_CHARS[secureRandomInt(SPECIAL_CHARS.length)];
  
  return `${adjective}${noun}${number}${special1}${special2}`;
}

export function getAvatarInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}
