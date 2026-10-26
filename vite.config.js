import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { globSync } from 'node:fs';

/*
 * 자료 하나 = index.html 하나다. 폴더 이름이 그대로 공개 주소가 된다.
 *   admissions/interview-guide/index.html → luminousky.com/printables/admissions/interview-guide/
 *
 * 새 자료를 더할 때 이 파일은 고치지 않는다. 폴더에 index.html 을 두면 저절로 빌드된다.
 */
const pages = Object.fromEntries(
  globSync('**/index.html', { exclude: (p) => /^(node_modules|dist)$/.test(p) })
    .map((p) => [p.replace(/\\/g, '/').replace(/\/?index\.html$/, '') || 'root', p])
);

export default defineConfig({
  // itmir913.github.io 에 luminousky.com 이 붙어 있고, 이 저장소는 그 아래 /printables/ 다
  base: '/printables/',
  plugins: [tailwindcss()],
  build: {
    rollupOptions: { input: pages }
  }
});
