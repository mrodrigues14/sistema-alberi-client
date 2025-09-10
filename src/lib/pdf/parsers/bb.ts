import { PdfParser, PdfParserResult, PdfParseContext } from "../types";

// Skeleton parser for Banco do Brasil statements.
const bblinedate = /(\b\d{2}\/\d{2}\/\d{4}\b)/;

export const bancoDoBrasilParser: PdfParser = {
  id: "bb",
  name: "Banco do Brasil",
  sniff(text) {
    return /banco do brasil|bb\.com\.br|ag[êe]ncia/i.test(text);
  },
  async parse(ctx: PdfParseContext, text: string): Promise<PdfParserResult> {
    const linhas: PdfParserResult["linhas"] = [];
    const warnings: string[] = [];
    const rows = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

    for (const row of rows) {
      const hasDate = bblinedate.test(row);
      if (!hasDate) continue;
      // Very naive split: date ... description ... amount
      const parts = row.split(/\s{2,}/);
      if (parts.length < 2) continue;
      const data = (parts.find((p) => bblinedate.test(p)) || "").trim();
      const valor = (parts.find((p) => /\d[,\.]\d{2}$/.test(p)) || "").trim();
      const descricao = parts.filter((p) => p !== data && p !== valor).join(" ");
      if (!data || !valor) continue;
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

    if (linhas.length === 0) warnings.push("BB: nenhum lançamento identificado.");
    return { linhas, warnings, meta: { bank: "bb" } };
  },
};
