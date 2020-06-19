'use strict';

export default function blockScroll() {

  let myFactory = {};

  myFactory.init = function () {
    var scrollSet = document.querySelectorAll('[data-js="block-scroll"]');
    // Do we have owt to do?
    if (scrollSet.length) {
      // Might need to do this more than once.
      for (var i = 0; i < scrollSet.length; i++) {
        // Tab scroll controls
        var scrollControl = document.createElement('p'),
          currentScroll = scrollSet[i];

        scrollControl.classList.add('scroll-control', 'hidden', 'text-right');
        scrollControl.setAttribute('data-js', 'scroll-control');
        // Need some SVGs here, eventually.
        scrollControl.innerHTML = '<button class="btn btn-icon" type="button" data-js="previous" title="Scroll left"><span class="shape sh-arrow-left-round"><span class="sr-only">Scroll left</span></span></button> <button class="btn btn-icon" type="button" data-js="next" title="Scroll right"><span class="shape sh-arrow-right-round"><span class="sr-only">Scroll right</span></span></button>';
        // Insert the controls before the tabs
        currentScroll.insertAdjacentElement('beforebegin', scrollControl);
        // Add an attribute, so CSS can hide the scrollbar
        currentScroll.setAttribute('data-active', 'true');
        // Check if we need to show the scroll buttons or not
        this.scrollCheck();
        // Set up click events
        var btnPrevious = currentScroll.previousElementSibling.querySelector('[data-js="previous"]'),
          btnNext = currentScroll.previousElementSibling.querySelector('[data-js="next"]');

        btnPrevious.addEventListener('click', this.previousItem, false);
        btnNext.addEventListener('click', this.nextItem, false);
      }
    }
  },
    // This function searches the DOM for Block Scrolls and shows or hides the
    // scroll buttons, as required.
    myFactory.scrollCheck = function () {
      var scrollSet = document.querySelectorAll('[data-js="block-scroll"]');
      if (scrollSet.length) {
        // Go through each matching set of scrollable items
        for (var i = 0; i < scrollSet.length; i++) {
          var currentScroll = scrollSet[i],
            scrollNav = currentScroll.previousSibling;
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
      var scrollParent = e.target.closest('[data-js="scroll-control"]').nextElementSibling,
        pageMargin = Math.round(scrollParent.getBoundingClientRect().left),
        blockScrollItems = scrollParent.querySelectorAll('[data-js="block-scroll-item"]'),
        arScrollpoints = [];

      // Builds up an array of the snap points of the tab navigation, from left to right.
      for (var i = 0; i < blockScrollItems.length; i++) {
        arScrollpoints[i] = (blockScrollItems[i].offsetLeft - pageMargin);
      }
      // Works out which snap point we're currently closest to, working from the end back.
      for (var i = (arScrollpoints.length - 1); i >= 0; i--) {
        // If it only needs to scroll a tiny amount, then skip the current point and move onto the next one.
        // This happens if the user clicks the button during the animation and helps to make the scroll feel
        // less laggy.
        if ((i > 0) && (arScrollpoints[i] - scrollParent.scrollLeft) < 10) {
          scrollParent.scroll(arScrollpoints[(i - 1)], 0);
          break;
        } else if (arScrollpoints[i] < scrollParent.scrollLeft) {
          scrollParent.scroll(arScrollpoints[i], 0);
          break;
        }
      }
    },
    // User has clicked on the (->) button
    myFactory.nextItem = function (e) {
      var scrollParent = e.target.closest('[data-js="scroll-control"]').nextElementSibling,
        pageMargin = Math.round(scrollParent.getBoundingClientRect().left),
        blockScrollItems = scrollParent.querySelectorAll('[data-js="block-scroll-item"]'),
        arScrollpoints = [];

      // Builds up an array of the snap points of the tab navigation, from left to right.
      for (var i = 0; i < blockScrollItems.length; i++) {
        arScrollpoints[i] = (blockScrollItems[i].offsetLeft - pageMargin);
      }
      // Works out which snap point we're currently at.
      for (var i = 0; i < arScrollpoints.length; i++) {
        if (arScrollpoints[i] > scrollParent.scrollLeft) {
          // If it only needs to scroll a tiny amount, then skip the current point and move onto the next one.
          // This happens if the user clicks the button during the animation and helps to make the scroll feel
          // less laggy.
          if (i < arScrollpoints.length && (arScrollpoints[i] - scrollParent.scrollLeft) < 10) {
            scrollParent.scroll(arScrollpoints[(i + 1)], 0);
            break;
          } else if (arScrollpoints[i] > scrollParent.scrollLeft) {
            scrollParent.scroll(arScrollpoints[i], 0);
            break;
          }
        }
      }
    }
  return myFactory;
}