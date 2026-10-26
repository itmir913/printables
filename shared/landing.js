/*
 * 바로가기 쪽을 그린다. 쪽마다 <body data-category="…"> 하나로 무엇을 그릴지 정한다.
 *   data-category 없음 → 허브: 모든 분야를 섹션으로, 그 안에 자료 카드
 *   data-category="id" → 그 분야: 묶음(groups)을 섹션으로, 그 안에 자료 카드
 * 내용은 catalog.js, 카드 그림은 art.js 에 있다. 이 파일은 양식만 맡는다.
 * 디자인은 Teacher Utility Kit 홈과 같은 양식이다.
 */
import { CATEGORIES } from './catalog.js';
import { ART } from './art.js';

const BASE = import.meta.env.BASE_URL;                 // '/printables/'
const HUB = document.body.dataset.category === undefined;
const CAT = HUB ? null : CATEGORIES.find(c => c.id === document.body.dataset.category);

/* 팔레트를 배경·글자·장식 원(--orb)·강조(--accent)에 연결한다. site.css 의 --color-<tone>-* 와 짝이다.
   Tailwind 가 찾을 수 있도록 팔레트마다 완성된 문자열로 적는다. 팔레트를 더하면 site.css 와 여기에 한 줄씩. */
const TONES = {
    blue: "bg-blue-bg text-blue-ink [--orb:var(--color-blue-orb)] [--accent:var(--color-blue-accent)] dark:bg-blue-night-bg dark:text-blue-night-ink dark:[--orb:var(--color-blue-night-orb)] dark:[--accent:var(--color-blue-night-accent)]",
    pink: "bg-pink-bg text-pink-ink [--orb:var(--color-pink-orb)] [--accent:var(--color-pink-accent)] dark:bg-pink-night-bg dark:text-pink-night-ink dark:[--orb:var(--color-pink-night-orb)] dark:[--accent:var(--color-pink-night-accent)]",
    violet: "bg-violet-bg text-violet-ink [--orb:var(--color-violet-orb)] [--accent:var(--color-violet-accent)] dark:bg-violet-night-bg dark:text-violet-night-ink dark:[--orb:var(--color-violet-night-orb)] dark:[--accent:var(--color-violet-night-accent)]",
    plum: "bg-plum-bg text-plum-ink [--orb:var(--color-plum-orb)] [--accent:var(--color-plum-accent)] dark:bg-plum-night-bg dark:text-plum-night-ink dark:[--orb:var(--color-plum-night-orb)] dark:[--accent:var(--color-plum-night-accent)]",
    peach: "bg-peach-bg text-peach-ink [--orb:var(--color-peach-orb)] [--accent:var(--color-peach-accent)] dark:bg-peach-night-bg dark:text-peach-night-ink dark:[--orb:var(--color-peach-night-orb)] dark:[--accent:var(--color-peach-night-accent)]"
};

/* 섹션 배경의 추상 도형. 섹션 순서대로 돌아가며 쓴다 */
const ORB = "before:absolute before:-z-10 before:opacity-50 before:mix-blend-multiply dark:before:mix-blend-screen dark:before:opacity-40 sm:before:opacity-70 dark:sm:before:opacity-50 before:blur-xs before:content-['']";
const SHAPES = [
    "before:right-[-35vw] before:top-[4%] before:aspect-square before:w-[110vw] before:rounded-full before:bg-(--orb) sm:before:right-[-24vw] sm:before:w-[min(72vw,980px)]",
    "before:left-[-30vw] before:top-[18%] before:h-[42vw] before:w-[120vw] before:-rotate-12 before:rounded-full before:bg-(--orb) sm:before:left-[-14vw] sm:before:h-[min(26vw,360px)] sm:before:w-[min(70vw,960px)]",
    "before:bottom-[-12%] before:right-[-30vw] before:aspect-square before:w-screen before:rounded-[42%_58%_63%_37%/41%_44%_56%_59%] before:bg-(--orb) sm:before:right-[-10vw] sm:before:w-[min(60vw,820px)]",
    "before:left-[-40vw] before:top-[6%] before:aspect-square before:w-screen before:rounded-full before:border-[16vw] before:border-(--orb) sm:before:left-[-18vw] sm:before:w-[min(64vw,880px)] sm:before:border-[min(9vw,120px)]"
];

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
const REVEAL = "opacity-0 blur-xs [translate:0_34px]";
const CARD = "group relative isolate col-span-1 flex min-h-80 min-w-0 flex-col overflow-hidden rounded-3xl border border-white/75 bg-white/50 p-5 shadow-[0_14px_50px_rgba(43,49,72,.055),inset_0_1px_0_rgba(255,255,255,.88)] backdrop-blur-xs backdrop-saturate-150 transition-[opacity,filter,translate,transform,background-color,box-shadow,border-color] duration-1000 ease-brand hover:border-white hover:bg-white/65 hover:shadow-[0_28px_76px_rgba(43,49,72,.105),inset_0_1px_0_#fff] hover:transform-[translateY(-8px)] dark:border-white/10 dark:bg-white/5 dark:shadow-[0_14px_50px_rgba(0,0,0,.35),inset_0_1px_0_rgba(255,255,255,.08)] dark:hover:border-white/20 dark:hover:bg-white/8 sm:min-h-[clamp(380px,36vw,480px)] sm:rounded-[clamp(24px,2.3vw,34px)] sm:p-[clamp(20px,2.2vw,32px)] sm:backdrop-blur-lg md:backdrop-blur-xl motion-reduce:hover:transform-none";

const card = (item, href, span, alone, solo) => {
    const s = [];
    if (solo) s.push(SPLIT.solo);
    else if (alone) s.push(SPLIT.sm);
    if (span === 12 && !solo) s.push(SPLIT.lg); else if (alone && !solo) s.push(SPLIT.lgOff);
    const pick = k => s.map(x => x[k]).join(" ");
    const art = (ART[item.art] || ART.page)(item);
    return `
    <a data-reveal href="${href}" class="${CARD} ${alone ? "sm:col-span-12" : "sm:col-span-6"} ${SPAN_LG[span]} ${pick("card")} ${REVEAL}">
        <div class="relative z-20 flex items-center justify-between gap-4 text-sm opacity-80 ${pick("text")}">
            <span class="rounded-full border border-black/15 bg-white/60 px-2.5 py-1 text-xs dark:border-white/20 dark:bg-white/8">${item.tag}</span>
            <span aria-hidden="true" class="text-2xl text-(--accent) transition-transform duration-500 ease-brand group-hover:translate-x-1">→</span>
        </div>
        <h3 class="relative z-20 mb-2 mt-5 break-keep text-2xl font-bold leading-none tracking-[-.06em] sm:text-[clamp(24px,2.3vw,34px)] ${pick("text")}">${item.name}</h3>
        <p class="relative z-20 max-w-lg break-keep text-base leading-normal opacity-80 ${pick("text")}">${item.copy}</p>
        <div aria-hidden="true" class="relative z-20 -mx-1 -mb-1.5 mt-5 flex min-h-56 flex-1 items-center justify-center ${pick("art")}">${art}</div>
    </a>`;
};

/* 섹션 하나: 머리(큰 제목 + 한두 문장 [+ 분야 쪽으로 가는 링크]) + 카드 격자 */
const section = ({ id, title, line, tone, more }, cards, i) => {
    const n = cards.length, spans = layout(n);
    return `
    <section id="${id}" aria-labelledby="${id}-h" class="relative isolate overflow-hidden px-4 pb-32 pt-28 ${TONES[tone] || TONES.plum} ${ORB} ${SHAPES[i % SHAPES.length]} sm:px-[clamp(20px,5.5vw,88px)] sm:pb-[clamp(140px,20vh,240px)] sm:pt-[clamp(130px,18vh,200px)]">
        <div data-reveal class="mx-auto mb-[clamp(28px,4vw,52px)] flex w-full max-w-5xl flex-col items-start gap-6 ${REVEAL} transition-[opacity,filter,translate] duration-1000 ease-brand md:flex-row md:items-end md:justify-between">
            <h2 id="${id}-h" class="text-[clamp(56px,17vw,88px)] font-extrabold leading-[.86] -tracking-widest sm:text-[clamp(60px,10vw,142px)]">${title}</h2>
            <div class="mb-1.5 max-w-lg md:max-w-sm">
                <p class="break-keep text-[clamp(16px,1.35vw,19px)] leading-normal tracking-tight opacity-80">${line}</p>
                ${more ? `<a href="${more.href}" class="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-(--accent) hover:underline">${more.label} <span aria-hidden="true">→</span></a>` : ""}
            </div>
        </div>
        <div class="mx-auto grid w-full max-w-5xl grid-cols-1 gap-3.5 sm:grid-cols-12 sm:gap-[clamp(12px,1.45vw,22px)]">
            ${cards.map((c, k) => card(c.item, c.href, spans[k], n % 2 === 1 && spans[k] === 12, n === 1)).join("")}
        </div>
    </section>`;
};

/* 쪽에 들어갈 섹션들 */
const sections = HUB
    ? CATEGORIES.map(c => ({
        id: c.id, title: c.title, line: c.line, tone: c.tone,
        more: { href: `${BASE}${c.id}/`, label: `${c.title} 자료 전체` },
        cards: c.groups.flatMap(g => g.items.map(item => ({ item, href: `${BASE}${c.id}/${item.path}` })))
    }))
    : CAT ? CAT.groups.map(g => ({
        id: g.id, title: g.title, line: g.line, tone: CAT.tone,
        cards: g.items.map(item => ({ item, href: `${BASE}${CAT.id}/${item.path}` }))
    })) : [];

const hero = HUB
    ? { kicker: "luminousky · Printables", title: "Printables", sub: "Print · Share · Coach", line: "교실에서 바로 인쇄해 쓰는 자료" }
    : CAT ? { kicker: `Printables · ${CAT.en}`, title: CAT.hero || CAT.title, sub: "Print · Share · Coach", line: CAT.line.replace(/\.$/, "") } : null;

const navLinks = [
    ...(HUB ? [] : [{ href: BASE, label: "전체" }]),
    ...sections.map(s => ({ href: `#${s.id}`, label: s.title }))
];

const BTN = "rounded-full border border-black/10 bg-white/70 px-7 py-3 text-center text-sm font-semibold text-ink backdrop-blur transition-colors duration-300 hover:bg-ink hover:text-paper dark:border-white/15 dark:bg-white/[0.07] dark:text-paper dark:hover:bg-paper dark:hover:text-ink";
const FOOT_LINK = "transition-colors duration-300 hover:text-ink dark:hover:text-paper";

document.getElementById("app").innerHTML = `
<header id="nav" class="fixed inset-x-0 top-0 z-20 flex items-center justify-between gap-4 border-b border-transparent bg-[linear-gradient(to_bottom,rgba(251,251,253,.86),rgba(251,251,253,.48)_70%,rgba(251,251,253,0))] px-4 py-3.5 text-base transition-[background,border-color,box-shadow] duration-500 dark:bg-[linear-gradient(to_bottom,rgba(0,0,0,.8),rgba(0,0,0,.4)_70%,rgba(0,0,0,0))] sm:px-[clamp(20px,5.5vw,88px)] sm:py-4">
    <a href="https://luminousky.com/" class="whitespace-nowrap font-bold tracking-tighter max-[380px]:text-sm">luminousky</a>
    <nav aria-label="섹션" class="flex items-center gap-3 max-[380px]:gap-2 max-[380px]:text-sm sm:gap-[clamp(12px,2.5vw,34px)]">
        ${navLinks.map(l => `<a href="${l.href}" class="opacity-70 transition-opacity duration-300 hover:opacity-100 aria-[current=location]:opacity-100">${l.label}</a>`).join("")}
        <button type="button" id="theme-toggle" aria-label="다크 모드로 전환" class="-my-1.5 ml-1 grid h-8 w-8 place-items-center rounded-full border border-black/10 bg-white/40 text-ink/70 transition-colors duration-300 hover:text-ink dark:border-white/15 dark:bg-white/10 dark:text-white/70 dark:hover:text-white">
            <svg class="h-4 w-4 dark:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>
            <svg class="hidden h-4 w-4 dark:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>
        </button>
    </nav>
</header>

<main id="top">
    ${hero ? `
    <section class="relative isolate grid min-h-[clamp(440px,68svh,620px)] place-items-center overflow-hidden bg-[linear-gradient(to_bottom,#c2b8f4_0%,#e2bde3_30%,#f2c8dc_58%,#ffcfb3_80%,#fbfbfd_100%)] px-4 pb-20 pt-24 text-center dark:bg-[linear-gradient(to_bottom,#1c1645_0%,#2a1745_30%,#30184a_60%,#000_100%)]
                    before:pointer-events-none before:absolute before:bottom-[-43%] before:left-1/2 before:-z-10 before:h-[82%] before:w-[min(1000px,110vw)] before:-translate-x-1/2 before:rounded-full before:bg-[radial-gradient(ellipse_at_center,rgba(255,184,140,.88)_0%,rgba(255,204,170,.48)_34%,transparent_70%)] before:blur-xs before:content-[''] dark:before:opacity-30
                    after:pointer-events-none after:absolute after:inset-0 after:-z-10 after:bg-[linear-gradient(to_bottom,transparent_65%,rgba(251,251,253,.3)_82%,#fbfbfd_100%)] after:content-[''] dark:after:bg-[linear-gradient(to_bottom,transparent_65%,rgba(0,0,0,.3)_82%,#000_100%)]
                    sm:min-h-[clamp(520px,80svh,760px)] sm:px-6 sm:pb-24 sm:pt-24">
        <div>
            <p class="mb-[clamp(16px,2.4vw,28px)] text-sm uppercase tracking-widest text-ink/60 dark:text-white/60">${hero.kicker}</p>
            <h1 class="-mb-[.14em] bg-[linear-gradient(100deg,#5e3bb3_0%,#9b4c7d_45%,#a03a74_68%,#bb5227_100%)] bg-clip-text pb-[.2em] pr-[.08em] text-[clamp(64px,20vw,104px)] font-extrabold leading-[.9] tracking-[-.06em] text-transparent dark:bg-[linear-gradient(100deg,#c9a8ff_0%,#e48fc4_45%,#ff9fcb_68%,#ffb48f_100%)] sm:text-[clamp(72px,10vw,136px)]">${hero.title}</h1>
            <p class="mt-[clamp(20px,3vw,32px)] text-[clamp(18px,1.9vw,24px)] font-semibold tracking-tight text-ink/75 dark:text-white/75">${hero.sub}</p>
            <p class="mt-2.5 text-[15px] tracking-tight text-ink/55 sm:text-base dark:text-white/55">${hero.line}</p>
        </div>
        ${sections.length ? `<div class="absolute inset-x-[clamp(20px,5.5vw,88px)] bottom-6 flex justify-center text-sm text-ink/70 dark:text-white/60"><a href="#${sections[0].id}" class="flex items-center gap-2">Scroll to explore <span aria-hidden="true">↓</span></a></div>` : ""}
    </section>` : `
    <section class="grid min-h-svh place-items-center px-4 text-center"><div><h1 class="text-3xl font-bold">분야를 찾지 못했습니다</h1><p class="mt-3 opacity-70">catalog.js 에 「${document.body.dataset.category}」가 없습니다.</p><a href="${BASE}" class="mt-6 inline-block underline">Printables 처음으로</a></div></section>`}

    ${sections.map((s, i) => section(s, s.cards, i)).join("")}
</main>

<footer class="bg-[#f3edf1] text-ink/60 dark:border-t dark:border-white/8 dark:bg-night dark:text-paper/60">
    <div class="px-4 py-[clamp(56px,9vh,96px)] sm:px-[clamp(20px,5.5vw,88px)]"><div class="mx-auto w-full max-w-5xl">
        <h2 class="text-[clamp(32px,5vw,64px)] font-bold leading-[.95] tracking-[-.06em] text-ink dark:text-paper">Have a problem worth solving?</h2>
        <p class="mt-4 text-[clamp(16px,1.5vw,20px)] text-ink/70 dark:text-paper/70">I'd like to hear about it.</p>
        <div class="mt-9 flex flex-col gap-3 sm:flex-row">
            <a href="https://luminousky.com/teacher-utility-kit/" class="${BTN} sm:w-52">Teacher Utility Kit</a>
            <a href="mailto:hello@luminousky.com" class="${BTN} sm:w-44">Email</a>
        </div>
    </div></div>
    <div class="border-t border-black/[0.06] text-sm text-ink/50 dark:border-white/[0.08] dark:text-paper/50">
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

// 내려가면 머리가 유리판이 된다
const nav = document.getElementById("nav");
const NAV_SCROLLED = ["bg-[rgba(251,251,253,.8)]!", "dark:bg-[rgba(0,0,0,.72)]!", "border-black/6!", "dark:border-white/8!", "shadow-[0_8px_30px_rgba(30,35,55,.045)]", "backdrop-blur-xl", "backdrop-saturate-150"];
let ticking = false;
const onNav = () => { NAV_SCROLLED.forEach(c => nav.classList.toggle(c, scrollY > 24)); ticking = false; };
addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onNav); } }, { passive: true });
onNav();

// 주소에 #섹션 이 붙어 들어왔으면, 그려 놓은 뒤에 그 자리로 간다
// 브라우저는 섹션이 그려지기 전에 #섹션 을 찾다가 맨 위에 남는다. 다 읽힌 뒤에 즉시(scroll-smooth 없이) 옮긴다
const toHash = () => document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({ behavior: "instant" });
if (location.hash) document.readyState === "complete" ? toHash() : addEventListener("load", toHash, { once: true });
