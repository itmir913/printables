/* 원고/ 조각을 면접지도가이드북.html 틀에 부어 단일 파일을 만든다.
 *
 *   node 가이드북빌드.js       →  _배부용/면접지도가이드북.html
 *
 * 평소 작업에는 필요 없다. 면접지도가이드북.html 을 localhost 로 열면 그만이다.
 * 이 스크립트는 파일 하나로 다른 사람에게 건네야 할 때만 쓴다.
 * 산출물은 style.css 와 공통.js 를 안에 품는다. 그래야 파일 하나만 건네도 열린다.
 * (원고에는 style="..." 을 쓰지 않는다. 여기서 <style> 로 묶는 것은 빌드 산출물의
 *  이야기이지 원고의 이야기가 아니다.)
 */
'use strict';
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const OUTDIR = path.join(DIR, '_배부용');
const OUT = path.join(OUTDIR, '면접지도가이드북.html');

const PARTS = [
  '00_표지차례.html',
  '01_공통.html',
  '02_서류기반.html',
  '03_인적성.html',
  '04_특수.html',
  '05_제시문.html',
  '06_예시.html',
  '07_부록.html'
];

function read(p) {
  return fs.readFileSync(path.join(DIR, p), 'utf8');
}

let html = read('면접지도가이드북.html');
const css = read('style.css');
const js = read('공통.js');

/* 조각을 순서대로 잇는다 */
const missing = PARTS.filter(function (f) {
  return !fs.existsSync(path.join(DIR, '원고', f));
});
if (missing.length) {
  console.error('조각이 없습니다:\n  ' + missing.join('\n  '));
  process.exit(1);
}
const body = PARTS.map(function (f) {
  return '<!-- ══════════ ' + f + ' ══════════ -->\n' + read(path.join('원고', f)).trim();
}).join('\n\n');

/* 1. 조각 삽입 — 로더 스크립트를 통째로 갈아 끼운다 */
const DOC_RE = /<!--BUILD:DOC-->[\s\S]*?<!--\/BUILD:DOC-->/;
if (!DOC_RE.test(html)) {
  console.error('면접지도가이드북.html 에서 BUILD:DOC 표시를 찾지 못했습니다.');
  process.exit(1);
}
html = html.replace(DOC_RE, body);

/* 2. 스타일시트와 스크립트를 품는다 */
html = html.replace('<link rel="stylesheet" href="style.css">', '<style>\n' + css + '\n</style>');
html = html.replace('<script src="공통.js"></script>', '<script>\n' + js + '\n</script>');

fs.mkdirSync(OUTDIR, { recursive: true });
fs.writeFileSync(OUT, html, 'utf8');

const pages = (body.match(/class="page/g) || []).length;
console.log('만들었습니다 → _배부용/' + path.basename(OUT));
console.log('  조각 ' + PARTS.length + '개, 면 ' + pages + '개, ' +
            (Buffer.byteLength(html, 'utf8') / 1024).toFixed(0) + 'KB');
