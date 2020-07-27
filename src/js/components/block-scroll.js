'use strict';

export default function blockScroll() {

  let myFactory = {};

  // Turns any arbitrary element into a scrolling element, as long as it has the following markup:
  // <div class="scroll-control" data-js="scroll-control">
  //  <div class="block-scroll__child" data-js="block-scroll-item">Scroll item</div>
  //  <div class="block-scroll__child" data-js="block-scroll-item">Scroll item</div>
  //  ...
  // </div>
  // Comes in two flavours, .block-scroll__child (fixed width) and
  // .block-scroll__child-wide (always 100% of the width of the parent)
  myFactory.init = function () {
    let scrollSet = document.querySelectorAll('[data-js="block-scroll"]');

    // Do we have owt to do?
    if (scrollSet.length) {
      // Might need to do this more than once.
      for (let i = 0; i < scrollSet.length; i++) {
        // Tab scroll controls
        let scrollControl = document.createElement('p');
        let currentScroll = scrollSet[i];

        // IE, you encouragable scamp!
        scrollControl.classList.add('scroll-control');
        scrollControl.classList.add('hidden');
        scrollControl.setAttribute('data-js', 'scroll-control');

        scrollControl.innerHTML = '<button class="btn btn-icon icon-x-small" type="button" data-js="previous" title="Scroll left"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-label="Arrow left"><path d="M50.078 100l8.855-8.84L23.99 56.076h76.1V43.8h-76.1L58.933 8.7 50.078-.148 0 49.93z" fill="currentColor"/></svg></button> <button class="btn btn-icon icon-x-small" type="button" data-js="next" title="Scroll right"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-label="Arrow right"><path d="M50.003-.148l-8.855 8.84L76.1 43.775H0v12.286h76.1l-34.942 35.09L50.003 100l50.078-50.078z" fill="currentColor"/></svg></button>';
        // Insert the controls before the tabs
        currentScroll.insertAdjacentElement('beforebegin', scrollControl);
        // Add an attribute, so CSS can hide the scrollbar
        currentScroll.setAttribute('data-active', 'true');
        // Marks the element, so the pollyfill will work (Safari and Edge)
        currentScroll.style.scrollBehavior = 'smooth';
        // Set up click events
        let btnPrevious = currentScroll.previousElementSibling.querySelector('[data-js="previous"]');
        let btnNext = currentScroll.previousElementSibling.querySelector('[data-js="next"]');

        btnPrevious.addEventListener('click', this.previousItem, false);
        btnNext.addEventListener('click', this.nextItem, false);
      }
      window.addEventListener('resize', this.scrollCheck);
      this.scrollCheck();
    }
  },
    // This function searches the DOM for Block Scrolls and shows or hides the
    // scroll buttons, as required.
    myFactory.scrollCheck = function () {
      let scrollSet = document.querySelectorAll('[data-js="block-scroll"]');

      if (scrollSet.length) {
        // Go through each matching set of scrollable items
        for (let i = 0; i < scrollSet.length; i++) {
          let currentScroll = scrollSet[i];
          let scrollNav = currentScroll.previousElementSibling;

          // If the element has a scroll bar
          if ((currentScroll.scrollWidth > currentScroll.clientWidth)) {
            scrollNav.classList.remove('hidden');
          } else {
            scrollNav.classList.add('hidden');
          }
        }
      }
    },
    // User has clicked on the (<-) button
    myFactory.previousItem = function (e) {
      let scrollParent = e.target.closest('[data-js="scroll-control"]').nextElementSibling;
      let blockScrollItems = scrollParent.querySelectorAll('[data-js="block-scroll-item"]');
      let arScrollpoints = [];

      // Builds up an array of the snap points of the tab navigation, from left to right.
      for (let i = 0; i < blockScrollItems.length; i++) {
        arScrollpoints[i] = (blockScrollItems[i].offsetLeft);
      }
      // Works out which snap point we're currently closest to, working from the end back.
      for (let i = (arScrollpoints.length - 1); i >= 0; i--) {
        // If it only needs to scroll a tiny amount, then skip the current point and move onto the next one.
        // This happens if the user clicks the button during the animation and helps to make the scroll feel
        // less laggy.
        if ((i > 0) && (arScrollpoints[i] - scrollParent.scrollLeft) < 10) {
          scrollParent.scrollLeft = arScrollpoints[i - 1];
          break;
        } else if (arScrollpoints[i] < scrollParent.scrollLeft) {
          scrollParent.scrollLeft = arScrollpoints[i];
          break;
        }
      }
    },
    // User has clicked on the (->) button
    myFactory.nextItem = function (e) {
      let scrollParent = e.target.closest('[data-js="scroll-control"]').nextElementSibling;
      let blockScrollItems = scrollParent.querySelectorAll('[data-js="block-scroll-item"]');
      let arScrollpoints = [];

      // Builds up an array of the snap points of the tab navigation, from left to right.
      for (let i = 0; i < blockScrollItems.length; i++) {
        arScrollpoints[i] = (blockScrollItems[i].offsetLeft);
      }

      // Works out which snap point we're currently at.
      for (let i = 0; i < arScrollpoints.length; i++) {
        if (arScrollpoints[i] > scrollParent.scrollLeft) {
          // If it only needs to scroll a tiny amount, then skip the current point and move onto the next one.
          // This happens if the user clicks the button during the animation and helps to make the scroll feel
          // less laggy.
          if (i < arScrollpoints.length && (arScrollpoints[i] - scrollParent.scrollLeft) < 10) {
            scrollParent.scrollLeft = arScrollpoints[(i + 1)];
            break;
          } else if (arScrollpoints[i] > scrollParent.scrollLeft) {
            scrollParent.scrollLeft = arScrollpoints[i];
            break;
          }
        }
      }
    }
  return myFactory;
}