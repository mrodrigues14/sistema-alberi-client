import { PdfParser, PdfParseContext } from "./types";
import { genericPdfParser } from "./genericParser";
import { itauParser } from "./parsers/itau";
import { bancoDoBrasilParser } from "./parsers/bb";
import { infinitePayParser } from "./parsers/infinitpay";

// Registry of parsers; start with a generic fallback.
const parsers: PdfParser[] = [
  // Order matters: more specific first, generic last
  itauParser,
  bancoDoBrasilParser,
  infinitePayParser,
  genericPdfParser,
];

export function registerParser(parser: PdfParser) {
  parsers.push(parser);
}

export function getParsers(): PdfParser[] {
  return parsers;
}

export async function pickAndParse(ctx: PdfParseContext, text: string) {
  console.log('[PDF] pickAndParse:start', { bankHint: ctx.bank, textSample: text.slice(0, 120) });
  // If bank is provided, pick exact parser; else sniff; else generic
  let chosen: PdfParser | undefined;
  if (ctx.bank) {
    chosen = parsers.find((p) => p.id === ctx.bank);
    console.log('[PDF] pickAndParse:byBankId', { found: !!chosen, parser: chosen?.id });
  }
  if (!chosen) {
    for (const p of parsers) {
      const ok = p.sniff ? p.sniff(text) : false;
      console.log('[PDF] sniff', { parser: p.id, ok });
      if (ok) { chosen = p; break; }
    }
  }
  if (!chosen) {
    chosen = parsers[parsers.length - 1]; // fallback to generic (last)
    console.log('[PDF] pickAndParse:fallback', { parser: chosen?.id });
  }
  if (!chosen) throw new Error("Nenhum parser PDF registrado.");
  console.log('[PDF] pickAndParse:chosen', { parser: chosen.id });
  return chosen.parse(ctx, text);
}
