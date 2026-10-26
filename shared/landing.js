/*
 * 바로가기 쪽을 그린다. 쪽마다 <body data-category="…"> 하나로 무엇을 그릴지 정한다.
 *   data-category 없음 → 허브: 분야마다 바로가기 카드 하나. 자료는 허브에 늘어놓지 않는다
 *   data-category="id" → 그 분야: 묶음(groups)을 섹션으로, 그 안에 자료 카드
 * 내용은 catalog.js, 카드 그림은 art.js 에 있다. 이 파일은 양식만 맡는다.
 *
 * 디자인은 「인쇄 교정지」 양식이다. 흰 종이, 1px 잉크 괘선, 네 귀퉁이의 재단선(MARKS),
 * 모노스페이스로 적은 판형·분류·면 번호. 그라데이션과 흐린 장식은 두지 않는다.
 */
import { CATEGORIES } from './catalog.js';
import { ART } from './art.js';

const BASE = import.meta.env.BASE_URL;                 // '/printables/'
const HUB = document.body.dataset.category === undefined;
const CAT = HUB ? null : CATEGORIES.find(c => c.id === document.body.dataset.category);

/* 팔레트를 바탕·글자·강조(--accent)에 연결한다. site.css 의 --color-<tone>-* 와 짝이다.
   괘선은 var 가 없다 — 글자색을 섞어 쓰므로(RULE) 팔레트마다 적을 것이 없다.
   Tailwind 가 찾을 수 있도록 팔레트마다 완성된 문자열로 적는다. 팔레트를 더하면 site.css 와 여기에 한 줄씩. */
const TONES = {
    blue: "bg-blue-bg text-blue-ink [--accent:var(--color-blue-accent)] dark:bg-blue-night-bg dark:text-blue-night-ink dark:[--accent:var(--color-blue-night-accent)]",
    pink: "bg-pink-bg text-pink-ink [--accent:var(--color-pink-accent)] dark:bg-pink-night-bg dark:text-pink-night-ink dark:[--accent:var(--color-pink-night-accent)]",
    violet: "bg-violet-bg text-violet-ink [--accent:var(--color-violet-accent)] dark:bg-violet-night-bg dark:text-violet-night-ink dark:[--accent:var(--color-violet-night-accent)]",
    plum: "bg-plum-bg text-plum-ink [--accent:var(--color-plum-accent)] dark:bg-plum-night-bg dark:text-plum-night-ink dark:[--accent:var(--color-plum-night-accent)]",
    peach: "bg-peach-bg text-peach-ink [--accent:var(--color-peach-accent)] dark:bg-peach-night-bg dark:text-peach-night-ink dark:[--accent:var(--color-peach-night-accent)]"
};

/* 괘선. 그 자리의 글자색을 옅게 섞으므로 팔레트와 다크 모드를 저절로 따라온다 */
const RULE = "border-[color-mix(in_srgb,currentColor_20%,transparent)]";
const RULE_SOFT = "border-[color-mix(in_srgb,currentColor_12%,transparent)]";

/* 재단선(crop mark). 섹션·히어로의 네 귀퉁이에 L 자로 둔다. 장식은 이것 하나뿐이다 */
const CORNERS = ["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"];
const MARKS = `<span aria-hidden="true" class="pointer-events-none absolute inset-4 opacity-25 sm:inset-8">${CORNERS.map(p => `<i class="absolute ${p} h-4 w-4 border-current sm:h-6 sm:w-6"></i>`).join("")}</span>`;

/* 모노스페이스 표시. 판형·분류·면 번호에 쓴다 */
const META = "font-mono text-[11px] uppercase tracking-[.18em]";

/* 카드 배치: 한 줄의 합이 항상 12칸. 모바일 1열, 태블릿 6+6, 데스크톱은 아래 표.
   줄에 혼자 남는 카드는 가로 전체를 쓰고 글과 그림을 좌우로 나눈다 */
const DESKTOP = { 1: [12], 2: [7, 5], 3: [7, 5, 12], 4: [7, 5, 5, 7], 5: [12, 7, 5, 5, 7], 6: [7, 5, 4, 4, 4, 12] };
const SPAN_LG = { 4: "lg:col-span-4", 5: "lg:col-span-5", 6: "lg:col-span-6", 7: "lg:col-span-7", 12: "lg:col-span-12" };
const layout = n => DESKTOP[n] || Array.from({ length: n }, (_, i) => (n % 2 && i === n - 1 ? 12 : 6));
const SPLIT = {
    sm: { card: "sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(260px,.8fr)] sm:grid-rows-[auto_auto_1fr] sm:gap-x-[5%] sm:min-h-72", text: "sm:col-start-1", art: "sm:col-start-2 sm:row-span-3 sm:row-start-1 sm:m-0 sm:min-h-56" },
    lg: { card: "lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(260px,.8fr)] lg:grid-rows-[auto_auto_1fr] lg:gap-x-[5%] lg:min-h-72", text: "lg:col-start-1", art: "lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:m-0 lg:min-h-56" },
    solo: { card: "sm:grid sm:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] sm:grid-rows-[auto_auto_1fr] sm:gap-x-[6%] sm:min-h-[clamp(380px,36vw,480px)]", text: "sm:col-start-1 sm:self-start", art: "sm:col-start-2 sm:row-span-3 sm:row-start-1 sm:m-0 sm:min-h-full sm:scale-110" },
    lgOff: { card: "lg:flex lg:min-h-[clamp(380px,36vw,480px)]", text: "", art: "lg:-mx-1 lg:-mb-1.5 lg:mt-5 lg:min-h-56" }
};
const REVEAL = "opacity-0 [translate:0_22px]";

/* 카드 한 장은 책상에 놓인 종이 한 장이다. 흰 바탕, 1px 잉크 테두리, 호버에 살짝 들린다 */
const CARD = `group relative isolate col-span-1 flex min-h-80 min-w-0 flex-col overflow-hidden rounded-md border ${RULE} bg-white p-5 transition-[opacity,translate,transform,border-color,box-shadow] duration-700 ease-brand hover:border-[color-mix(in_srgb,currentColor_45%,transparent)] hover:shadow-[0_12px_32px_rgba(20,20,25,.09)] hover:transform-[translateY(-4px)] dark:bg-white/[0.04] dark:hover:shadow-[0_12px_32px_rgba(0,0,0,.5)] sm:min-h-[clamp(380px,36vw,480px)] sm:p-[clamp(20px,2.2vw,32px)] motion-reduce:hover:transform-none`;

const folio = n => String(n + 1).padStart(3, "0");

const card = (item, href, span, alone, solo, n) => {
    const s = [];
    if (solo) s.push(SPLIT.solo);
    else if (alone) s.push(SPLIT.sm);
    if (span === 12 && !solo) s.push(SPLIT.lg); else if (alone && !solo) s.push(SPLIT.lgOff);
    const pick = k => s.map(x => x[k]).join(" ");
    const art = (ART[item.art] || ART.page)(item);
    return `
    <a data-reveal href="${href}" class="${CARD} ${alone ? "sm:col-span-12" : "sm:col-span-6"} ${SPAN_LG[span]} ${pick("card")} ${REVEAL}">
        <div class="relative z-20 flex items-center justify-between gap-4 ${pick("text")}">
            <span class="${META} text-(--accent)">${folio(n)} · ${item.tag}</span>
            <span aria-hidden="true" class="font-mono text-xl leading-none text-(--accent) transition-transform duration-500 ease-brand group-hover:translate-x-1">→</span>
        </div>
        <h3 class="relative z-20 mb-2 mt-5 break-keep text-2xl font-bold leading-none tracking-[-.045em] sm:text-[clamp(23px,2.1vw,32px)] ${pick("text")}">${item.name}</h3>
        <p class="relative z-20 max-w-lg break-keep text-base leading-normal opacity-75 ${pick("text")}">${item.copy}</p>
        <div aria-hidden="true" class="relative z-20 -mx-1 -mb-1.5 mt-5 flex min-h-56 flex-1 items-center justify-center ${pick("art")}">${art}</div>
    </a>`;
};

/* 섹션 하나: 재단선 안에, 모노 표시 + 큰 제목 + 한두 문장 + 카드 격자 */
const section = ({ id, title, line, tone, meta }, cards, i) => {
    const n = cards.length, spans = layout(n);
    /* 판형은 자료마다 다를 수 있다. 섹션 머리에는 들어 있는 판형을 모아 적는다 */
    const paper = [...new Set(cards.map(c => c.item.paper || "A4"))].join(" · ");
    meta = meta || `${n} sheet${n === 1 ? "" : "s"} · ${paper}`;
    return `
    <section id="${id}" aria-labelledby="${id}-h" class="relative isolate overflow-hidden border-t ${RULE_SOFT} px-4 pb-28 pt-24 ${TONES[tone] || TONES.plum} sm:px-[clamp(20px,5.5vw,88px)] sm:pb-[clamp(120px,16vh,200px)] sm:pt-[clamp(110px,15vh,170px)]">
        ${MARKS}
        <div data-reveal class="mx-auto mb-[clamp(28px,4vw,52px)] w-full max-w-5xl ${REVEAL} transition-[opacity,translate] duration-1000 ease-brand">
            <div class="${META} mb-5 flex items-center gap-3 opacity-55">
                <span>§ ${String(i + 1).padStart(2, "0")}</span>
                <span aria-hidden="true" class="h-px flex-1 bg-current opacity-30"></span>
                <span>${meta}</span>
            </div>
            <div class="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
                <h2 id="${id}-h" class="text-[clamp(48px,14vw,76px)] font-extrabold leading-[.9] tracking-[-.05em] sm:text-[clamp(52px,8vw,104px)]">${title}</h2>
                <div class="mb-1.5 max-w-lg md:max-w-sm">
                    <p class="break-keep text-[clamp(16px,1.35vw,19px)] leading-normal tracking-tight opacity-75">${line}</p>
                </div>
            </div>
        </div>
        <div class="mx-auto grid w-full max-w-5xl grid-cols-1 gap-3.5 sm:grid-cols-12 sm:gap-[clamp(12px,1.45vw,22px)]">
            ${cards.map((c, k) => card(c.item, c.href, spans[k], n % 2 === 1 && spans[k] === 12, n === 1, k)).join("")}
        </div>
    </section>`;
};

/* 쪽에 들어갈 섹션들 */
/* 허브는 분야로 가는 문만 둔다. 분야 하나 = 카드 하나. 자료 목록은 분야 쪽에서 본다 */
const count = c => c.groups.reduce((n, g) => n + g.items.length, 0);
const sections = HUB
    ? [{
        id: "fields", title: "분야", line: "분야를 고르면 그 분야의 자료가 모두 나옵니다.",
        tone: CATEGORIES[0]?.tone, meta: `${CATEGORIES.length} field${CATEGORIES.length === 1 ? "" : "s"}`,
        cards: CATEGORIES.map(c => ({
            item: { tag: c.en, name: c.hero || c.title, copy: `${c.line.replace(/\.$/, "")} · ${count(c)}종`, art: c.art },
            href: `${BASE}${c.id}/`
        }))
    }]
    : CAT ? CAT.groups.map(g => ({
        id: g.id, title: g.title, line: g.line, tone: CAT.tone,
        cards: g.items.map(item => ({ item, href: `${BASE}${CAT.id}/${item.path}` }))
    })) : [];

const hero = HUB
    ? { kicker: "luminousky · Printables", title: "Printables", sub: "Print · Share · Coach", line: "교실에서 바로 인쇄해 쓰는 자료" }
    : CAT ? { kicker: `Printables · ${CAT.en}`, title: CAT.hero || CAT.title, sub: "Print · Share · Coach", line: CAT.line.replace(/\.$/, "") } : null;

const navLinks = HUB
    ? CATEGORIES.map(c => ({ href: `${BASE}${c.id}/`, label: c.title }))
    : [{ href: BASE, label: "전체" }, ...sections.map(s => ({ href: `#${s.id}`, label: s.title }))];

const BTN = `rounded-md border ${RULE} px-7 py-3 text-center ${META} text-ink transition-colors duration-300 hover:bg-ink hover:text-paper dark:text-paper dark:hover:bg-paper dark:hover:text-ink`;
const FOOT_LINK = "transition-colors duration-300 hover:text-ink dark:hover:text-paper";

document.getElementById("app").innerHTML = `
<header id="nav" class="fixed inset-x-0 top-0 z-20 flex items-center justify-between gap-4 border-b border-transparent bg-paper/85 px-4 py-3.5 text-base backdrop-blur-sm transition-[background,border-color] duration-500 dark:bg-night/85 sm:px-[clamp(20px,5.5vw,88px)] sm:py-4">
    <a href="https://luminousky.com/" class="whitespace-nowrap font-bold tracking-tighter max-[380px]:text-sm">luminousky</a>
    <nav aria-label="섹션" class="flex items-center gap-3 max-[380px]:gap-2 max-[380px]:text-sm sm:gap-[clamp(12px,2.5vw,34px)]">
        ${navLinks.map(l => `<a href="${l.href}" class="opacity-60 transition-opacity duration-300 hover:opacity-100 aria-[current=location]:opacity-100">${l.label}</a>`).join("")}
        <button type="button" id="theme-toggle" aria-label="다크 모드로 전환" class="-my-1.5 ml-1 grid h-8 w-8 place-items-center rounded-md border border-black/15 text-ink/70 transition-colors duration-300 hover:text-ink dark:border-white/20 dark:text-white/70 dark:hover:text-white">
            <svg class="h-4 w-4 dark:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
            <svg class="hidden h-4 w-4 dark:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
        </button>
    </nav>
</header>

<main id="top">
    ${hero ? `
    <section class="relative isolate grid min-h-[clamp(420px,62svh,560px)] place-items-center overflow-hidden px-4 pb-20 pt-24 text-center sm:min-h-[clamp(480px,72svh,680px)] sm:px-6 sm:pb-24">
        ${MARKS}
        <div>
            <p class="${META} mb-[clamp(16px,2.4vw,28px)] opacity-55">${hero.kicker}</p>
            <h1 class="text-[clamp(56px,17vw,92px)] font-extrabold leading-[.92] tracking-[-.055em] sm:text-[clamp(64px,9vw,120px)]">${hero.title}</h1>
            <p class="mx-auto mt-[clamp(20px,3vw,32px)] flex max-w-md items-center gap-3 ${META} opacity-75">
                <span aria-hidden="true" class="h-px flex-1 bg-current opacity-30"></span>${hero.sub}<span aria-hidden="true" class="h-px flex-1 bg-current opacity-30"></span>
            </p>
            <p class="mt-3 text-[15px] tracking-tight opacity-60 sm:text-base">${hero.line}</p>
            <p class="${META} mt-7 opacity-45">A4 · 210 × 297 mm · Chrome 으로 인쇄</p>
        </div>
        ${sections.length ? `<div class="absolute inset-x-[clamp(20px,5.5vw,88px)] bottom-8 flex justify-center ${META} opacity-55"><a href="#${sections[0].id}" class="flex items-center gap-2">Scroll to explore <span aria-hidden="true">↓</span></a></div>` : ""}
    </section>` : `
    <section class="grid min-h-svh place-items-center px-4 text-center"><div><h1 class="text-3xl font-bold">분야를 찾지 못했습니다</h1><p class="mt-3 opacity-70">catalog.js 에 「${document.body.dataset.category}」가 없습니다.</p><a href="${BASE}" class="mt-6 inline-block underline">Printables 처음으로</a></div></section>`}

    ${sections.map((s, i) => section(s, s.cards, i)).join("")}
</main>

<footer class="border-t ${RULE_SOFT} bg-[#f4f2ef] text-ink/60 dark:bg-night dark:text-paper/60">
    <div class="px-4 py-[clamp(56px,9vh,96px)] sm:px-[clamp(20px,5.5vw,88px)]"><div class="mx-auto w-full max-w-5xl">
        <p class="${META} mb-6 opacity-70">Colophon</p>
        <h2 class="text-[clamp(30px,4.6vw,58px)] font-bold leading-[.98] tracking-[-.05em] text-ink dark:text-paper">Have a problem worth solving?</h2>
        <p class="mt-4 text-[clamp(16px,1.5vw,20px)] text-ink/70 dark:text-paper/70">I'd like to hear about it.</p>
        <div class="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="https://luminousky.com/teacher-utility-kit/" class="${BTN} sm:w-56">Teacher Utility Kit</a>
            <a href="mailto:hello@luminousky.com" class="${BTN} sm:w-44">Email</a>
        </div>
    </div></div>
    <div class="border-t border-black/[0.07] text-sm text-ink/50 dark:border-white/[0.08] dark:text-paper/50">
        <div class="px-4 py-5 sm:px-[clamp(20px,5.5vw,88px)] sm:py-6"><div class="mx-auto flex w-full max-w-5xl flex-col items-start gap-x-6 gap-y-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <span>© 2026 luminousky · Printables</span>
            <nav aria-label="Footer" class="flex flex-wrap gap-x-5 gap-y-1.5">
                <a href="https://luminousky.com/" class="${FOOT_LINK}">luminousky.com</a>
                ${HUB ? "" : `<a href="${BASE}" class="${FOOT_LINK}">Printables</a>`}
                <a href="https://luminousky.com/teacher-utility-kit/" class="${FOOT_LINK}">Teacher Utility Kit</a>
                <a href="mailto:hello@luminousky.com" class="${FOOT_LINK}">hello@luminousky.com</a>
                <a href="#top" class="${FOOT_LINK}">Back to top ↑</a>
            </nav>
        </div></div>
    </div>
</footer>`;

/* ── 움직임 ─────────────────────────────────────────── */
const root = document.documentElement;
const toggle = document.getElementById("theme-toggle");
const syncLabel = () => toggle.setAttribute("aria-label", root.dataset.theme === "dark" ? "라이트 모드로 전환" : "다크 모드로 전환");
syncLabel();
toggle.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (e) {}
    syncLabel();
});

// 카드와 섹션 머리는 화면에 들어올 때 떠오른다. 움직임을 줄인 기기에서는 처음부터 보인다
const reveals = [...document.querySelectorAll("[data-reveal]")];
const show = el => el.classList.remove(...REVEAL.split(" "));
if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
    reveals.forEach(show);
} else {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
        if (!e.isIntersecting) return;
        show(e.target);
        io.unobserve(e.target);
    }), { threshold: .12, rootMargin: "0px 0px -5% 0px" });
    reveals.forEach(el => io.observe(el));
}

// 섹션 링크: 지금 보고 있는 섹션을 진하게
if ("IntersectionObserver" in window) {
    const links = [...document.querySelectorAll("#nav nav a[href^='#']")];
    const so = new IntersectionObserver(entries => entries.forEach(e => {
        if (!e.isIntersecting) return;
        links.forEach(a => a.hash === "#" + e.target.id ? a.setAttribute("aria-current", "location") : a.removeAttribute("aria-current"));
    }), { rootMargin: "-42% 0px -42% 0px" });
    document.querySelectorAll("main > section[id]").forEach(s => so.observe(s));
}

// 내려가면 머리 아래에 괘선 한 줄이 그어진다
const nav = document.getElementById("nav");
const NAV_SCROLLED = ["border-[color-mix(in_srgb,currentColor_15%,transparent)]", "bg-paper/95!", "dark:bg-night/95!"];
let ticking = false;
const onNav = () => { NAV_SCROLLED.forEach(c => nav.classList.toggle(c, scrollY > 24)); ticking = false; };
addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onNav); } }, { passive: true });
onNav();

// 주소에 #섹션 이 붙어 들어왔으면, 그려 놓은 뒤에 그 자리로 간다
// 브라우저는 섹션이 그려지기 전에 #섹션 을 찾다가 맨 위에 남는다. 다 읽힌 뒤에 즉시(scroll-smooth 없이) 옮긴다
const toHash = () => document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({ behavior: "instant" });
if (location.hash) document.readyState === "complete" ? toHash() : addEventListener("load", toHash, { once: true });
