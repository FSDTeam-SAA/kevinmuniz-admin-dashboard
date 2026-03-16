export function sanitizeNotificationText(text: string): string {
  return text
    .replace(
      /[\u2190-\u21FF\u2300-\u27BF\u2B00-\u2BFF\uD83C-\uDBFF\uDC00-\uDFFF\uFE0F\u200D]/g,
      '',
    )
    .replace(/\s+/g, ' ')
    .trim()
}
