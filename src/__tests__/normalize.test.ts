import { normalizeLigatures } from '../pdf2md.normalize';

describe('normalizeLigatures', () => {

    test('leaves plain ASCII text unchanged', () => {
        expect(normalizeLigatures('hello world')).toBe('hello world');
    });

    test('expands fi ligature (U+FB01)', () => {
        expect(normalizeLigatures('\uFB01le')).toBe('file');
    });

    test('expands fl ligature (U+FB02)', () => {
        expect(normalizeLigatures('\uFB02ow')).toBe('flow');
    });

    test('expands ff ligature (U+FB00)', () => {
        expect(normalizeLigatures('\uFB00ect')).toBe('ffect');
    });

    test('expands ffi ligature (U+FB03)', () => {
        expect(normalizeLigatures('\uFB03cient')).toBe('fficient');
    });

    test('expands ffl ligature (U+FB04)', () => {
        expect(normalizeLigatures('\uFB04uent')).toBe('ffluent');
    });

    test('expands st ligature (U+FB06)', () => {
        expect(normalizeLigatures('\uFB06ep')).toBe('step');
    });

    test('strips BMP PUA characters', () => {
        expect(normalizeLigatures('\uE001hello\uF001')).toBe('hello');
    });

    test('strips a PUA-only string to empty string', () => {
        expect(normalizeLigatures('\uE000\uF8FF')).toBe('');
    });

    test('handles mixed ligatures and PUA in one string', () => {
        expect(normalizeLigatures('e\uFB03cient\uE000')).toBe('efficient');
    });

    test('handles empty string', () => {
        expect(normalizeLigatures('')).toBe('');
    });

});
