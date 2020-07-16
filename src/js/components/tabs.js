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

        scrollControl.classList.add('scroll-control', 'hidden');
        scrollControl.setAttribute('data-js', 'scroll-control');
        scrollControl.innerHTML = '<button class="btn btn-icon icon-x-small" type="button" data-js="previous" title="Scroll left"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-label="Arrow left"><path d="M50.078 100l8.855-8.84L23.99 56.076h76.1V43.8h-76.1L58.933 8.7 50.078-.148 0 49.93z" fill="#273583"/></svg></button> <button class="btn btn-icon icon-x-small" type="button" data-js="next" title="Scroll right"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" aria-label="Arrow right"><path d="M50.003-.148l-8.855 8.84L76.1 43.775H0v12.286h76.1l-34.942 35.09L50.003 100l50.078-50.078z" fill="#273583"/></svg></button>';
        // Insert the controls before the tabs
        currentTabs.insertAdjacentElement('beforebegin', scrollControl);
        // Add an attribute, so CSS can hide the scrollbar
        currentTabs.setAttribute('data-js', 'active');
      }

      // After we've inserted the scroll control navigation, we need to loop again, so that
      // the DOM is as the following JavaScript expects. Perhaps there's a cleverer way to do
      // this, but, hey, at least it works when there's more than one tabset on the page now.
      for (let i = 0; i < tabset.length; i++) {
        let currentTabs = tabset[i];
        // Set up click events
        let btnPrevious = currentTabs.previousElementSibling.querySelector('[data-js="previous"]');
        let btnNext = currentTabs.previousElementSibling.querySelector('[data-js="next"]');

        btnPrevious.addEventListener('click', this.previousTab, false);
        btnNext.addEventListener('click', this.nextTab, false);

        // Check if we need to show the scroll buttons on all of the tabs we've just created
        this.scrollCheck();
        window.addEventListener('resize', this.scrollCheck);

        // Gets the currently selected tab within view and at worst,
        // on the far right side of the screen (this runs when the
        // tabs in the brand guidelines load).
        let currentTab = this.currentTab(currentTabs);
        let currentTabPos = currentTab.offsetLeft;
        let currentTabWidth = currentTab.offsetWidth;
        let setWidth = currentTabs.clientWidth;
        // Is the current tab scrolled off to the right?
        if (setWidth < (currentTabPos + currentTabWidth)) {
          // Scroll the tabset as far left as required in order to show the right hand edge of the current tab
          currentTabs.scrollLeft = currentTabPos + currentTabWidth - setWidth;
        }

        // Accessibility JavaScript for the pure CSS tabs
        // All the secret, hidden radio buttons which control the tab set
        let tabRadios = document.querySelectorAll('[name="tabs"]');
        let tabPanels = document.querySelectorAll('[role="tabpanel"]');

        for (let i = 0; i < tabRadios.length; i++) {

          // This doesn't seem to trigger on older iOS devices
          tabRadios[i].oninput = function () {
            myFactory.ariaUpdate(this);
          };
          // This does
          tabRadios[i].addEventListener('change', function () {
            myFactory.ariaUpdate(this);
          });

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
              radio1.ariaUpdate(this);
            }
            // User hits the end key, to move to the last tab
            else if (newKey === 'End' || oldKey === 35) {
              e.preventDefault();
              let radioLast = tabRadios.item(tabRadios.length - 1);
              radioLast.focus();
              radioLast.click();
              radioLast.ariaUpdate(this);
            }
          });

          // Custom swipe detection from swipe.js
          tabPanels[i].addEventListener('swiped-left', function () {
            if (i < (tabRadios.length - 1)) {
              let nextRadio = tabRadios[i + 1];
              nextRadio.checked = true;
              myFactory.ariaUpdate(nextRadio);
              //myFactory.currentTab(nextRadio);
              // This breaks iPhone 6
              //nextRadio.dispatchEvent(new Event('input'));
            }
          });
          tabPanels[i].addEventListener('swiped-right', function () {
            if (i > 0) {
              let prevRadio = tabRadios[i - 1];
              prevRadio.checked = true;
              myFactory.ariaUpdate(prevRadio);
              //myFactory.currentTab(prevRadio);
              // This breaks iPhone 6
              //prevRadio.dispatchEvent(new Event('input'));
            }
          });
        }
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
    },
    // Pass this a radio button and it will check that the accompanying label
    // is in view
    myFactory.tabInView = function (radio) {
      let currentTabs = radio.parentElement.querySelector('.tab-set');
      let currentLabel = document.querySelector('[for="' + radio.getAttribute('id') + '"]');
      let currentLabelPos = currentLabel.offsetLeft;
      let currentLabelWidth = currentLabel.offsetWidth;
      let setWidth = currentTabs.clientWidth;

      // console.log("currentLabel: " + currentLabel + "\ncurrentLabelPos: " + currentLabelPos + "\ncurrentLabelWidth: " + currentLabelWidth + "\nsetWidth: " + setWidth);

      // Is the current tab scrolled off to the right?
      if (setWidth < (currentLabelPos + currentLabelWidth)) {
        currentTabs.scrollLeft = setWidth - currentLabelWidth;
      }
      // Is the current tab scrolled off to the left?
      else if (currentTabs.scrollLeft > currentLabelPos) {
        currentTabs.scrollLeft = currentLabelPos;
      }
    },
    // Pass this a radio button and it will update the aria stuff on the whole tabset
    myFactory.ariaUpdate = function (radio) {
      let tabRadios = document.querySelectorAll('input[name="' + radio.getAttribute('name') + '"]');
      let tabPanels = radio.parentElement.querySelectorAll('[role="tabpanel"]');

      for (let i = 0; i < tabRadios.length; i++) {
        // Is this the selected radio button?
        if (tabRadios[i].checked) {
          tabRadios[i].setAttribute('aria-selected', true);
          tabPanels[i].removeAttribute('hidden');
        } else {
          tabRadios[i].setAttribute('aria-selected', false);
          tabPanels[i].setAttribute('hidden', 'hidden');
        }
      }
      myFactory.tabInView(radio);
    }
  return myFactory;
}