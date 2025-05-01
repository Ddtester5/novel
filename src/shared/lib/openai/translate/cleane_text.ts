export const cleaneText = (text: string): string => {
  return text.replace(/[«»“"”`'*[\]{}\[]/g, "").trim();
};
