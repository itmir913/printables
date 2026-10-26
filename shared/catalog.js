/*
 * 공개하는 자료의 목록. 바로가기 쪽은 모두 이 목록으로 그려진다.
 *   저장소 루트 index.html      → 모든 분야와 그 자료 (luminousky.com/printables/)
 *   분야 폴더 index.html        → 그 분야의 묶음과 자료 (luminousky.com/printables/admissions/)
 *
 * 자료를 더할 때
 *   1. 분야 폴더 아래에 자료 폴더를 만들고 index.html 을 둔다. 폴더 이름이 주소다.
 *   2. 여기 그 분야의 groups[].items 에 한 줄을 더한다.
 *
 * 분야를 더할 때
 *   1. 저장소 루트에 분야 폴더를 만들고, admissions/index.html 을 복사해
 *      <body data-category="…"> 와 <title> · description 만 바꾼다.
 *   2. 여기 CATEGORIES 에 분야를 하나 더한다. tone 은 site.css 의 팔레트 이름 가운데 고른다
 *      (blue · pink · violet · plum · peach).
 *
 * 항목의 뜻
 *   id      폴더 이름 = 주소. 한 번 공개하면 바꾸지 않는다 (나눠 준 링크가 끊긴다)
 *   title   섹션 머리의 큰 글자 / hero 히어로 제목 / en 영문 표기
 *   line    섹션 머리 옆의 한두 문장
 *   art     art.js 의 그림 이름. 없으면 그 자료 이름을 적은 A4 면 그림이 들어간다
 */
export const CATEGORIES = [
    {
        id: 'admissions',
        title: '진학',
        hero: '진학 지도',
        en: 'Admissions',
        tone: 'plum',
        line: '교실에서 바로 인쇄해 쓰는 진학 지도 자료.',
        groups: [
            {
                id: 'interview',
                title: '면접',
                line: '2027학년도 수시 면접 지도를 위한 가이드북과 문제 은행입니다. 링크로 열고, Chrome으로 인쇄합니다.',
                items: [
                    {
                        path: 'interview-guide/',
                        tag: 'Guidebook',
                        name: '면접 지도 가이드북',
                        copy: '유형별 면접 준비 매뉴얼과 답변 예시, 학생 배부용 활동지를 한 권에 담았습니다. 필요한 면만 골라 인쇄할 수 있습니다.',
                        art: 'guide'
                    },
                    {
                        path: 'interview-questions/',
                        tag: 'Question bank',
                        name: '면접 문제 은행',
                        copy: '가이드북의 별책입니다. 면접 문항을 유형별·전공별로 정리해 학생 연습용으로 인쇄할 수 있습니다.',
                        art: 'questions'
                    }
                ]
            }
        ]
    }
];
