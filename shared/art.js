/*
 * 카드 그림. 자료의 실제 면을 줄여 그린 것이다. 색은 섹션의 --accent 를 따른다.
 * 클래스 이름은 Tailwind 가 찾을 수 있도록 완성된 문자열로 적는다 (조합하지 않는다).
 */
const PANEL = "border border-white/90 bg-white/70 shadow-[0_18px_45px_rgba(36,42,65,.085)] dark:border-white/10 dark:bg-white/[0.07] dark:shadow-[0_18px_45px_rgba(0,0,0,.35)]";
const MOVE = "transition-transform duration-700 ease-brand group-hover:transform-[rotate(0deg)_translateY(-3px)]";
const LINE = "h-1.5 rounded-lg bg-[rgba(30,40,55,.12)] dark:bg-white/12";
const WIN_HEAD = `<div class="flex h-3.5 gap-1 border-b border-[rgba(30,40,55,.12)] pb-3 dark:border-white/10"><i class="h-2 w-2 rounded-full bg-[rgba(30,40,55,.25)] dark:bg-white/25"></i><i class="h-2 w-2 rounded-full bg-[rgba(30,40,55,.25)] dark:bg-white/25"></i><i class="h-2 w-2 rounded-full bg-[rgba(30,40,55,.25)] dark:bg-white/25"></i></div>`;

// A4 세로 면 두 장. 앞 면에 머리·본문 줄·상자·면 번호
const sheet = (kicker, title, body) => `
    <div class="relative aspect-[210/297] w-36 sm:w-40">
        <div class="${PANEL} absolute inset-0 translate-x-6 -translate-y-2 rotate-6 rounded-xl opacity-60"></div>
        <div class="${PANEL} ${MOVE} relative flex h-full -rotate-2 flex-col gap-1.5 rounded-xl p-3.5 text-left">
            <span class="text-[10px] font-semibold text-(--accent)">${kicker}</span>
            <b class="mb-1 border-b border-[rgba(30,40,55,.18)] pb-1.5 text-sm leading-tight dark:border-white/15">${title}</b>
            ${body}
            <span class="mt-auto self-end text-[10px] tabular-nums opacity-50">28</span>
        </div>
    </div>`;

export const ART = {
    // 가이드북: 본문 면 하나 — 줄글과 「대학별 확인」 같은 상자
    guide: () => sheet("제2부", "서류기반 면접", `
        <i class="${LINE}"></i><i class="${LINE} w-[86%]"></i><i class="${LINE} w-[64%]"></i>
        <div class="mt-1.5 grid gap-1 rounded-md border-l-2 border-(--accent) bg-[color-mix(in_srgb,var(--accent)_14%,white)] p-1.5 dark:bg-[color-mix(in_srgb,var(--accent)_25%,transparent)]">
            <i class="h-1.5 w-[70%] rounded-lg bg-(--accent) opacity-60"></i><i class="h-1.5 rounded-lg bg-[rgba(30,40,55,.12)] dark:bg-white/15"></i>
        </div>
        <i class="${LINE} mt-1"></i><i class="${LINE} w-[78%]"></i>`),

    // 문제 은행: 유형으로 묶은 문항 목록
    questions: () => {
        const rows = [["01", "이 학과를 지원한 이유는 무엇입니까?", ""], ["02", "입학 후 가장 공부하고 싶은 분야는?", ""], ["03", "졸업 후의 진로 계획을 말해 보세요.", "opacity-60"]];
        return `
        <div class="${PANEL} ${MOVE} min-h-36 w-[88%] -rotate-2 rounded-2xl p-3.5 text-left">
            ${WIN_HEAD}
            <div class="my-3 flex items-center justify-between text-sm font-bold"><span>유형별 문항</span><span class="rounded-full bg-[color-mix(in_srgb,var(--accent)_16%,white)] px-2 py-0.5 text-[11px] text-(--accent) dark:bg-[color-mix(in_srgb,var(--accent)_25%,transparent)]">지원 동기</span></div>
            <div class="grid gap-1.5 text-xs">${rows.map(([n, q, o]) => `<div class="grid grid-cols-[1.8em_1fr] items-center gap-2 rounded-lg bg-white/55 px-2.5 py-1.5 dark:bg-white/[0.07] ${o}"><b class="tabular-nums text-(--accent)">${n}</b><span class="truncate">${q}</span></div>`).join("")}</div>
        </div>`;
    },

    // 그림을 정하지 않은 자료: 그 자료 이름을 적은 A4 면
    page: (item) => sheet(item.tag, item.name, `
        <i class="${LINE}"></i><i class="${LINE} w-[86%]"></i><i class="${LINE} w-[64%]"></i>
        <i class="${LINE} mt-2"></i><i class="${LINE} w-[78%]"></i><i class="${LINE} w-[55%]"></i>`)
};
