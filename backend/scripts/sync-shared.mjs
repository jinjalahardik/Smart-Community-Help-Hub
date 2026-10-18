// Mirrors the frontend modules the backend depends on into src/shared/ so the
// backend stays self-contained (required for Vercel serverless bundles, which
// cannot include files outside the backend root). Run after editing any of the
// frontend source files listed below:
//
//   npm run sync:shared
import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const backendRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = join(backendRoot, '..');

const FILES = [
  ['frontend/src/constants/categories.js', 'src/shared/constants/categories.js'],
  ['frontend/src/constants/roles.js', 'src/shared/constants/roles.js'],
  ['frontend/src/constants/celebrations.js', 'src/shared/constants/celebrations.js'],
  ['frontend/src/services/seedData.js', 'src/shared/services/seedData.js'],
];

for (const [src, dest] of FILES) {
  const from = join(repoRoot, src);
  const to = join(backendRoot, dest);
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
  console.log(`synced ${src} -> backend/${dest}`);
}
