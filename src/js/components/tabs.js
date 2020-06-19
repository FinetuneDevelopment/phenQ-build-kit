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

      // Accessibility JavaScript for the pure CSS tabs
      // All the secret, hidden radio buttons which control the tab set
      var tabRadios = document.querySelectorAll('[name="tabs"]'),
        tabPanels = document.querySelectorAll('[role="tabpanel"]');

      for (var i = 0; i < tabRadios.length; i++) {

        // We need to fiddle about with the markup, when the radio buttons change.
        tabRadios[i].oninput = function () {
          for (var j = 0; j < tabRadios.length; j++) {
            // Set aria-selected on all radio buttons to false
            tabRadios[j].setAttribute('aria-selected', false);
            // Set the "hidden" attribute of all the tab panels
            tabPanels[j].setAttribute('hidden', 'hidden');
          }
          // Set aria-selected on *this* radio button to true
          this.setAttribute('aria-selected', true);
          // Removes the "hidden" attribute on the currently selected tab pane
          document.getElementById(this.getAttribute('aria-controls')).removeAttribute('hidden');
        };

        // Keyboard navigation in the tab set.
        tabRadios[i].addEventListener('keydown', function (e) {
          var oldKey = e.keyCode,
            newKey = e.key;
          // User hits home to move to the first tab
          if (newKey === 'Home' || oldKey === 36) {
            e.preventDefault();
            var radio1 = tabRadios.item(0);
            radio1.focus();
            radio1.click();
          }
          // User hits the end key, to move to the last tab
          else if (newKey === 'End' || oldKey === 35) {
            e.preventDefault();
            var radioLast = tabRadios.item(tabRadios.length - 1);
            radioLast.focus();
            radioLast.click();
          }
        });
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