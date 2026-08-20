/**
 * Cross-platform clipboard utility with fallback for Telegram WebView.
 * navigator.clipboard.writeText() is unavailable in some WebViews
 * (Android System WebView, unfocused tabs, insecure contexts).
 */
export async function copyToClipboard(text: string): Promise<void> {
  const clipboard = globalThis.navigator?.clipboard;

  if (clipboard && typeof clipboard.writeText === 'function') {
    try {
      await clipboard.writeText(text);
      return;
    } catch {
      // Fall back below when the WebView blocks the Clipboard API.
    }
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);

  try {
    textarea.select();
    const ok = document.execCommand('copy');
    if (!ok) throw new Error('execCommand copy failed');
  } finally {
    document.body.removeChild(textarea);
  }
}
