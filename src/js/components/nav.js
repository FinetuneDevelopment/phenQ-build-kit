'use strict';

export default function formFactory() {
  let myFactory = {};

  // Keeps the aria attributes up-to-date, after the CSS has done its magic.
  myFactory.init = function () {

    if (document.getElementById('nav-toggle') && document.querySelectorAll('.logo-nav__nav a')) {
      const navCheckbox = document.getElementById('nav-toggle');
      // A long list of stuff which might both sit inside the navigation and fall into focus
      const navFocusEl = document.querySelectorAll('.logo-nav__nav a, .logo-nav__nav input, .logo-nav__nav button, .logo-nav__nav select');

      window.addEventListener('resize', this.ariaUpdate);
      navCheckbox.addEventListener('change', this.ariaUpdate);
      this.ariaUpdate();

      // Listens for navigation items falling into focus, then
      // shows the navigation when that happens
      for (var i = 0; i < navFocusEl.length; i++) {
        let thisAnchor = navFocusEl[i];
        thisAnchor.addEventListener('focus', function () {
          let focusIn = new Event('change');
          navCheckbox.checked = true;
          navCheckbox.dispatchEvent(focusIn);
        }, true);
        thisAnchor.addEventListener('blur', function () {
          let focusOut = new Event('change');
          navCheckbox.checked = false;
          navCheckbox.dispatchEvent(focusOut);
        }, true);
      }
    }

  },
    myFactory.ariaUpdate = function () {
      let theBody = document.querySelector('body');
      let navLabel = document.querySelector('.logo-nav__toggle label');
      let navCheckbox = document.getElementById('nav-toggle');

      // Are we in mobile view?
      if (navLabel.offsetParent) {
        navLabel.setAttribute('aria-haspopup', 'true');

        // Is the navigation bar visible?
        if (navCheckbox.checked) {
          navLabel.setAttribute('aria-expanded', 'true');
          theBody.style.overflow = 'hidden';

        } else {
          navLabel.setAttribute('aria-expanded', 'false');
          theBody.style.overflow = 'visible';
        }
      }
      // The navigation is in desktop mode
      else {
        navLabel.removeAttribute('aria-haspopup');
        navLabel.removeAttribute('aria-expanded');
        theBody.style.overflow = 'visible';
      }
    }

  return myFactory;
}
