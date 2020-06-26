'use strict';

export default function formFactory() {
  let myFactory = {};

  myFactory.init = function () {
    const navCheckbox = document.getElementById('nav-toggle');
    const navAnchors = document.querySelectorAll('.logo-nav__nav a');

    window.addEventListener('resize', this.ariaUpdate);
    navCheckbox.addEventListener('change', this.ariaUpdate);
    this.ariaUpdate();

    // Listens for navigation items falling into focus, then
    // shows the navigation when that happens
    for (var i = 0; i < navAnchors.length; i++) {
      let thisAnchor = navAnchors[i];
      thisAnchor.addEventListener('focus', function () {
        navCheckbox.checked = true;
      }, true);
      thisAnchor.addEventListener('blur', function () {
        navCheckbox.checked = false;
      }, true);
    }

  },
    myFactory.ariaUpdate = function () {
      let navToggle = document.querySelector('.logo-nav__toggle label');
      let navCheckbox = document.getElementById('nav-toggle');

      // Are we in mobile view?
      if (navToggle.offsetParent) {
        navToggle.setAttribute('aria-haspopup', 'true');

        // Is the navigation bar visible?
        if (navCheckbox.checked) {
          navToggle.setAttribute('aria-expanded', 'true');
        } else {
          navToggle.setAttribute('aria-expanded', 'false');
        }
      }
      // The navigation is in desktop mode
      else {
        navToggle.removeAttribute('aria-haspopup');
        navToggle.removeAttribute('aria-expanded');
      }
    }

  return myFactory;
}
