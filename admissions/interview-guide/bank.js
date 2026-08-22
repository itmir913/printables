/* 문항 은행 조판기
 *
 * 문항은행/*.md 의 내용을 A4 면에 나눠 담는다.
 * 문항을 하나씩 넣어 보고 칸이 넘치면 다음 단, 다음 면으로 넘긴다.
 * 그래서 .md 에서 문항을 더하거나 빼도 면이 저절로 다시 나뉜다.
 */
(function (w, d) {
  'use strict';

  function el(tag, cls, html) {
    var e = d.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function layout(book) {
    var root = d.getElementById('doc');
    var page = null, cols = null, col = null, colIndex = 0, pageNo = 0;

    function newPage(title, cont) {
      page = el('div', 'page');
      var head = el('div', 'head');
      head.innerHTML =
        '<div class="ttl"><span class="no"><span class="part">' + book.part + '</span>' +
        (cont ? '이어서' : '문항') + '</span><h2>' + title + '</h2></div>' +
        '<span class="path">' + book.path + '</span>';
      var body = el('div', 'body');
      cols = el('div', 'qcols');
      body.appendChild(cols);
      page.appendChild(head);
      page.appendChild(body);
      page.appendChild(el('div', 'foot',
        '<span>' + book.foot + '</span><span class="pg"></span>'));
      root.appendChild(page);
      colIndex = 0;
      col = el('div', 'qcol');
      cols.appendChild(col);
      pageNo++;
    }

    function nextCol(title) {
      if (colIndex === 0) {
        colIndex = 1;
        col = el('div', 'qcol');
        cols.appendChild(col);
      } else {
        newPage(title, true);
      }
    }

    /* 넘치면 되돌리고 자리를 옮긴다 */
    function put(node, title) {
      col.appendChild(node);
      if (col.scrollHeight > col.clientHeight) {
        col.removeChild(node);
        nextCol(title);
        col.appendChild(node);
        /* 새 단에서도 넘치면 그대로 둔다. 한 문항이 한 단보다 길 수는 없다 */
      }
    }

    book.groups.forEach(function (g, gi) {
      var title = book.title;
      if (gi === 0) newPage(title, false);
      /* 갈래가 바뀌면 소제목을 놓는다 */
      var h = el('h4', 'sh2 qh', g.name +
        ' <span class="qn">' + g.items.length + '</span>');
      put(h, title);
      var ul = el('ul', 'qlist');
      put(ul, title);
      g.items.forEach(function (q) {
        var li = el('li', null, q);
        ul.appendChild(li);
        if (col.scrollHeight > col.clientHeight) {
          ul.removeChild(li);
          if (!ul.children.length && ul.parentNode) ul.parentNode.removeChild(ul);
          nextCol(title);
          var cont = el('h4', 'sh2 qh cont', g.name + ' <span class="qn">이어서</span>');
          col.appendChild(cont);
          ul = el('ul', 'qlist');
          col.appendChild(ul);
          ul.appendChild(li);
        }
      });
    });
  }

  w.buildBank = function (books) {
    books.forEach(layout);
    if (w.paginate) w.paginate();
  };
})(window, document);
