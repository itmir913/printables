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

const BOOKS = [
  { file: '01_유형별.md', title: '유형별 문항', part: '유형별', path: '갈래로 묶은 것',
    foot: '면접 문제 은행 · 유형별' },
  { file: '02_전공별.md', title: '전공·계열별 문항', part: '전공별', path: '계열로 묶은 것',
    foot: '면접 문제 은행 · 전공별' }
];

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
const today = new Date();
const stamp = today.getFullYear() + '. ' + (today.getMonth() + 1) + '. ' + today.getDate() + '.';

const css = fs.readFileSync(path.join(DIR, 'style.css'), 'utf8');
const app = fs.readFileSync(path.join(DIR, 'app.js'), 'utf8');
const bank = fs.readFileSync(path.join(DIR, 'bank.js'), 'utf8');
const tw = fs.readFileSync(path.join(DIR, '면접지도가이드북.html'), 'utf8')
  .match(/<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>[\s\S]*?<\/script>/)[0];

const cover = `
<div class="page cover">
  <div class="kicker">면접 지도 가이드북 별책</div>
  <h1>면접 문제 은행</h1>
  <hr>
  <div class="sub">유형별 · 전공별로 묶은 면접 문항 ${total}개</div>
  <div class="meta">
    <span>${stamp} 기준</span>
    <span><b>@luminousky</b></span>
  </div>
</div>

<div class="page">
  <div class="head">
    <div class="ttl"><span class="no">쓰는 법</span><h2>이 문항을 어떻게 쓰는가</h2></div>
    <span class="path">별책</span>
  </div>
  <div class="body">
    <p class="lead">교육청 자료집·대학 공개 자료·후기 자료집에 공개된 기출 문항을 모아 중복을 제거하고 다듬었습니다. 대학·학교·개인을 특정하는 표현은 삭제했습니다.</p>

    <h3 class="sh">외우게 하지 마십시오</h3>
    <p>여기 있는 문항이 그대로 나오지 않습니다. 쓸모는 <b>결을 익히는 데</b> 있습니다. 학생이 자기 학생부로 <b>같은 결의 문항을 스스로 만들게</b> 하는 것이 목적입니다.</p>

    <h3 class="sh">이렇게 씁니다</h3>
    <ol class="steps">
      <li><b>학생이 고르게 합니다.</b> 자기 계열과 해당하는 갈래를 펼쳐 놓고, 답할 수 있는 것과 막히는 것을 표시하게 합니다.</li>
      <li><b>막히는 것부터</b> 준비시킵니다. 답할 수 있는 것은 이미 준비된 것입니다.</li>
      <li><b>모의면접 문항지</b>를 여기서 뽑습니다. 공통 갈래에서 셋, 계열에서 둘, 학생부에서 셋.</li>
      <li>고른 문항마다 <b>꼬리질문</b>을 하나씩 붙여 보게 합니다. 그것까지가 준비입니다.</li>
    </ol>

    <h3 class="sh">갈래마다 개수가 다릅니다</h3>
    <p>일부러 맞추지 않았습니다. <b>실제 기출의 분포를 그대로 둔 것</b>입니다. 예를 들어 자기소개와 마지막 할 말은 모아 놓고 보면 다른 갈래의 절반도 되지 않습니다. 그만큼 <b>덜 묻는다</b>는 뜻입니다. 반대로 세특·탐구와 시사·윤리 쟁점은 서로 다른 질문이 계속 나옵니다.</p>
    <p>없는 문항을 지어내 채우지 않았습니다. 여기 있는 것은 전부 실제로 나온 질문을 다듬은 것입니다.</p>

    <div class="note warn"><span class="t">해마다 바뀝니다</span><p>대학의 면접 문항은 해마다 달라집니다. 이 은행은 <b>지난 기출을 모은 것</b>이지 올해 나올 문항이 아닙니다. 지원 대학이 공개한 <b>선행학습 영향평가 결과보고서</b>를 반드시 함께 보십시오.</p></div>

    <div class="note tip"><span class="t">고치는 법</span><p>이 별책은 <kbd>문제은행/01_유형별.md</kbd> 와 <kbd>02_전공별.md</kbd> 에서 만들어집니다. 문항을 더하거나 빼고 <kbd>node 문제은행빌드.js</kbd> 를 돌리면 면이 저절로 다시 나뉩니다.</p></div>
  </div>
  <div class="foot"><span>면접 문제 은행</span><span class="pg"></span></div>
</div>
`;

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
<body>

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
  title: b.title, part: b.part, path: b.path, foot: b.foot, groups: b.groups
})))});
</script>
</body>
</html>
`;

fs.mkdirSync(OUTDIR, { recursive: true });
fs.writeFileSync(OUT, html, 'utf8');
console.log('만들었습니다 → _배부용/' + path.basename(OUT));
console.log('  묶음 ' + books.length + '권, 갈래 ' +
  books.reduce((n, b) => n + b.groups.length, 0) + '개, 문항 ' + total + '개, ' +
  (Buffer.byteLength(html, 'utf8') / 1024).toFixed(0) + 'KB');
