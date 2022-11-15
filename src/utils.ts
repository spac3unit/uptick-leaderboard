export function truncate(text: string, startChars: number, endChars: number, totalLength: number) {
  if (text.length > totalLength) {
    let start = text.substring(0, startChars);
    let end = text.substring(text.length - endChars, text.length);
    while (start.length + end.length < totalLength) {
      start = start + '.';
    }
    return start + end;
  }
  return text;
}
