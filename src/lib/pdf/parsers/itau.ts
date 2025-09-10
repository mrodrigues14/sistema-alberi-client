import { PdfParser, PdfParserResult, PdfParseContext } from "../types";

// Heuristic parser for Itaú statements. Replace regexes with accurate ones later.
const itaudate = /(\b\d{2}\/\d{2}\/\d{4}\b)/; // dd/mm/yyyy
const itauline = /^(\d{2}\/\d{2}\/\d{4})\s+(.+?)\s+(-?[\d\.]+,\d{2})$/;

export const itauParser: PdfParser = {
  id: "itau",
  name: "Itaú",
  sniff(text) {
    return /ita[uú]/i.test(text) || /banco it[aá]u/i.test(text);
  },
  async parse(ctx: PdfParseContext, text: string): Promise<PdfParserResult> {
    const linhas: PdfParserResult["linhas"] = [];
    const warnings: string[] = [];
    const rows = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

    for (const row of rows) {
      const m = row.match(itauline);
      if (!m) continue;
      const [, data, descricao, valor] = m;
      const tipo = /^-/.test(valor) ? "saida" : "entrada";
      linhas.push({
        data,
        categoria: "",
        fornecedor: "",
        descricao,
        nome: descricao,
        rubricaContabil: "",
        tipo,
        valor: valor.replace(/\./g, ""),
      });
    }

    if (linhas.length === 0) warnings.push("Itaú: nenhum lançamento identificado.");
    return { linhas, warnings, meta: { bank: "itau" } };
  },
};
