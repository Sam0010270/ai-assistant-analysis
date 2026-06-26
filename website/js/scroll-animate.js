/**
 * 滚动触发动画
 * 使用 Intersection Observer 监听带 anim-* 类的元素
 * 元素进入视口时添加 is-visible 类触发 CSS 过渡
 */

(function () {
  'use strict';

  var ANIM_SELECTORS = [
    '.anim-fade-in',
    '.anim-slide-left',
    '.anim-slide-right',
    '.anim-bar',
    '.anim-stagger',
    '.comp-formula',
    '.comp-timeline'
  ];

  function init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.querySelectorAll(ANIM_SELECTORS.join(',')).forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');

          if (entry.target.classList.contains('anim-stagger')) {
            var children = entry.target.children;
            for (var i = 0; i < children.length; i++) {
              children[i].classList.add('is-visible');
            }
          }

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    });

    document.querySelectorAll(ANIM_SELECTORS.join(',')).forEach(function (el) {
      observer.observe(el);
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
