const SENSITIVE_WORDS = [
  "违法", "赌博", "色情", "暴力",
];

export function filterSensitive(text: string): { clean: boolean; text: string } {
  let clean = true;
  let result = text;
  for (const word of SENSITIVE_WORDS) {
    if (result.includes(word)) {
      clean = false;
      result = result.replaceAll(word, "***");
    }
  }
  return { clean, text: result };
}
