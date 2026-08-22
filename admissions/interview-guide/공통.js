/* 두 책이 함께 쓰는 것
 *   면접지도가이드북.html · 문제은행.html
 *
 * 하는 일 세 가지.
 *   1. 면 번호를 매긴다. 손으로 적지 않으므로 면을 넣거나 빼도 저절로 맞는다.
 *   2. 꼬리말 왼쪽에 책 이름을 박는다. 모든 면이 같은 문구다.
 *   3. 인쇄 범위를 바꾼다 (전체 / 본문만 / 학생 배부용 부록만).
 */
(function (w, d) {
  'use strict';

  function paginate() {
    /* 꼬리말 왼쪽 문구 — <body data-book="…"> 한 곳만 고치면 전부 바뀐다.
       나중에 저작자 표시를 붙이고 싶으면 그 한 줄에 적으면 된다. */
    var book = d.body.getAttribute('data-book') || '';

    var pages = d.querySelectorAll('.page');
    pages.forEach(function (p, i) {
      var n = i + 1;
      p.setAttribute('data-pg', n);
      var slot = p.querySelector('.foot .pg');
      if (slot) slot.textContent = n;
      var bk = p.querySelector('.foot .bk');
      if (bk) bk.textContent = book;
    });

    /* 차례 — data-to="앵커id" 가 가리키는 면의 번호를 채운다 */
    d.querySelectorAll('[data-to]').forEach(function (el) {
      var target = d.getElementById(el.getAttribute('data-to'));
      var slot = el.querySelector('.pg');
      if (!slot) return;
      var host = target && target.closest('.page');
      slot.textContent = host ? host.getAttribute('data-pg') : '—';
    });
  }

  function setScope(s) {
    d.body.classList.toggle('only-teacher', s === 'teacher');
    d.body.classList.toggle('only-student', s === 'student');
    ['all', 'teacher', 'student'].forEach(function (k) {
      var b = d.getElementById('b-' + k);
      if (b) b.setAttribute('aria-pressed', String(k === s));
    });
  }

  w.paginate = paginate;
  w.setScope = setScope;

  /* 조각을 나중에 붙이는 경우에는 붙인 뒤 paginate() 를 부른다 */
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', paginate);
  else paginate();
})(window, document);
