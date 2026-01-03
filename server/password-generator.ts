import crypto from 'crypto';

const ADJECTIVES = [
  'Swift', 'Bold', 'Bright', 'Cool', 'Fast', 'Green', 'Happy', 'Lucky', 
  'Quick', 'Sharp', 'Smart', 'Strong', 'Super', 'Wise', 'Epic', 'Prime'
];

const NOUNS = [
  'Lion', 'Eagle', 'Tiger', 'Hawk', 'Wolf', 'Bear', 'Falcon', 'Shark',
  'Dragon', 'Phoenix', 'Storm', 'Thunder', 'Star', 'Blaze', 'Spark', 'Flash'
];

export function generateSecurePassword(): string {
  const adjective = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const number = Math.floor(Math.random() * 900) + 100;
  const special = ['!', '@', '#', '$'][Math.floor(Math.random() * 4)];
  
  return `${adjective}${noun}${number}${special}`;
}

export function generateUsername(name: string, email: string): string {
  const cleanName = name.toLowerCase().replace(/\s+/g, '.');
  const suffix = Math.floor(Math.random() * 100);
  return `${cleanName}${suffix}`;
}

export function getAvatarInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
}
