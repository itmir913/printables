/* 문제은행/*.md 를 읽어 별책 HTML 을 만든다.
 *
 *   node 문제은행빌드.js        →  _배부용/면접문제은행.html
 *
 * 평소 작업에는 필요 없다. 문제은행.html 을 localhost 로 열면 그만이다.
 * 이 스크립트는 파일 하나로 다른 사람에게 건네야 할 때만 쓴다.
 */
'use strict';
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const SRC = path.join(DIR, '문제은행');
const OUTDIR = path.join(DIR, '_배부용');
const OUT = path.join(OUTDIR, '면접문제은행.html');

/* 문제은행.html 이 이 별책의 원본이다.  묶음 목록도 표지도 「쓰는 법」 면도
   저쪽 한 곳에만 있고, 이 스크립트는 그때그때 읽어 온다.
   사본을 두면 반드시 갈라진다 — 실제로 갈라진 적이 있다. */
const SHELL = fs.readFileSync(path.join(DIR, '문제은행.html'), 'utf8');

const BOOKS = new Function('return ' + SHELL.match(/var BOOKS = (\[[\s\S]*?\]);/)[1])()
  .map(b => Object.assign({}, b, { file: path.basename(b.file) }));

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function parse(md) {
  const groups = [];
  let cur = null, intro = [];
  md.split(/\r?\n/).forEach(line => {
    if (line.startsWith('## ')) {
      cur = { name: line.slice(3).trim(), items: [] };
      groups.push(cur);
    } else if (line.startsWith('- ')) {
      if (cur) cur.items.push(esc(line.slice(2).trim()));
    } else if (!cur && line.trim() && !line.startsWith('#') && !line.startsWith('<!--')) {
      intro.push(line.trim());
    }
  });
  return { groups: groups.filter(g => g.items.length), intro: intro.join(' ') };
}

const books = BOOKS.map(b => {
  const p = path.join(SRC, b.file);
  if (!fs.existsSync(p)) { console.error('없는 파일: ' + p); process.exit(1); }
  const parsed = parse(fs.readFileSync(p, 'utf8'));
  return Object.assign({}, b, parsed);
});

const total = books.reduce((n, b) => n + b.groups.reduce((m, g) => m + g.items.length, 0), 0);

const css = fs.readFileSync(path.join(DIR, 'style.css'), 'utf8');
const app = fs.readFileSync(path.join(DIR, '공통.js'), 'utf8');
const bank = fs.readFileSync(path.join(DIR, '문제은행조판.js'), 'utf8');
const tw = fs.readFileSync(path.join(DIR, '면접지도가이드북.html'), 'utf8')
  .match(/<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>[\s\S]*?<\/script>/)[0];

/* 표지와 「쓰는 법」 면은 문제은행.html 의 <template id="앞면"> 이 원본이다.
   여기에 사본을 두면 반드시 갈라지므로 그때그때 읽어 온다. */
const cover = SHELL
  .match(/<template id="앞면">([\s\S]*?)<\/template>/)[1]
  .replace('{{문항수}}', total);

/* 꼬리말 왼쪽 문구도 저쪽 <body data-book="…"> 한 줄이 원본이다 */
const BODY = SHELL.match(/<body[^>]*>/)[0];

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>면접 문제 은행</title>
${tw}
<style>
${css}
</style>
</head>
${BODY}

<div class="bar no-print">
  <b>면접 문제 은행</b>
  <span>${total}문항</span>
  <button onclick="window.print()">인쇄</button>
</div>

<div id="doc">${cover}</div>

<script>
${bank}
</script>
<script>
${app}
</script>
<script>
buildBank(${JSON.stringify(books.map(b => ({
  title: b.title, part: b.part, path: b.path, groups: b.groups
})))});
</script>
</body>
</html>
`;

fs.mkdirSync(OUTDIR, { recursive: true });
fs.writeFileSync(OUT, html, 'utf8');
console.log('만들었습니다 → _배부용/' + path.basename(OUT));
console.log('  묶음 ' + books.length + '권, 유형 ' +
  books.reduce((n, b) => n + b.groups.length, 0) + '개, 문항 ' + total + '개, ' +
  (Buffer.byteLength(html, 'utf8') / 1024).toFixed(0) + 'KB');
