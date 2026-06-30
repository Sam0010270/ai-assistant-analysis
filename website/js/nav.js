/**
 * 导航系统
 * - 树形目录结构（完整分析框架）
 * - 当前页面高亮
 * - 移动端汉堡菜单
 */

(function () {
  'use strict';

  var NAV_ITEMS = [
    { title: '入选和分析逻辑', href: '/pages/selection.html' },
    { title: '产品概况', href: '/pages/overview.html' },
    {
      title: '能力对比',
      children: [
        {
          title: '模型层', href: '/pages/model.html',
          children: [
            { title: '旗舰模型基本信息', href: '/pages/model-info.html' },
            { title: 'Benchmark 数据', href: '/pages/model-benchmark.html' },
            { title: 'LM Arena', href: '/pages/model-arena.html' }
          ]
        },
        {
          title: '应用层', href: '/pages/application.html',
          children: [
            {
              title: '信息边界', href: '/pages/application.html#info-boundary',
              children: [
                { title: '长期记忆系统', href: '/pages/app-memory.html' },
                { title: '用户私有信息', href: '/pages/app-private-info.html' },
                { title: '实时信息', href: '/pages/app-realtime.html' }
              ]
            },
            {
              title: '行动边界', href: '/pages/application.html#action-boundary',
              children: [
                { title: '内部沙箱及其产物', href: '/pages/app-sandbox.html' },
                { title: '外部系统及其产物', href: '/pages/app-external.html' }
              ]
            },
            {
              title: '补充维度', href: '/pages/application.html#supplementary',
              children: [
                { title: '定时任务', href: '/pages/app-scheduled.html' },
                { title: '多模态生成', href: '/pages/multimodal.html' }
              ]
            }
          ]
        }
      ]
    },
    { title: '思考', href: '/pages/thoughts.html' }
  ];

  function getBasePath() {
    var path = window.location.pathname;
    if (path.indexOf('/pages/') !== -1) return '..';
    return '.';
  }

  function isCurrentPage(href) {
    if (!href) return false;
    var pagePart = href.split('#')[0];
    var hash = href.indexOf('#') !== -1 ? href.split('#')[1] : null;
    var path = window.location.pathname;
    if (pagePart === '/index.html') {
      return path === '/' || path.endsWith('/index.html');
    }
    if (!path.endsWith(pagePart)) return false;
    if (hash) return false;
    return true;
  }

  function renderItems(items, level, base) {
    var html = '';
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var active = isCurrentPage(item.href) ? ' is-active' : '';
      var lvClass = ' nav-lv' + level;

      if (item.href) {
        html += '<a class="nav-item' + lvClass + active + '" href="' + base + item.href + '">' + item.title + '</a>';
      } else {
        html += '<span class="nav-item nav-label' + lvClass + '">' + item.title + '</span>';
      }

      if (item.children) {
        html += renderItems(item.children, level + 1, base);
      }
    }
    return html;
  }

  function buildNav() {
    var nav = document.getElementById('siteNav');
    if (!nav) return;

    var base = getBasePath();
    var html = '<a class="nav-logo" href="' + base + '/index.html">AI 通用助手分析</a>';
    html += '<div class="nav-tree">';
    html += renderItems(NAV_ITEMS, 1, base);
    html += '</div>';
    nav.innerHTML = html;
  }

  function setupMobileMenu() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('siteNav');
    var overlay = document.querySelector('.nav-overlay');
    if (!toggle || !nav) return;

    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.contains('is-open');
      toggle.classList.toggle('is-active', !isOpen);
      nav.classList.toggle('is-open', !isOpen);
      if (overlay) overlay.classList.toggle('is-open', !isOpen);
    });

    if (overlay) {
      overlay.addEventListener('click', function () {
        toggle.classList.remove('is-active');
        nav.classList.remove('is-open');
        overlay.classList.remove('is-open');
      });
    }
  }

  function setupScrollHighlight() {
    var sections = document.querySelectorAll('h2[id]');
    if (!sections.length) return;

    var navLinks = document.querySelectorAll('.nav-item');
    var anchors = [];
    for (var i = 0; i < sections.length; i++) {
      var sectionId = sections[i].id;
      var sectionTitle = sections[i].textContent.trim();
      for (var j = 0; j < navLinks.length; j++) {
        var href = navLinks[j].getAttribute('href');
        if (!href) continue;
        var linkTitle = navLinks[j].textContent.trim();
        if (href.indexOf('#' + sectionId) !== -1 || linkTitle === sectionTitle) {
          anchors.push({ el: sections[i], link: navLinks[j] });
          break;
        }
      }
    }
    if (!anchors.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        for (var j = 0; j < anchors.length; j++) {
          if (anchors[j].el === entry.target) {
            if (entry.isIntersecting) {
              anchors[j].link.classList.add('is-active');
            } else {
              anchors[j].link.classList.remove('is-active');
            }
          }
        }
      });
    }, { rootMargin: '0px 0px -40% 0px' });

    for (var k = 0; k < anchors.length; k++) {
      observer.observe(anchors[k].el);
    }

    var bottomHighlighted = null;
    window.addEventListener('scroll', function () {
      var atBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
      if (atBottom) {
        for (var m = anchors.length - 1; m >= 0; m--) {
          var rect = anchors[m].el.getBoundingClientRect();
          if (rect.top < window.innerHeight) {
            if (bottomHighlighted !== anchors[m].link) {
              if (bottomHighlighted) bottomHighlighted.classList.remove('is-active');
              anchors[m].link.classList.add('is-active');
              bottomHighlighted = anchors[m].link;
            }
            break;
          }
        }
      } else if (bottomHighlighted) {
        bottomHighlighted.classList.remove('is-active');
        bottomHighlighted = null;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    buildNav();
    setupMobileMenu();
    setupScrollHighlight();
  });
})();
