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

/*
 * 파비콘 — 모든 쪽의 <head> 에 빌드가 넣는다. 새 자료도 손대지 않고 아이콘이 붙는다.
 * 아이콘의 정본은 luminousky.com 에 하나뿐이다. 저장소에 복사본을 두면 둘이 서로 달라지고,
 * 어느 쪽이 맞는지 아무도 모르게 된다. 그래서 가리키기만 한다.
 * 쪽에 rel="icon" 을 손으로 적지 않는다 — 이미 있으면 넣지 않으므로 두 곳이 갈라진다.
 */
const favicon = {
  name: 'printables-favicon',
  transformIndexHtml(html) {
    if (/rel=["']icon["']/.test(html)) return html;
    return [
      { tag: 'link', attrs: { rel: 'icon', href: 'https://luminousky.com/favicon.svg', type: 'image/svg+xml' }, injectTo: 'head' },
      { tag: 'link', attrs: { rel: 'apple-touch-icon', href: 'https://luminousky.com/apple-touch-icon.png' }, injectTo: 'head' }
    ];
  }
};

export default defineConfig({
  // itmir913.github.io 에 luminousky.com 이 붙어 있고, 이 저장소는 그 아래 /printables/ 다
  base: '/printables/',
  plugins: [tailwindcss(), favicon],
  build: {
    rollupOptions: { input: pages }
  }
});
