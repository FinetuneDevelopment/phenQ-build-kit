'use strict';

export default function formFactory() {
  let myFactory = {};

  // Keeps the aria attributes up-to-date, after the CSS has done its magic.
  myFactory.init = function () {

    if (document.getElementById('nav-toggle') && document.querySelectorAll('.logo-nav__nav a')) {
      const navCheckbox = document.getElementById('nav-toggle');
      const navDad = navCheckbox.parentElement;
      // A long list of stuff which might both sit inside the navigation and fall into focus
      const navFocusEl = document.querySelectorAll('.logo-nav__nav a, .logo-nav__nav input, .logo-nav__nav button, .logo-nav__nav select');

      navCheckbox.addEventListener('change', this.ariaUpdate);
      window.addEventListener('resize', this.ariaUpdate);
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
        thisAnchor.addEventListener('blur', function (e) {
          // The user might attempt to dismiss the tooltip by
          // clicking outside of it, inadvertently closing
          // the navigation.
          if (e.target.id !== 'country-selector') {
            let focusOut = new Event('change');
            navCheckbox.checked = false;
            navCheckbox.dispatchEvent(focusOut);
          }
        }, true);
        // We also need to do this for click because there's
        // jump links in the nav and we need it to close after
        // the user has whooshed their way down the page
        thisAnchor.addEventListener('click', function (e) {
          if (e.target.id !== 'country-selector') {
            let focusOut = new Event('change');
            navCheckbox.checked = false;
            navCheckbox.dispatchEvent(focusOut);
          }
        }, true);
      }

      // This makes the main naivgation "sticky", but only when the user scrolls up
      if (document.querySelector('[data-js="logo-nav"]')) {
        let lastScrollTop = 0;
        let logoNav = document.querySelector('[data-js="logo-nav"]');
        let logoNavDad = logoNav.parentElement;
        // So if we're going to pull .logo-nav in and out of the document flow, we need
        // something to take its place, to stop the rest of the document from shifting
        // about. Rather than cloning it (and dealing with duplicate IDs), I'm going to
        // measure its height and add it to the parent element.
        let navHeight = logoNav.offsetHeight;

        window.addEventListener('scroll', function () {
          let st = window.pageYOffset || document.documentElement.scrollTop;
          if (st > lastScrollTop) { // Scroll down
            logoNav.classList.remove('sticky-show');
          } else if (st === 0) { // Reached the top of the page
            logoNav.classList.remove('sticky', 'sticky-show');
            logoNavDad.style.paddingTop = 0;
          } else { // Scroll up
            logoNav.classList.add('sticky', 'sticky-show');
            logoNavDad.style.paddingTop = navHeight + 'px';
          }
          lastScrollTop = st <= 0 ? 0 : st; // For Mobile or negative scrolling
        }, false);

        // Recalculates the height of the navigation, when the user resizes the page
        window.addEventListener('resize', function () {
          navHeight = logoNav.offsetHeight;
        });

      }
    }
  },
    myFactory.ariaUpdate = function () {
      let theBody = document.querySelector('body');
      let navLabel = document.querySelector('.logo-nav__toggle label');
      let navCheckbox = document.getElementById('nav-toggle');
      let navDav = navCheckbox.parentElement;

      // Are we in mobile view?
      if (navLabel.offsetParent) {
        navLabel.setAttribute('aria-haspopup', 'true');

        // Is the navigation bar visible?
        if (navCheckbox.checked) {
          navLabel.setAttribute('aria-expanded', 'true');
          theBody.style.overflow = 'hidden';
          navDav.classList.add('bg-light-grey');
        } else {
          navLabel.setAttribute('aria-expanded', 'false');
          theBody.style.overflow = 'visible';
          navDav.classList.remove('bg-light-grey');
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
