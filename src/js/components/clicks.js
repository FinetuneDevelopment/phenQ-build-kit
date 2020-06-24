'use strict';

export default function tabFactory() {

  let myFactory = {};

  // Taken from
  // https://gomakethings.com/listening-for-click-events-with-vanilla-javascript/
  myFactory.init = function () {
    document.addEventListener('click', function (event) {

      // If the user isn't clicking inside a tooltip, close all tooltips.
      if (!myFactory.isChild(event.target, 'tooltip')) {
        var tipSet = document.querySelectorAll('.tooltip');
        if (tipSet.length) {
          // Go through every tooltip on the page...
          for (var i = 0; i < tipSet.length; i++) {
            // ... and uncheck the checkbox (or radio button) inside
            tipSet[i].querySelector('input').checked = false;
          }
        }
      }

    }, false);

  },
    // Checking if the passed element is a child of an element which has a class
    // which matches the passed classname.
    myFactory.isChild = function (element, classname) {
      if (
        typeof element.className !== 'object' // SVGs are weird, man.
        &&
        element.className.split(' ').indexOf(classname) >= 0
      ) {
        return true;
      } else if (element.tagName !== 'BODY') { // If you've reached the body, you've gone too far
        return element.parentNode && myFactory.isChild(element.parentNode, classname);
      } else {
        return false;
      }
    }

  return myFactory;
}