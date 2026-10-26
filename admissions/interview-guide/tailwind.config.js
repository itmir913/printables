/* Tailwind 토큰. 두 책(가이드북 · 문제은행)이 함께 쓴다.
   전에는 두 index.html 에 같은 설정이 따로 있었다. */
export default {
  theme: {
    extend: {
      /* sans 와 mono 를 같은 글꼴로 둔다. 고정폭이 끼어들 자리가 없다. */
      fontFamily: {
        sans: ['Pretendard Variable','Pretendard','Noto Sans KR',
               '맑은 고딕','Malgun Gothic','sans-serif'],
        mono: ['Pretendard Variable','Pretendard','Noto Sans KR',
               '맑은 고딕','Malgun Gothic','sans-serif']
      },
      /* 무채색만. style.css 의 :root 변수를 그대로 옮긴 것이다. */
      colors: {
        ink:'#000', bodytx:'#1f1f1f', subtx:'#444', mute:'#6b6b6b', faint:'#949494',
        line:'#cfcfcf', line2:'#8f8f8f', fill:'#f2f2f2', fill2:'#e6e6e6'
      },
      /* 종이 위의 길이는 mm 로만 센다.  p-4mm  gap-5mm  mt-1mm */
      spacing: {
        '1mm':'1mm','1.5mm':'1.5mm','2mm':'2mm','2.5mm':'2.5mm','3mm':'3mm',
        '3.5mm':'3.5mm','4mm':'4mm','4.5mm':'4.5mm','5mm':'5mm','6mm':'6mm',
        '7mm':'7mm','8mm':'8mm','9mm':'9mm','10mm':'10mm','12mm':'12mm',
        '14mm':'14mm','16mm':'16mm','17mm':'17mm','18mm':'18mm','22mm':'22mm'
      },
      /* 글자 크기는 pt 로만 센다.  text-10.5pt */
      fontSize: {
        '8.5pt':'8.5pt','9pt':'9pt','9.5pt':'9.5pt','10pt':'10pt','10.5pt':'10.5pt',
        '11pt':'11pt','11.5pt':'11.5pt','12pt':'12pt','12.5pt':'12.5pt',
        '13pt':'13pt','13.5pt':'13.5pt','14pt':'14pt','15.5pt':'15.5pt',
        '16.5pt':'16.5pt','18pt':'18pt','21pt':'21pt','30pt':'30pt','34pt':'34pt'
      },
      width:  { a4:'210mm' },
      height: { a4:'297mm' },
      borderWidth: {
        hair:'1px', thin:'0.35mm', mid:'0.5mm', bold:'0.6mm',
        heavy:'0.9mm', bar:'1.4mm', bar2:'1.6mm', dbl:'2.2mm'
      }
    }
  }
};
