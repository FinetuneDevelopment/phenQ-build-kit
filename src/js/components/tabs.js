'use strict';

export default function tabFactory() {

  let myFactory = {};
  // https://itnext.io/different-ways-to-achieve-encapsulation-in-javascript-es6-7cb938e83f2d
  //this.localVariable = 'Some string';

  myFactory.init = function () {
    var tabset = document.querySelectorAll('.tab-set');
    // Do we have owt to do?
    if (tabset.length) {
      // Might need to do this more than once.
      for (var i = 0; i < tabset.length; i++) {
        // Tab scroll controls
        var scrollControl = document.createElement('p'),
          currentTabs = tabset[i];

        scrollControl.classList.add('scroll-control', 'hidden', 'text-right');
        scrollControl.setAttribute('data-js', 'scroll-control');
        // Need some SVGs here, eventually.
        scrollControl.innerHTML = '<button class="btn btn-icon" type="button" data-js="previous" title="Scroll left"><span class="shape sh-arrow-left-round"><span class="sr-only">Scroll tabs left</span></span></button> <button class="btn btn-icon" type="button" data-js="next" title="Scroll right"><span class="shape sh-arrow-right-round"><span class="sr-only">Scroll tabs right</span></span></button>';
        // Insert the controls before the tabs
        currentTabs.insertAdjacentElement('beforebegin', scrollControl);
        // Add an attribute, so CSS can hide the scrollbar
        currentTabs.setAttribute('data-js', 'active');
        // Check if we need to show the scroll buttons or not
        this.scrollCheck();
        // Set up click events
        var btnPrevious = currentTabs.previousElementSibling.querySelector('[data-js="previous"]'),
          btnNext = currentTabs.previousElementSibling.querySelector('[data-js="next"]');

        btnPrevious.addEventListener('click', this.previousTab, false);
        btnNext.addEventListener('click', this.nextTab, false);
        // Gets the currently selected tab as far to the left as possible
        var currentTabPos = this.currentTab(currentTabs).offsetLeft,
          pageMargin = Math.round(currentTabs.getBoundingClientRect().left);
        currentTabs.scroll(currentTabPos - pageMargin, 0);
      }
    }
  },
    // This function searches the DOM for tabsets and shows or hides the
    // scroll buttons, as required.
    myFactory.scrollCheck = function () {
      var tabset = document.querySelectorAll('.tab-set');
      if (tabset.length) {
        for (var i = 0; i < tabset.length; i++) {
          var nav = tabset[i].previousSibling;
          // If the element has a scroll bar
          if ((tabset[i].scrollWidth > tabset[i].clientWidth)) {
            nav.classList.remove('hidden');
          } else {
            nav.classList.add('hidden');
          }
        }
      }
    },
    // User has clicked on the (<-) button
    myFactory.previousTab = function (e) {
      var tabset = e.target.closest('[data-js="scroll-control"]').nextElementSibling,
        pageMargin = Math.round(tabset.getBoundingClientRect().left),
        tabNodes = tabset.querySelectorAll('li'),
        arScrollpoints = [];

      // Builds up an array of the snap points of the tab navigation, from left to right.
      for (var i = 0; i < tabNodes.length; i++) {
        arScrollpoints[i] = (tabNodes[i].offsetLeft - pageMargin);
      }
      // Works out which snap point we're currently closest to, working from the end back.
      for (var i = (arScrollpoints.length - 1); i >= 0; i--) {
        if (arScrollpoints[i] < tabset.scrollLeft) {
          tabset.scroll(arScrollpoints[i], 0);
          break;
        }
      }
    },
    // User has clicked on the (->) button
    myFactory.nextTab = function (e) {
      var tabset = e.target.closest('[data-js="scroll-control"]').nextElementSibling,
        pageMargin = Math.round(tabset.getBoundingClientRect().left),
        tabNodes = tabset.querySelectorAll('li'),
        arScrollpoints = [];

      // Builds up an array of the snap points of the tab navigation, from left to right.
      for (var i = 0; i < tabNodes.length; i++) {
        arScrollpoints[i] = (tabNodes[i].offsetLeft - pageMargin);
      }
      // Works out which snap point we're currently at.
      for (var i = 0; i < arScrollpoints.length; i++) {
        if (arScrollpoints[i] > tabset.scrollLeft) {
          tabset.scroll(arScrollpoints[i], 0);
          break;
        }
      }
    },
    // Pass this a tabset and it will return the currently selected tab
    myFactory.currentTab = function (tabset) {
      var selectedTab;
      // The current tab might be marked in a number of different ways
      // (not included currently: radio buttons)
      if (tabset.querySelectorAll('em').length) {
        selectedTab = tabset.querySelector('em').parentElement;
      } else if (tabset.querySelectorAll('.selected').length) {
        selectedTab = tabset.querySelector('.selected').parentElement;
      } else {
        // Falls back to the first element
        selectedTab = tabset.querySelectorAll('li')[0];
      }
      return selectedTab;
    }
  return myFactory;
}