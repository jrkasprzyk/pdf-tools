import { spawnSync } from 'child_process'
import path from 'path'
import fs from 'fs/promises'
import { constants } from 'fs'
import os from 'os'

jest.setTimeout(60000)

const tempDir = os.tmpdir()
const CLI = path.resolve('cli.js')

interface CliResult {
  status: number
  stdout: string
  stderr: string
}

function runCli(args: string[]): CliResult {
  const result = spawnSync('node', [CLI, ...args], {
    cwd: process.cwd(),
    encoding: 'utf8',
  })
  return {
    status: result.status ?? 1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  }
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath, constants.F_OK)
    return true
  } catch {
    return false
  }
}

async function fileSizeBytes(filePath: string): Promise<number> {
  const stat = await fs.stat(filePath)
  return stat.size
}

// ── pdf2md ────────────────────────────────────────────────────────────────────

describe('pdf2md', () => {
  const fixture = path.join('src', '__tests__', 'toc.pdf')

  test('exits cleanly and creates .md and .fonts.json', async () => {
    const outpath = path.join(tempDir, 'cmd_pdf2md_outputs')
    const { status } = runCli(['pdf2md', fixture, '-o', outpath])

    expect(status).toBe(0)
    expect(await fileExists(path.join(outpath, 'toc.md'))).toBe(true)
    expect(await fileExists(path.join(outpath, 'toc.fonts.json'))).toBe(true)

    await fs.rm(outpath, { recursive: true, force: true })
  })

  test('.md file has content', async () => {
    const outpath = path.join(tempDir, 'cmd_pdf2md_content')
    runCli(['pdf2md', fixture, '-o', outpath])

    expect(await fileSizeBytes(path.join(outpath, 'toc.md'))).toBeGreaterThan(0)

    await fs.rm(outpath, { recursive: true, force: true })
  })

  test('.fonts.json is valid JSON', async () => {
    const outpath = path.join(tempDir, 'cmd_pdf2md_json')
    runCli(['pdf2md', fixture, '-o', outpath])

    const contents = await fs.readFile(path.join(outpath, 'toc.fonts.json'), 'utf8')
    expect(() => JSON.parse(contents)).not.toThrow()

    await fs.rm(outpath, { recursive: true, force: true })
  })

  test('custom page separator appears in .md output', async () => {
    const outpath = path.join(tempDir, 'cmd_pdf2md_sep')
    runCli(['pdf2md', fixture, '-o', outpath, '-ps', '***'])

    const contents = await fs.readFile(path.join(outpath, 'toc.md'), 'utf8')
    expect(contents).toContain('***')

    await fs.rm(outpath, { recursive: true, force: true })
  })
})

// ── pdf2images ────────────────────────────────────────────────────────────────

describe('pdf2images', () => {
  const fixture = path.join('src', '__tests__', 'toc.pdf')

  test('exits cleanly and creates page-1.png', async () => {
    const outpath = path.join(tempDir, 'cmd_pdf2images_pages')
    const { status } = runCli(['pdf2images', fixture, '-o', outpath])

    expect(status).toBe(0)
    expect(await fileExists(path.join(outpath, 'page-1.png'))).toBe(true)

    await fs.rm(outpath, { recursive: true, force: true })
  })

  test('all page images are non-empty PNG files', async () => {
    const outpath = path.join(tempDir, 'cmd_pdf2images_nonempty')
    runCli(['pdf2images', fixture, '-o', outpath])

    const files = await fs.readdir(outpath)
    const pngs = files.filter(f => f.startsWith('page-') && f.endsWith('.png'))

    expect(pngs.length).toBeGreaterThan(0)

    for (const png of pngs) {
      expect(await fileSizeBytes(path.join(outpath, png))).toBeGreaterThan(0)
    }

    await fs.rm(outpath, { recursive: true, force: true })
  })
})

// ── pdfximages ────────────────────────────────────────────────────────────────

describe('pdfximages', () => {
  // Example_Presentation.pdf is a presentation known to contain at least one embedded image
  const fixture = path.join('samples', 'Example_Presentation.pdf')

  test('exits cleanly and creates output directory', async () => {
    const outpath = path.join(tempDir, 'cmd_pdfximages_dir')
    const { status } = runCli(['pdfximages', fixture, '-o', outpath])

    expect(status).toBe(0)
    expect(await fileExists(outpath)).toBe(true)

    await fs.rm(outpath, { recursive: true, force: true })
  })

  test('extracts embedded images as non-empty PNG files', async () => {
    const outpath = path.join(tempDir, 'cmd_pdfximages_files')
    runCli(['pdfximages', fixture, '-o', outpath])

    const files = await fs.readdir(outpath)
    const pngs = files.filter(f => f.endsWith('.png'))

    expect(pngs.length).toBeGreaterThan(0)

    for (const png of pngs) {
      expect(await fileSizeBytes(path.join(outpath, png))).toBeGreaterThan(0)
    }

    await fs.rm(outpath, { recursive: true, force: true })
  })

  test('two runs on same PDF produce same image count', async () => {
    const outpath1 = path.join(tempDir, 'cmd_pdfximages_run1')
    const outpath2 = path.join(tempDir, 'cmd_pdfximages_run2')

    runCli(['pdfximages', fixture, '-o', outpath1])
    runCli(['pdfximages', fixture, '-o', outpath2])

    const count1 = (await fs.readdir(outpath1)).filter(f => f.endsWith('.png')).length
    const count2 = (await fs.readdir(outpath2)).filter(f => f.endsWith('.png')).length

    expect(count1).toBeGreaterThan(0)
    expect(count2).toEqual(count1)

    await Promise.all([
      fs.rm(outpath1, { recursive: true, force: true }),
      fs.rm(outpath2, { recursive: true, force: true }),
    ])
  })
})
