'use strict';

export default function tabFactory() {

  let myFactory = {};

  // The functional aspects of tabs are handled by CSS but this handles overflow in a slightly
  // better way, updates aria attributes and so on.
  myFactory.init = function () {
    let tabset = document.querySelectorAll('.tab-set');
    // Do we have owt to do?
    if (tabset.length) {
      // Might need to do this more than once.
      for (let i = 0; i < tabset.length; i++) {
        // Tab scroll controls
        let scrollControl = document.createElement('p');
        let currentTabs = tabset[i];

        scrollControl.classList.add('scroll-control');
        scrollControl.classList.add('hidden');
        scrollControl.setAttribute('data-js', 'scroll-control');
        scrollControl.innerHTML = '<button class="btn btn-icon icon-x-small" type="button" data-js="previous" title="Scroll left"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-label="Arrow left"><path d="M50.078 100l8.855-8.84L23.99 56.076h76.1V43.8h-76.1L58.933 8.7 50.078-.148 0 49.93z" fill="#273583"/></svg></button> <button class="btn btn-icon icon-x-small" type="button" data-js="next" title="Scroll right"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-label="Arrow right"><path d="M50.003-.148l-8.855 8.84L76.1 43.775H0v12.286h76.1l-34.942 35.09L50.003 100l50.078-50.078z" fill="#273583"/></svg></button>';
        // Insert the controls before the tabs
        currentTabs.insertAdjacentElement('beforebegin', scrollControl);
        // Add an attribute, so CSS can hide the scrollbar
        currentTabs.setAttribute('data-js', 'active');
        // Set up click events
        let btnPrevious = currentTabs.previousElementSibling.querySelector('[data-js="previous"]');
        let btnNext = currentTabs.previousElementSibling.querySelector('[data-js="next"]');

        btnPrevious.addEventListener('click', this.previousTab, false);
        btnNext.addEventListener('click', this.nextTab, false);
        // Gets the currently selected tab within view and at worst,
        // on the far right side of the screen.
        let currentTab = this.currentTab(currentTabs);
        let currentTabPos = currentTab.offsetLeft;
        let currentTabWidth = currentTab.offsetWidth;
        // let pageMargin = Math.round(currentTabs.getBoundingClientRect().left);
        // Is the current tab within view?
        if (currentTabs.offsetWidth < (currentTabPos + currentTabWidth)) {
          // Scroll the tabset as far left as required in order to show the right hand edge of the current tab
          currentTabs.scrollLeft = currentTabPos - currentTabs.offsetWidth + currentTabWidth;
        }
      }
      // Check if we need to show the scroll buttons on all of the
      // tabs we've just created
      this.scrollCheck();
      window.addEventListener('resize', this.scrollCheck);

      // Accessibility JavaScript for the pure CSS tabs
      // All the secret, hidden radio buttons which control the tab set
      let tabRadios = document.querySelectorAll('[name="tabs"]');
      let tabPanels = document.querySelectorAll('[role="tabpanel"]');

      for (let i = 0; i < tabRadios.length; i++) {

        // We need to fiddle about with the markup, when the radio buttons change.
        tabRadios[i].oninput = function () {
          for (let j = 0; j < tabRadios.length; j++) {
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
          let oldKey = e.keyCode;
          let newKey = e.key;
          // User hits home to move to the first tab
          if (newKey === 'Home' || oldKey === 36) {
            e.preventDefault();
            let radio1 = tabRadios.item(0);
            radio1.focus();
            radio1.click();
          }
          // User hits the end key, to move to the last tab
          else if (newKey === 'End' || oldKey === 35) {
            e.preventDefault();
            let radioLast = tabRadios.item(tabRadios.length - 1);
            radioLast.focus();
            radioLast.click();
          }
        });

        // Custom swipe detection from swipe.js
        tabPanels[i].addEventListener('swiped-left', function () {
          if (i < (tabRadios.length - 1)) tabRadios[i + 1].click();
        });
        tabPanels[i].addEventListener('swiped-right', function () {
          if (i > 0) tabRadios[i - 1].click();
        });
      }
    }
  },
    // This function searches the DOM for tabsets and shows or hides the
    // scroll buttons, as required.
    myFactory.scrollCheck = function () {
      let tabset = document.querySelectorAll('.tab-set');
      if (tabset.length) {
        for (let i = 0; i < tabset.length; i++) {
          let nav = tabset[i].previousSibling;
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
      let tabset = e.target.closest('[data-js="scroll-control"]').nextElementSibling;
      let pageMargin = Math.round(tabset.getBoundingClientRect().left);
      let tabNodes = tabset.querySelectorAll('li');
      let arScrollpoints = [];

      // Builds up an array of the snap points of the tab navigation, from left to right.
      for (let i = 0; i < tabNodes.length; i++) {
        arScrollpoints[i] = (tabNodes[i].offsetLeft - pageMargin);
      }
      // Works out which snap point we're currently closest to, working from the end back.
      for (let i = (arScrollpoints.length - 1); i >= 0; i--) {
        if (arScrollpoints[i] < tabset.scrollLeft) {
          //tabset.scroll(arScrollpoints[i], 0);
          tabset.scrollLeft = arScrollpoints[i];
          break;
        }
      }
    },
    // User has clicked on the (->) button
    myFactory.nextTab = function (e) {
      let tabset = e.target.closest('[data-js="scroll-control"]').nextElementSibling;
      let pageMargin = Math.round(tabset.getBoundingClientRect().left);
      let tabNodes = tabset.querySelectorAll('li');
      let arScrollpoints = [];

      // Builds up an array of the snap points of the tab navigation, from left to right.
      for (let i = 0; i < tabNodes.length; i++) {
        arScrollpoints[i] = (tabNodes[i].offsetLeft - pageMargin);
      }
      // Works out which snap point we're currently at.
      for (let i = 0; i < arScrollpoints.length; i++) {
        if (arScrollpoints[i] > tabset.scrollLeft) {
          //tabset.scroll(arScrollpoints[i], 0);
          tabset.scrollLeft = arScrollpoints[i];
          break;
        }
      }
    },
    // Pass this a tabset and it will return the currently selected tab
    myFactory.currentTab = function (tabset) {
      let selectedTab;
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