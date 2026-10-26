/* 마크다운 원고를 면으로 바꾼다.
 *
 *   import 원고 from './원고.md?raw';
 *   import { pagesFromMarkdown } from '../../shared/viewer/markdown.js';
 *   document.getElementById('doc').innerHTML = pagesFromMarkdown(원고);
 *
 * 면은 손으로 나눈다. 원고에서 한 줄을 통째로 쓴 `<!-- page -->` 가 면 경계다.
 * 기계가 면을 나누지 않으므로, 넘친 면은 mountViewer({ checkOverflow: true }) 가
 * 화면에서 붉은 점선으로 알린다 — 그 자리에 `<!-- page -->` 를 하나 더 넣는다.
 *
 * 첫 면에 `<!-- page cover -->` 처럼 낱말을 붙이면 그 낱말이 면의 class 가 된다.
 */
import { marked } from 'marked';

const BREAK = /^[ \t]*<!--\s*page\b([^>]*?)-->[ \t]*$/m;

export function pagesFromMarkdown(md, { pageClass = 'page manuscript' } = {}) {
  const parts = [];
  let rest = md, cls = '';
  for (;;) {
    const m = rest.match(BREAK);
    if (!m) { parts.push([cls, rest]); break; }
    parts.push([cls, rest.slice(0, m.index)]);
    cls = m[1].trim();
    rest = rest.slice(m.index + m[0].length);
  }
  return parts
    .filter(([c, body]) => body.trim() || c)   // 원고 첫머리의 경계 앞 빈 조각은 버린다
    .map(([c, body]) => `<section class="${pageClass}${c ? ' ' + c : ''}">${marked.parse(body)}</section>`)
    .join('\n');
}
