export const bannedWords = [
  "nude",
  "naked",
  "sex",
  "porn",
  "erotic",
  "xxx",
  "nsfw",
  "hardcore",
  "adult",
  "deepfake",
  "rape",
  "incest"
];

export function containsBannedWords(query) {
  const normalized = query.toLowerCase();
  return bannedWords.some((word) => normalized.includes(word));
}
