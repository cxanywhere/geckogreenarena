import * as pdfParse from "pdf-parse";

interface PDFPageContent {
  pageNumber: number;
  text: string;
}

const pdfCache = new Map<string, PDFPageContent[]>();

export async function extractPDFContent(pdfUrl: string): Promise<PDFPageContent[]> {
  if (pdfCache.has(pdfUrl)) {
    return pdfCache.get(pdfUrl)!;
  }

  try {
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const pdfParser = (pdfParse as any).default || pdfParse;
    const data = await pdfParser(buffer);
    
    const pages: PDFPageContent[] = [];
    const rawText = data.text;
    
    const pageTexts = rawText.split(/\f/).filter((t: string) => t.trim().length > 0);
    
    pageTexts.forEach((text: string, index: number) => {
      pages.push({
        pageNumber: index + 1,
        text: text.trim(),
      });
    });

    if (pages.length === 0 && rawText.trim().length > 0) {
      const avgPageLength = Math.ceil(rawText.length / Math.max(data.numpages, 1));
      for (let i = 0; i < data.numpages; i++) {
        const start = i * avgPageLength;
        const end = Math.min((i + 1) * avgPageLength, rawText.length);
        const pageText = rawText.slice(start, end).trim();
        if (pageText.length > 0) {
          pages.push({
            pageNumber: i + 1,
            text: pageText,
          });
        }
      }
    }

    pdfCache.set(pdfUrl, pages);
    console.log(`Extracted ${pages.length} pages from PDF`);
    
    return pages;
  } catch (error) {
    console.error("PDF extraction error:", error);
    return [];
  }
}

export function getPDFPageContent(pages: PDFPageContent[], pageNumber: number): string {
  const page = pages.find(p => p.pageNumber === pageNumber);
  return page?.text || "";
}

export function getContentForRange(pages: PDFPageContent[], startPage: number, endPage: number): string {
  return pages
    .filter(p => p.pageNumber >= startPage && p.pageNumber <= endPage)
    .map(p => p.text)
    .join("\n\n");
}
