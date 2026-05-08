<img src="https://img.shields.io/github/forks/jrkasprzyk/pdf-tools.svg">&nbsp;
<img src="https://img.shields.io/github/stars/jrkasprzyk/pdf-tools.svg">&nbsp;
<a href="https://github.com/jrkasprzyk/pdf-tools/issues">
<img src="https://img.shields.io/github/issues/jrkasprzyk/pdf-tools.svg"></a>&nbsp;

# pdf-tools

Tools to extract/transform data from PDF.

> This is a fork of [@bsorrentino/pdf-tools](https://github.com/bsorrentino/pdf-tools) with active improvements. A pull request upstream may follow, but this fork stands on its own.
>
> Inspired by [pdf-to-markdown](https://github.com/jzillmann/pdf-to-markdown).

## Installation

This fork is not published to npm. Install directly from source:

```bash
git clone https://github.com/jrkasprzyk/pdf-tools.git
cd pdf-tools
npm install
npm link
```

`npm link` registers `pdftools` as a global command pointing to your local clone. Changes to compiled output in `bin/` take effect immediately. To rebuild after editing TypeScript sources:

```bash
npm run build
```

## Requirements

* Node.js >= 16
* No additional system dependencies — [`@napi-rs/canvas`](https://www.npmjs.com/package/@napi-rs/canvas) ships prebuilt NAPI binaries

## pdftools Commands

### Output path behavior

By default, output goes into a folder named after the PDF (without extension), created in your **current working directory**:

```bash
pdftools pdf2md report.pdf
# → creates ./report/ in the current directory

pdftools pdf2md /some/other/path/report.pdf
# → still creates ./report/ in the current directory
```

Use `-o` to control where output lands:

```bash
# Output to a specific directory
pdftools pdf2md report.pdf -o /path/to/output/

# Output into the current directory (no subfolder)
pdftools pdf2md report.pdf -o .

# Output next to the PDF (macOS/Linux)
pdftools pdf2md /path/to/report.pdf -o $(dirname /path/to/report.pdf)

# Output next to the PDF (Windows PowerShell)
pdftools pdf2md C:\docs\report.pdf -o (Split-Path C:\docs\report.pdf)
```

The output folder is created automatically if it does not exist.

---

### pdfximages

Extract embedded images (as PNG) from a PDF.

```
pdftools pdfximages|pxi [options] <pdf>
```

**Options:**
```
-o, --outdir [folder]   output folder (default: <pdf-name>/ in current directory)
```

**Example:**
```bash
pdftools pxi slides.pdf -o ./images/
```

---

### pdf2images

Render each PDF page as a PNG image.

```
pdftools pdf2images|p2i [options] <pdf>
```

**Options:**
```
-o, --outdir [folder]   output folder (default: <pdf-name>/ in current directory)
```

**Example:**
```bash
pdftools p2i slides.pdf -o ./pages/
```

---

### pdf2md

Convert a PDF to Markdown.

```
pdftools pdf2md|p2md [options] <pdf>
```

**Options:**
```
-o, --outdir [folder]             output folder (default: <pdf-name>/ in current directory)
-ps, --pageseparator [separator]  page separator string (default: "---")
--imageurl [url prefix]           prefix for image URLs in the markdown output
--stats                           print conversion statistics
--debug                           print debug information
```

**Examples:**
```bash
# Basic conversion
pdftools pdf2md report.pdf

# Output next to the source PDF (macOS/Linux)
pdftools pdf2md /docs/report.pdf -o $(dirname /docs/report.pdf)

# No page separators, images served from a CDN prefix
pdftools pdf2md report.pdf -ps "" --imageurl https://cdn.example.com/images/
```

---

## Markdown Conversion — Supported Features

* Detect headers
* Detect and extract images
* Extract plain text
* Extract fonts with custom mapping via `<document-name>.font.json`
  > Supported styles: **bold**, _italic_, `monospace`, **_bold+italic_**
* Normalize font ligatures (fi, fl, ff, ffi, ffl) and strip Private Use Area (PUA) codepoints
* Detect code blocks (`` ``` ``)
* Detect external links

## To Do

* Detect table of contents (TOC)
