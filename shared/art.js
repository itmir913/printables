/*
 * 카드 그림. 자료의 실제 면을 줄여 그린 것이다. 색은 섹션의 --accent 를 따른다.
 * 교정지 양식에 맞추어 흰 종이에 1px 괘선만 쓴다. 번진 그림자와 반투명 유리는 두지 않는다.
 * 클래스 이름은 Tailwind 가 찾을 수 있도록 완성된 문자열로 적는다 (조합하지 않는다).
 */
const PANEL = "border border-[color-mix(in_srgb,currentColor_22%,transparent)] bg-white shadow-[0_2px_10px_rgba(20,20,25,.05)] dark:bg-white/[0.05] dark:shadow-none";
const MOVE = "transition-transform duration-700 ease-brand group-hover:transform-[rotate(0deg)_translateY(-3px)]";
const LINE = "h-1.5 rounded-sm bg-[color-mix(in_srgb,currentColor_12%,transparent)]";
const WIN_HEAD = `<div class="flex h-3.5 gap-1 border-b border-[color-mix(in_srgb,currentColor_15%,transparent)] pb-3"><i class="h-2 w-2 rounded-full bg-[color-mix(in_srgb,currentColor_25%,transparent)]"></i><i class="h-2 w-2 rounded-full bg-[color-mix(in_srgb,currentColor_25%,transparent)]"></i><i class="h-2 w-2 rounded-full bg-[color-mix(in_srgb,currentColor_25%,transparent)]"></i></div>`;

// A4 세로 면 두 장. 앞 면에 머리·본문 줄·상자·면 번호
const sheet = (kicker, title, body) => `
    <div class="relative aspect-[210/297] w-36 sm:w-40">
        <div class="${PANEL} absolute inset-0 translate-x-6 -translate-y-2 rotate-6 rounded-sm opacity-55"></div>
        <div class="${PANEL} ${MOVE} relative flex h-full -rotate-2 flex-col gap-1.5 rounded-sm p-3.5 text-left">
            <span class="font-mono text-[9px] uppercase tracking-[.14em] text-(--accent)">${kicker}</span>
            <b class="mb-1 border-b border-[color-mix(in_srgb,currentColor_18%,transparent)] pb-1.5 text-sm leading-tight">${title}</b>
            ${body}
            <span class="mt-auto self-end font-mono text-[10px] tabular-nums opacity-45">28</span>
        </div>
    </div>`;

export const ART = {
    // 가이드북: 본문 면 하나 — 줄글과 「대학별 확인」 같은 상자
    guide: () => sheet("제2부", "서류기반 면접", `
        <i class="${LINE}"></i><i class="${LINE} w-[86%]"></i><i class="${LINE} w-[64%]"></i>
        <div class="mt-1.5 grid gap-1 border-l-2 border-(--accent) bg-[color-mix(in_srgb,var(--accent)_8%,transparent)] p-1.5">
            <i class="h-1.5 w-[70%] rounded-sm bg-(--accent) opacity-55"></i><i class="h-1.5 rounded-sm bg-[color-mix(in_srgb,currentColor_12%,transparent)]"></i>
        </div>
        <i class="${LINE} mt-1"></i><i class="${LINE} w-[78%]"></i>`),

    // 문제 은행: 유형으로 묶은 문항 목록
    questions: () => {
        const rows = [["01", "이 학과를 지원한 이유는 무엇입니까?", ""], ["02", "입학 후 가장 공부하고 싶은 분야는?", ""], ["03", "졸업 후의 진로 계획을 말해 보세요.", "opacity-60"]];
        return `
        <div class="${PANEL} ${MOVE} min-h-36 w-[88%] -rotate-2 rounded-sm p-3.5 text-left">
            ${WIN_HEAD}
            <div class="my-3 flex items-center justify-between text-sm font-bold"><span>유형별 문항</span><span class="border border-(--accent) px-2 py-0.5 font-mono text-[10px] uppercase tracking-[.12em] text-(--accent)">지원 동기</span></div>
            <div class="grid gap-1.5 text-xs">${rows.map(([n, q, o]) => `<div class="grid grid-cols-[1.8em_1fr] items-center gap-2 border-b border-[color-mix(in_srgb,currentColor_10%,transparent)] px-0.5 py-1.5 ${o}"><b class="font-mono tabular-nums text-(--accent)">${n}</b><span class="truncate">${q}</span></div>`).join("")}</div>
        </div>`;
    },

    // 그림을 정하지 않은 자료: 그 자료 이름을 적은 A4 면
    page: (item) => sheet(item.tag, item.name, `
        <i class="${LINE}"></i><i class="${LINE} w-[86%]"></i><i class="${LINE} w-[64%]"></i>
        <i class="${LINE} mt-2"></i><i class="${LINE} w-[78%]"></i><i class="${LINE} w-[55%]"></i>`)
};
