class TextEditor {
  removeAfterKeyword(text: string, keyword: string) {
    const index = text.indexOf(keyword);
    if (index === -1) return text;
    return text.slice(0, index).trim();
  }
  limitSpaces(text: string, maxSpaces = 3): string {
    const replacement = " ".repeat(maxSpaces);
    return text.replace(/\s{4,}/g, replacement);
  }
}

export const textEditor = new TextEditor();
