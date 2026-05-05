import type * as PDFJS from 'pdfjs-dist';

// Main pdfjs-dist build uses browser APIs (DOMMatrix etc.) unavailable in Node.js.
// Legacy build is the Node.js-compatible version.
const pdfjs = require('pdfjs-dist/legacy/build/pdf.mjs') as typeof PDFJS;

export const { getDocument, OPS, Util } = pdfjs;
export type { PDFPageProxy } from 'pdfjs-dist';
