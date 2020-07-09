'use strict';

export default function tipFactory() {
  let myFactory = {};

  // Keeps the aria attributes up-to-date, after the CSS has done its magic.
  myFactory.init = function () {

    if (document.querySelectorAll('.tooltip')) {
      const toolTips = document.querySelectorAll('[data-js="tooltip"]');

      // Loops through all the tooltips on the page
      for (let i = 0; i < toolTips.length; i++) {
        let thisTip = toolTips[i];
        let thisToggle = thisTip.querySelector('input[type="checkbox"]');
        let thisDetails = thisTip.querySelector('.details');
        let thisID = thisToggle.getAttribute('id');

        thisDetails.setAttribute('id', thisID + '-details');
        thisToggle.setAttribute('aria-controls', thisID + '-details');

        // A non-exhastive list of items which might receive focus
        let tipFocus = toolTips[i].querySelectorAll('.details input, .details a, .details button');
        myFactory.ariaUpdate(thisTip);
        // If the checkbox changes for whatever reason, updagte the aria markup
        thisToggle.addEventListener('change', function () {
          myFactory.ariaUpdate(thisTip);
        });

        // Loop through all the items which might receive focus
        for (let i = 0; i < tipFocus.length; i++) {
          // Show the tooltip, if the item falls into focus
          tipFocus[i].addEventListener('focus', function () {
            let focusIn = new Event('change');
            thisToggle.checked = true;
            thisToggle.dispatchEvent(focusIn);
          }, true);
          // Hide the tooltip if it falls out of focus
          tipFocus[i].addEventListener('blur', function () {
            let focusOut = new Event('change');
            thisToggle.checked = false;
            thisToggle.dispatchEvent(focusOut);
          }, true);
        }
      }
    }

  },
    // Updates aria attributes on the hidden checkbox
    myFactory.ariaUpdate = function (currentTip) {
      let tipToggle = currentTip.querySelector('input[type="checkbox"]');

      // Is the navigation bar visible?
      if (tipToggle.checked) {
        tipToggle.setAttribute('aria-expanded', 'true');
      } else {
        tipToggle.setAttribute('aria-expanded', 'false');
      }
    }

  return myFactory;
}
