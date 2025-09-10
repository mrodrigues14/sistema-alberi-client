import { PdfParser, PdfParserResult, PdfParseContext } from "./types";

// Very basic, bank-agnostic parser: extracts dates and amounts heuristically.
// You will replace/improve this with bank-specific logic later.
const dateRegex = /(\b\d{2}[\/-]\d{2}[\/-]\d{4}\b|\b\d{4}[\/-]\d{2}[\/-]\d{2}\b)/g;
const currencyRegex = /([-+]?\d{1,3}(?:\.\d{3})*,\d{2}|[-+]?\d+\.\d{2})/g; // BR formats

function normalizeMoneyToPreview(value: string): string {
  // Normalize common BR patterns: "1.234,56" -> "1234,56"
  let v = value.trim();
  if (/[,]/.test(v) && /[.]/.test(v)) {
    v = v.replace(/\./g, ""); // remove thousands
  }
  v = v.replace(/(,)/g, ",");
  // Keep as string with comma, Preview expects string and later converts
  return v;
}

function isLikelyHeader(line: string) {
  const l = line.toLowerCase();
  return (
    l.includes("saldo") || l.includes("extrato") || l.includes("conta") || l.length < 3
  );
}

export const genericPdfParser: PdfParser = {
  id: "generic",
  name: "Parser Genérico",
  sniff: () => true,
  async parse(ctx: PdfParseContext, text: string): Promise<PdfParserResult> {
    const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

    const linhas = [] as PdfParserResult["linhas"];
    const warnings: string[] = [];

    for (const line of lines) {
      if (isLikelyHeader(line)) continue;

      const dates = line.match(dateRegex) || [];
      const amounts = line.match(currencyRegex) || [];

      if (dates.length === 0 || amounts.length === 0) continue;

      const dataRaw = dates[0];
      const valorRaw = amounts[amounts.length - 1];

      const valorNorm = normalizeMoneyToPreview(valorRaw);

      const tipo = /-/.test(valorRaw) || /\bdeb\b|sa[ií]da|d[ée]bito/i.test(line)
        ? "saida"
        : "entrada";

      // crude description: remove date and amount
      let desc = line
        .replace(dataRaw ?? "", "")
        .replace(valorRaw ?? "", "")
        .replace(/\s{2,}/g, " ")
        .trim();

      linhas.push({
        data: (dataRaw ?? "").replace(/-/g, "/"), // Preview accepts dd/mm/yyyy or yyyy/mm/dd as string
        categoria: "",
        fornecedor: "",
        descricao: desc,
        nome: desc,
        rubricaContabil: "",
        tipo,
        valor: valorNorm,
      });
    }

    if (linhas.length === 0) {
      warnings.push("Não foi possível identificar linhas de lançamentos no PDF.");
    }

    return { linhas, warnings, meta: { bank: ctx.bank || null } };
  },
};
