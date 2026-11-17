import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

function generateVersionPlugin() {
  return {
    name: 'generate-version-json',
    buildStart() {
      const versionFile = path.resolve(__dirname, 'public/version.json');
      const now = Date.now();
      const versionData = {
        timestamp: now,
        date: new Date(now).toISOString(),
        version: '1.0.00'
      };
      fs.mkdirSync(path.dirname(versionFile), { recursive: true });
      fs.writeFileSync(versionFile, JSON.stringify(versionData, null, 2));

      const swFile = path.resolve(__dirname, 'public/sw.js');
      if (fs.existsSync(swFile)) {
        let swContent = fs.readFileSync(swFile, 'utf8');
        if (/const\s+CACHE_NAME\s*=\s*['"][^'"]+['"];/.test(swContent)) {
          swContent = swContent.replace(
            /const\s+CACHE_NAME\s*=\s*['"][^'"]+['"];/,
            `const CACHE_NAME = 'aqua-landing-cache-${now}';`
          );
          fs.writeFileSync(swFile, swContent);
        }
      }
    }
  };
}

export default defineConfig({
  plugins: [generateVersionPlugin()],
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'esnext',
    minify: false,
    chunkSizeWarningLimit: 600
  }
});
