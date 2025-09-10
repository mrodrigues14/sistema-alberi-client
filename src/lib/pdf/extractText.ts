// Lightweight PDF text extraction using pdfjs-dist (browser) with lazy import to avoid SSR/type issues.
export async function extractPdfText(file: File): Promise<string> {
  console.log('[PDF] extractPdfText:start', { name: file.name, type: file.type, size: file.size });
  const pdfjs: any = await import('pdfjs-dist/build/pdf');
  console.log('[PDF] pdfjs loaded from build/pdf');

  // Read file and create a typed array (avoid buffer detachment issues)
  const buf = await file.arrayBuffer();
  const bytes = new Uint8Array(buf.byteLength);
  bytes.set(new Uint8Array(buf));
  console.log('[PDF] bytes prepared', { bytes: bytes.byteLength });

  // Try with worker using local module URL to avoid version mismatch
  let pdf: any | null = null;
  try {
    if (pdfjs?.GlobalWorkerOptions) {
      const workerUrl = new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).toString();
      pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
      console.log('[PDF] workerSrc configured (local URL)');
    }
    const task1 = pdfjs.getDocument({ data: bytes, useWorkerFetch: true, isEvalSupported: false, disableFontFace: true });
    pdf = await task1.promise;
    console.log('[PDF] document loaded', { pages: pdf.numPages, mode: 'worker-enabled' });
  } catch (err) {
    console.warn('[PDF] worker-enabled mode failed, fallback to worker-disabled', err);
    const task2 = pdfjs.getDocument({ data: bytes, disableWorker: true, isEvalSupported: false, disableFontFace: true, useWorkerFetch: false });
    pdf = await task2.promise;
    console.log('[PDF] document loaded', { pages: pdf.numPages, mode: 'worker-disabled' });
  }

  let text = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    console.log('[PDF] reading page', { page: i });
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((it: any) => (typeof it.str === 'string' ? it.str : ''));
    console.log('[PDF] page content', { page: i, items: strings.length });
    text += strings.join('\n') + '\n';
  }
  console.log('[PDF] extractPdfText:done', { textLength: text.length, mode: 'worker-disabled' });
  // Print a safe sample and first lines to visualize how the text arrives
  const sample = text.slice(0, 1500);
  console.log('[PDF] extractPdfText:textSample', sample);
  const firstLines = text.split(/\r?\n/).slice(0, 15);
  console.log('[PDF] extractPdfText:firstLines', firstLines);
  return text;
}
