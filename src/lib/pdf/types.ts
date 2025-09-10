import { LinhaExtrato } from "../../../types/LinhaExtrato";

export type BankId = string; // e.g., 'itau', 'bradesco', 'nubank'

export interface PdfParseContext {
  file: File;
  bank?: BankId | null;
  // extra hints (date range, locale, etc.)
  hints?: Record<string, unknown>;
}

export interface PdfParserResult {
  linhas: LinhaExtrato[];
  warnings?: string[];
  meta?: Record<string, unknown>;
}

export interface PdfParser {
  id: string;
  name: string;
  /** quick check to see if this parser likely applies to the document */
  sniff?(text: string): boolean;
  /** parse and map to Preview format */
  parse(ctx: PdfParseContext, text: string): Promise<PdfParserResult>;
}
