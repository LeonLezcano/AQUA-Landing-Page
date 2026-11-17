import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgPath = path.resolve(__dirname, '../package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

const parts = pkg.version.split('.');
let major = parseInt(parts[0] || '1', 10);
let minor = parseInt(parts[1] || '0', 10);
let patch = parseInt(parts[2] || '00', 10);

patch += 1;
const newPatch = patch < 10 ? `0${patch}` : `${patch}`;
pkg.version = `${major}.${minor}.${newPatch}`;

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
console.log(`[Version Bump] New version: v${pkg.version}`);
