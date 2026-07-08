// Bundles the modular game into one self-contained HTML file (dist/cloud-couriers.html)
// for publishing as a Claude Artifact or sharing as a single file.
import { execSync } from 'child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
mkdirSync(join(root, 'dist'), { recursive: true });

// 1) bundle all JS modules into a single IIFE
execSync('npx -y esbuild js/main.js --bundle --format=iife --outfile=dist/bundle.js', {
  cwd: root, stdio: 'inherit',
});

// 2) inline CSS + JS into the HTML shell
const html = readFileSync(join(root, 'index.html'), 'utf8');
const fontCss = readFileSync(join(root, 'css/font.css'), 'utf8');
const css = readFileSync(join(root, 'css/styles.css'), 'utf8');
const js = readFileSync(join(root, 'dist/bundle.js'), 'utf8');

const out = html
  .replace('<link rel="stylesheet" href="css/font.css">', '<style>\n' + fontCss + '\n</style>')
  .replace('<link rel="stylesheet" href="css/styles.css">', '<style>\n' + css + '\n</style>')
  .replace('<script type="module" src="js/main.js"></script>', '<script>\n' + js + '\n</script>');

writeFileSync(join(root, 'dist/cloud-couriers.html'), out);
console.log('Built dist/cloud-couriers.html (' + Math.round(out.length / 1024) + ' KB)');
