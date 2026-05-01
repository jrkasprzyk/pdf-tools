/**
 * Regex matching Unicode Private Use Area (PUA) codepoints.
 * BMP PUA: U+E000–U+F8FF
 */
const PUA_REGEX = /[\uE000-\uF8FF]/g;

/**
 * Normalizes ligatures and PUA characters in PDF-extracted text.
 *
 * PDFs often encode ligatures (fi, fl, ff, ffi, ffl, st, etc.) as Unicode
 * Alphabetic Presentation Forms (U+FB00–U+FB06) and use Private Use Area
 * (PUA) codepoints for custom glyphs. This function:
 *   1. Applies NFKC normalization to expand compatibility ligatures back to
 *      their component ASCII characters.
 *   2. Strips residual BMP PUA codepoints (U+E000–U+F8FF) that have no
 *      standard mapping and would otherwise appear verbatim in the output.
 *
 * @param {string} text - The raw text extracted from a PDF.
 * @returns {string} The normalized text with ligatures expanded and PUA
 *                   codepoints removed.
 */
export function normalizeLigatures(text: string): string {
    return text.normalize('NFKC').replace(PUA_REGEX, '');
}
