'use strict';

// This updates the aria-expanded attribute and gives users the amazing
// ability to DESELECT radio buttons, once they've selected them. The
// functional parts of the FAQ are handled by CSS, because I'm peverse.
export default function faqFactory() {
  let myFactory = {},
    labels = document.querySelectorAll('label[data-js="label-toggle"]');

  myFactory.init = function () {
    // Do we have owt to do?
    if (labels.length) {

      this.expandedStatus();
      // Might need to do this more than once.
      for (let i = 0; i < labels.length; i++) {
        let myLabel = labels[i];
        let thisRadio = document.getElementById(myLabel.getAttribute('for'));

        myLabel.addEventListener('click', myFactory.deselectRadio, true);

        // Changes the aria-expanded status of the label, if the radio button
        // changes for any reason
        thisRadio.addEventListener('change', myFactory.expandedStatus, true);
      }
    }

  },
    // Deselects the associated radio button, if required
    myFactory.deselectRadio = function (e) {
      console.log("deselectRadio run");
      let thisRadio = document.getElementById(this.getAttribute('for'));
      if (thisRadio.checked === true) {
        thisRadio.checked = false;
        e.preventDefault();
      }
    },
    // Sets up the aria-expanded attribute for the tabs
    myFactory.expandedStatus = function () {
      if (labels.length) {
        for (let i = 0; i < labels.length; i++) {
          let myLabel = labels[i],
            myId = myLabel.getAttribute('for'),
            thisRadio = document.getElementById(myId);

          if (thisRadio.checked === true) {
            myLabel.setAttribute('aria-expanded', true);
            // Scrolls the page to this position
            // (required as the FAQs on the privacy policy page were LOOOOOOOOOOOOOOONG)
            myLabel.scrollIntoView(true);
          } else {
            myLabel.setAttribute('aria-expanded', false);
          }
          myLabel.setAttribute('aria-controls', myId);
        }
      }
    }

  return myFactory;
}
