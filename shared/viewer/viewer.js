/* 공용 문서 뷰어
 *
 * 인쇄물마다 화면 조작이 갈라지지 않도록, 면(.page)을 PDF 뷰어처럼 보여 주는 일을 한곳에 둔다.
 *
 *   import { mountViewer } from '../../shared/viewer/viewer.js';
 *   mountViewer({ title: '면접 지도 가이드북' });
 *
 * 하는 일
 *   - 왼쪽: 상위 페이지로 돌아가기 · 목차 · 자료 이름
 *   - 가운데: 지금 면 / 전체 면
 *   - 오른쪽: 확대·축소 · 단일/두 페이지 · 표지 페이지 별도 표시 · 인쇄
 *
 * 하지 않는 일 — 면의 크기·생김새·면 번호는 자료가 정한다. 뷰어는 늘어놓기만 한다.
 * 그래서 면을 나중에 붙이는 자료(원고를 불러 조립하는 자료)는 면을 다 붙인 뒤에 부른다.
 *
 * 목차는 [data-toc] 가 있으면 그것을, 없으면 면마다 처음 나오는 h1·h2 를 쓴다.
 *   <h2 data-toc>제1부 공통</h2>           ← 글자를 그대로 쓴다
 *   <div data-toc="부록" data-toc-level="2">  ← 이름과 들여쓰기를 따로 준다
 * 자료에 이미 차례 면이 있으면 그 링크를 그대로 쓴다 — mountViewer({ tocFrom: '.toc a[href^="#"]' }).
 * 링크의 href="#id" 가 가리키는 면으로 가고, class="t2" 나 data-toc-level="2" 면 한 단 들인다.
 */
import './viewer.css';

const ZOOMS = [0.5, 0.67, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2];
const ZOOM_MIN = 0.25, ZOOM_MAX = 4;   // 휠로 움직일 수 있는 끝
const STORE = 'printables.viewer';
// 이보다 좁은 창(휴대폰)에서는 두 페이지 보기를 쓰지 않는다 — viewer.css 의 같은 값과 맞춘다
const NARROW = '(max-width: 720px)';

function load() {
  try { return JSON.parse(localStorage.getItem(STORE)) || {}; } catch { return {}; }
}
function save(s) {
  try { localStorage.setItem(STORE, JSON.stringify(s)); } catch { /* 저장 못 해도 화면은 그대로 */ }
}

function el(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'on') for (const [ev, fn] of Object.entries(v)) e.addEventListener(ev, fn);
    else if (v === true) e.setAttribute(k, '');
    else if (v !== false && v != null) e.setAttribute(k, v);
  }
  e.append(...kids);
  return e;
}

/**
 * @param {object} [o]
 * @param {string} [o.title]      막대에 적을 자료 이름. 없으면 document.title
 * @param {string} [o.back]       돌아갈 주소. 기본 '../' (분야 바로가기 쪽)
 * @param {string} [o.backLabel]  돌아가기 단추의 글자
 * @param {Element} [o.root]      면이 들어 있는 상자. 기본은 첫 .page 의 부모
 * @param {boolean} [o.cover]     표지 페이지 별도 표시의 처음 값. 기본 true
 * @param {string} [o.tocFrom]    목차로 쓸 차례 링크의 선택자
 * @param {boolean} [o.checkOverflow]  넘친 면을 화면에 표시한다 (손으로 면을 나누는 원고용)
 */
export function mountViewer(o = {}) {
  const pages = () => [...root.children].filter((n) => n.classList.contains('page'));
  const first = document.querySelector('.page');
  let root = o.root || (first && first.parentElement);
  if (!root) return null;
  /* 면이 body 에 바로 놓인 자료 — body 를 그대로 무대로 쓰면 조작 막대까지 배율과 격자에
     휩쓸린다. 면만 따로 상자에 담는다. */
  if (root === document.body) {
    root = el('div', { class: 'vw-pages' });
    first.before(root);
    root.append(...[...document.body.children].filter((n) => n.classList.contains('page')));
  }

  const saved = load();
  const st = {
    zoom: 'fit',                          // 숫자 또는 'fit'(폭 맞춤)
    two: saved.two ?? false,
    cover: saved.cover ?? (o.cover ?? true),
    current: 1
  };

  document.body.classList.add('vw-on');
  root.classList.add('vw-stage');

  /* ── 막대 ─────────────────────────────────────── */
  const tocBtn = el('button', { type: 'button', 'aria-expanded': 'false', 'aria-controls': 'vw-toc', title: '목차', 'aria-label': '목차' },
    '☰', el('span', { class: 'vw-label' }, '목차'));
  const pageIn = el('input', { type: 'number', min: '1', value: '1', 'aria-label': '면 번호' });
  const pageTotal = el('span');
  const zoomSel = el('select', { 'aria-label': '배율' },
    el('option', { value: 'fit' }, '폭 맞춤'),
    ...ZOOMS.map((z) => el('option', { value: String(z) }, Math.round(z * 100) + '%')));
  // 휠로 맞춘 배율은 목록에 없다. 그 값을 보여 줄 칸 하나를 두고, 쓸 때만 꺼낸다
  const zoomFree = el('option', { value: '', hidden: true });
  zoomSel.append(zoomFree);
  const btnOne = el('button', { type: 'button', 'aria-pressed': 'false' }, '단일 페이지');
  const btnTwo = el('button', { type: 'button', 'aria-pressed': 'false' }, '두 페이지');
  const coverIn = el('input', { type: 'checkbox' });
  const coverLab = el('label', { class: 'vw-check', title: '두 페이지 보기에서 첫 면을 홀로 둔다' }, coverIn, '표지', el('span', { class: 'vw-label' }, ' 페이지'), ' 별도 표시');

  const bar = el('div', { class: 'vw-bar no-print', role: 'toolbar', 'aria-label': '문서 보기' },
    el('div', { class: 'vw-grp' },
      el('a', { class: 'vw-btn', href: o.back || '../', title: '상위 페이지로', 'aria-label': o.backLabel || '상위 페이지' },
        '←', el('span', { class: 'vw-label' }, o.backLabel || '상위 페이지')),
      tocBtn,
      el('span', { class: 'vw-title' }, o.title || document.title)),
    el('div', { class: 'vw-grow' }),
    el('div', { class: 'vw-grp vw-pageno' }, pageIn, el('span', {}, '/'), pageTotal),
    el('div', { class: 'vw-sep' }),
    el('div', { class: 'vw-grp vw-zoom' },
      el('button', { type: 'button', class: 'vw-icon', title: '축소', on: { click: () => step(-1) } }, '−'),
      zoomSel,
      el('button', { type: 'button', class: 'vw-icon', title: '확대', on: { click: () => step(1) } }, '+')),
    el('div', { class: 'vw-sep' }),
    el('div', { class: 'vw-grp vw-viewopt' }, el('div', { class: 'vw-seg', role: 'group', 'aria-label': '페이지 보기' }, btnOne, btnTwo), coverLab),
    el('div', { class: 'vw-sep' }),
    el('button', { type: 'button', on: { click: () => window.print() } }, '인쇄'));

  const toc = el('nav', { class: 'vw-toc no-print', id: 'vw-toc', 'aria-label': '목차', hidden: true });
  document.body.prepend(bar, toc);

  new ResizeObserver(() => {
    document.documentElement.style.setProperty('--vw-bar-h', bar.offsetHeight + 'px');
  }).observe(bar);

  /* ── 배율 ─────────────────────────────────────── */
  function naturalWidth() {
    const ps = pages();
    if (!ps.length) return 1;
    const w = Math.max(...ps.map((p) => p.offsetWidth));   // zoom 은 offsetWidth 를 바꾸지 않는다
    return st.two && !matchMedia(NARROW).matches ? w * 2 + 12 : w;
  }
  function fitZoom() {
    const avail = document.documentElement.clientWidth - 32;
    return Math.min(1, avail / naturalWidth());
  }
  function zoomValue() { return st.zoom === 'fit' ? fitZoom() : st.zoom; }
  function applyZoom(keep = true) {
    const target = keep ? st.current : null;
    document.documentElement.style.setProperty('--vw-zoom', String(zoomValue()));
    const listed = st.zoom === 'fit' || ZOOMS.includes(st.zoom);
    zoomFree.hidden = listed;
    if (!listed) { zoomFree.value = String(st.zoom); zoomFree.textContent = Math.round(st.zoom * 100) + '%'; }
    zoomSel.value = String(st.zoom);
    if (target) goTo(target, 'instant');
  }
  function step(dir) {
    const z = zoomValue();
    const next = dir > 0 ? ZOOMS.find((v) => v > z + 0.001) : [...ZOOMS].reverse().find((v) => v < z - 0.001);
    if (next) { st.zoom = next; applyZoom(); }
  }
  zoomSel.addEventListener('change', () => {
    st.zoom = zoomSel.value === 'fit' ? 'fit' : Number(zoomSel.value);
    applyZoom();
  });
  window.addEventListener('resize', () => { if (st.zoom === 'fit') applyZoom(false); });
  /* Ctrl(⌘) + 휠 · 트랙패드 오므리기 — 브라우저 확대 대신 면을 확대한다.
     휠 한 칸(deltaY≈100)이 약 18%, 트랙패드는 작은 값이 잇달아 와서 부드럽게 움직인다.
     커서 밑의 자리가 그대로 커서 밑에 남도록 스크롤을 맞춘다. */
  let wheelDelta = 0, wheelAt = null, wheelQueued = false;
  window.addEventListener('wheel', (e) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    e.preventDefault();
    wheelDelta += e.deltaMode === 1 ? e.deltaY * 33 : e.deltaY;   // 줄 단위로 오는 브라우저도 있다
    wheelAt = { x: e.clientX, y: e.clientY };
    if (wheelQueued) return;
    wheelQueued = true;
    requestAnimationFrame(() => {
      wheelQueued = false;
      const z0 = zoomValue();
      const z1 = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z0 * Math.exp(-wheelDelta * 0.002)));
      wheelDelta = 0;
      if (Math.abs(z1 - z0) < 0.001) return;
      const r0 = root.getBoundingClientRect();
      const lx = (wheelAt.x - r0.left) / z0, ly = (wheelAt.y - r0.top) / z0;
      st.zoom = Math.round(z1 * 1000) / 1000;
      applyZoom(false);
      const r1 = root.getBoundingClientRect();
      window.scrollBy(r1.left + lx * st.zoom - wheelAt.x, r1.top + ly * st.zoom - wheelAt.y);
    });
  }, { passive: false });

  window.addEventListener('keydown', (e) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    if (e.key === '=' || e.key === '+') { e.preventDefault(); step(1); }
    else if (e.key === '-') { e.preventDefault(); step(-1); }
    else if (e.key === '0') { e.preventDefault(); st.zoom = 'fit'; applyZoom(); }
  });

  /* ── 페이지 보기 ──────────────────────────────── */
  function applyLayout() {
    root.classList.toggle('vw-two', st.two);
    root.classList.toggle('vw-cover', st.cover);
    btnOne.setAttribute('aria-pressed', String(!st.two));
    btnTwo.setAttribute('aria-pressed', String(st.two));
    coverIn.checked = st.cover;
    coverIn.disabled = !st.two;
    coverLab.classList.toggle('is-off', !st.two);
    save({ two: st.two, cover: st.cover });
    applyZoom();
  }
  btnOne.addEventListener('click', () => { st.two = false; applyLayout(); });
  btnTwo.addEventListener('click', () => { st.two = true; applyLayout(); });
  coverIn.addEventListener('change', () => { st.cover = coverIn.checked; applyLayout(); });

  /* ── 면 이동 ──────────────────────────────────── */
  function goTo(n, behavior = 'smooth') {
    const ps = pages();
    const p = ps[Math.min(Math.max(n, 1), ps.length) - 1];
    if (!p) return;
    const top = p.getBoundingClientRect().top + window.scrollY - bar.offsetHeight - 16;
    window.scrollTo({ top, behavior });
  }
  pageIn.addEventListener('change', () => goTo(Number(pageIn.value) || 1));
  pageIn.addEventListener('keydown', (e) => { if (e.key === 'Enter') goTo(Number(pageIn.value) || 1); });

  let io;
  const seen = new Map();
  function watch() {
    if (io) io.disconnect();
    seen.clear();
    io = new IntersectionObserver((entries) => {
      for (const en of entries) seen.set(en.target, en.intersectionRatio);
      const ps = pages();
      let best = 0, bestR = -1;
      ps.forEach((p, i) => { const r = seen.get(p) || 0; if (r > bestR + 0.01) { bestR = r; best = i; } });
      st.current = best + 1;
      if (document.activeElement !== pageIn) pageIn.value = String(st.current);
      markToc();
    }, { threshold: [0, 0.25, 0.5, 0.75, 1] });
    pages().forEach((p) => io.observe(p));
  }

  /* ── 목차 ─────────────────────────────────────── */
  let tocItems = [];
  function buildToc() {
    const ps = pages();
    const pageOf = (node) => ps.indexOf(node.closest('.page')) + 1;
    const marked = [...root.querySelectorAll('[data-toc]')];
    if (o.tocFrom) {
      tocItems = [...root.querySelectorAll(o.tocFrom)].map((a) => {
        const id = decodeURIComponent((a.getAttribute('href') || '').slice(1));
        const target = id && document.getElementById(id);
        const label = a.cloneNode(true);
        label.querySelectorAll('.pg, .dotfill').forEach((n) => n.remove());
        return {
          text: label.textContent.replace(/\s+/g, ' ').trim(),
          level: a.classList.contains('t2') || a.getAttribute('data-toc-level') === '2' ? 2 : 1,
          page: target ? pageOf(target) : 0
        };
      });
    } else if (marked.length) {
      tocItems = marked.map((n) => ({
        text: n.getAttribute('data-toc') || n.textContent.trim(),
        level: Number(n.getAttribute('data-toc-level') || 1),
        page: pageOf(n)
      }));
    } else {
      tocItems = [];
      ps.forEach((p, i) => {
        const h = p.querySelector('h1, h2');
        const text = h && h.textContent.replace(/\s+/g, ' ').trim();
        if (!text) return;
        const prev = tocItems[tocItems.length - 1];
        if (prev && prev.text === text) return;            // 이어지는 면은 한 항목으로
        tocItems.push({ text, level: h.tagName === 'H1' ? 1 : 2, page: i + 1 });
      });
      const lv = new Set(tocItems.map((t) => t.level));
      if (lv.size === 1) tocItems.forEach((t) => { t.level = 1; });
    }
    tocItems = tocItems.filter((t) => t.page > 0);
    toc.replaceChildren(tocItems.length
      ? el('ol', {}, ...tocItems.map((t) => el('li', {},
          el('a', { href: '#', class: t.level > 1 ? 'vw-lv2' : null, on: { click: (e) => { e.preventDefault(); closeToc(); goTo(t.page); } } },
            el('span', { class: 'vw-t' }, t.text), el('span', { class: 'vw-p' }, String(t.page))))))
      : el('div', { class: 'vw-empty' }, '목차가 없습니다'));
  }
  function markToc() {
    const links = toc.querySelectorAll('a');
    let cur = -1;
    tocItems.forEach((t, i) => { if (t.page <= st.current) cur = i; });
    links.forEach((a, i) => a.classList.toggle('is-current', i === cur));
  }
  function openToc() {
    toc.hidden = false; tocBtn.setAttribute('aria-expanded', 'true');
    (toc.querySelector('a.is-current') || toc.querySelector('a'))?.focus();
  }
  function closeToc() { toc.hidden = true; tocBtn.setAttribute('aria-expanded', 'false'); }
  tocBtn.addEventListener('click', () => (toc.hidden ? openToc() : closeToc()));
  document.addEventListener('click', (e) => {
    if (!toc.hidden && !toc.contains(e.target) && !tocBtn.contains(e.target)) closeToc();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !toc.hidden) { closeToc(); tocBtn.focus(); } });

  /* ── 면이 바뀌었을 때 ─────────────────────────── */
  function refresh() {
    const ps = pages();
    ps.forEach((p, i) => p.classList.toggle('vw-first', i === 0));
    pageTotal.textContent = String(ps.length);
    pageIn.max = String(ps.length);
    if (o.checkOverflow) {
      ps.forEach((p) => p.classList.toggle('vw-overflow', p.scrollHeight > p.clientHeight + 1));
    }
    buildToc();
    watch();
    applyLayout();
  }

  refresh();
  return { refresh, goTo };
}
