import { PdfParser, PdfParserResult, PdfParseContext } from "../types";

export const infinitePayParser: PdfParser = {
  id: "infinitepay",
  name: "InfinitePay",
  sniff(text) {
    return /infinite\s*pay|infinitepay/i.test(text);
  },

  async parse(ctx: PdfParseContext, text: string): Promise<PdfParserResult> {
    const linhas: PdfParserResult["linhas"] = [];
    const warnings: string[] = [];

    const rawRows = text
      .split(/\r?\n/)
      .map((l) => l.replace(/\s+/g, " ").trim())
      .filter(Boolean);

    // aceita "+", "-", "−" (unicode)
    const SIGN_SRC = "[+\\-−]?";
    const AMOUNT_TAIL = new RegExp(`(${SIGN_SRC})\\s*(?:\\d[\\d\\s\\.]*)\\,\\d{2}\\s*$`);
    const DATE_BR = /(\d{2}\/\d{2}\/\d{4})/;

    const isSaldo = (s: string) => /\bsaldo\s+do\s+dia\b/i.test(s);
    const isHeader = (s: string) =>
      /relat[óo]rio|per[íi]odo|tipo de transa|detalhe|valor|saldo|cnpj|ouvidoria|ajuda@/i.test(s);

    const sanitizeValor = (raw: string) =>
      raw.replace(/\s+/g, "").replace(/\./g, ""); // mantém vírgula, remove espaços e pontos

    // 1) Agrupa linhas até achar um valor no fim
    const grouped: string[] = [];
    let buf = "";
    for (const line of rawRows) {
      buf = buf ? `${buf} ${line}` : line;
      if (AMOUNT_TAIL.test(line)) {
        grouped.push(buf.trim());
        buf = "";
      }
    }
    if (buf) grouped.push(buf.trim());

    // 2) Parse
    let currentDate: string | null = null;
    let lastLabel: string | null = null;

    for (const chunk of grouped) {
      // atualiza data se aparecer no chunk
      const mDate = chunk.match(DATE_BR);
      if (mDate) currentDate = mDate[1];

      // ignora cabeçalhos e "saldo do dia" (mesmo com 0,00 no fim)
      if (isHeader(chunk) || isSaldo(chunk)) {
        lastLabel = null;
        continue;
      }

      const mVal = chunk.match(AMOUNT_TAIL);
      if (!mVal) {
        // pode ser label útil (ex.: "Depósito de vendas")
        lastLabel = chunk;
        continue;
      }

      const sign = (mVal[1] || "").trim(); // "+", "-", "−" ou ""
      const amountPart = mVal[0];          // ex.: "+1 5 439,34"
      const valor = sanitizeValor(amountPart.replace(/^[+\-−]\s*/, "")); // "15439,34"

      // nome = tudo antes do valor
      let nome = chunk.slice(0, chunk.length - amountPart.length).trim();
      if (/Dep[óo]sito\s+InfinitePay/i.test(chunk) && lastLabel) {
        nome = `${lastLabel} - ${nome}`;
      }

      // —— Filtros anti-linha fantasma ——
      // 0,00 não contabiliza
      if (/^0,00$/.test(valor)) { lastLabel = null; continue; }
      // nome vazio? pula
      if (!nome) { lastLabel = null; continue; }

      // tipo definido SOMENTE pelo sinal
      let tipo: "entrada" | "saida" | "" = "";
      if (sign === "+") tipo = "entrada";
      else if (sign === "-" || sign === "−") tipo = "saida";

      const data = currentDate ?? "";

      linhas.push({
          data,
          valor,
          nome,
          tipo,
          categoria: "",
          fornecedor: "",
          rubricaContabil: "",
          descricao: ""
      });

      // reseta label para não “grudar” na próxima
      lastLabel = null;
    }

    if (linhas.length === 0) {
      warnings.push("InfinitePay: nenhum lançamento identificado.");
    }

    return { linhas, warnings, meta: { bank: "infinitepay" } };
  },
};
