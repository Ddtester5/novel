class TextEditor {
  removeAfterKeyword(text: string, keyword: string) {
    const index = text.indexOf(keyword);
    if (index === -1) return text;
    return text.slice(0, index).trim();
  }
  limitSpaces(text: string, replacement: string): string {
    return text.replace(/\s{4,}/g, replacement);
  }
}

export const textEditor = new TextEditor();
