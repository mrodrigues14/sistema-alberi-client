import { extractPdfText } from "./extractText";
import { pickAndParse } from "./registry";
import { PdfParseContext } from "./types";

export async function parsePdfToPreview(file: File, bankId?: string) {
  const text = await extractPdfText(file);
  const ctx: PdfParseContext = { file, bank: bankId ?? null };
  return pickAndParse(ctx, text);
}
