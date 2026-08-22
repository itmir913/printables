/* 면 번호 자동 매기기 + 인쇄 범위 전환
   면 번호를 손으로 적지 않는다. 면을 넣거나 빼도 저절로 맞는다. */
(function (w, d) {
  'use strict';

  function paginate() {
    var pages = d.querySelectorAll('.page');
    pages.forEach(function (p, i) {
      var n = i + 1;
      p.setAttribute('data-pg', n);
      var slot = p.querySelector('.foot .pg');
      if (slot) slot.textContent = n;
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
