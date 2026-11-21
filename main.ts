import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const MAX_CODE_POINTS = 280;

function countCodePoints(text: string): number {
  return [...text].length;
}

function assertValidEntryText(raw: Buffer): string {
  const text = new TextDecoder('utf-8', { fatal: true }).decode(raw);
  const codePoints = countCodePoints(text);
  if (codePoints < 1 || codePoints > MAX_CODE_POINTS) {
    throw new Error(`entry.txt code points ${codePoints} out of range (1..${MAX_CODE_POINTS})`);
  }
  if (text.trim().length === 0) {
    throw new Error('entry.txt cannot be whitespace only');
  }
  return text;
}

function main(): void {
  const rootDir = dirname(fileURLToPath(import.meta.url));
  const sourcePath = join(rootDir, 'entry.txt');
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
  const targetPath = join(outDir, 'entry.txt');

  const raw = readFileSync(sourcePath);
  const text = assertValidEntryText(raw);

  mkdirSync(outDir, { recursive: true });
  writeFileSync(targetPath, text, 'utf8');
}

main();
