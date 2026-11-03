/** Utilitários gerais (sem dependência de React). */

export function cn(
  ...parts: Array<string | false | null | undefined>
): string {
  return parts.filter(Boolean).join(" ");
}

/**
 * Quebra um rótulo em linhas curtas para caber dentro de SVG.
 */
export function wrapLabel(
  text: string,
  maxChars: number,
  maxLines: number
): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  if (maxLines <= 1) {
    return [text.length > maxChars ? text.slice(0, maxChars - 1) + "…" : text];
  }

  const lines: string[] = [];
  let current = "";
  let index = 0;

  while (index < words.length) {
    const candidate = current ? `${current} ${words[index]}` : words[index];
    if (candidate.length <= maxChars || !current) {
      current = candidate;
      index += 1;
    } else {
      lines.push(current);
      current = "";
      if (lines.length === maxLines - 1) break;
    }
  }

  if (current && lines.length < maxLines) lines.push(current);

  // Ainda há palavras de fora? Trunca a última linha.
  const used = lines.join(" ").split(/\s+/).filter(Boolean).length;
  if (used < words.length && lines.length > 0) {
    const last = lines[lines.length - 1];
    lines[lines.length - 1] =
      last.length >= maxChars ? last.slice(0, maxChars - 1) + "…" : last;
  }

  return lines;
}

export function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(ts: number): string {
  return new Date(ts).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function relativeTime(ts: number, now = Date.now()): string {
  const diff = Math.max(0, now - ts);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "agora há pouco";
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "ontem";
  if (days < 30) return `há ${days} dias`;
  return formatDate(ts);
}

export function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
