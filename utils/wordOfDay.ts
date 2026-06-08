const CURATED_WORDS = [
  'eloquent',
  'resilient',
  'ephemeral',
  'pragmatic',
  'benevolent',
  'meticulous',
  'innovation',
  'curiosity',
  'perseverance',
  'integrity',
  'empathy',
  'diligent',
  'ambiguous',
  'concise',
  'profound',
  'versatile',
  'tenacious',
  'articulate',
  'ingenious',
  'whimsical',
  'prudent',
  'vivid',
  'serene',
  'audacious',
  'lucid',
  'harmony',
  'gratitude',
  'wisdom',
  'clarity',
  'fortitude',
  'compassion',
  'diligence',
];

export function getWordOfDay(): string {
  const start = new Date(new Date().getFullYear(), 0, 0).getTime();
  const dayOfYear = Math.floor((Date.now() - start) / 86_400_000);
  return CURATED_WORDS[dayOfYear % CURATED_WORDS.length];
}
