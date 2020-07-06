'use strict';

export default function blankFactory() {
  let myFactory = {};

  // This fixes the target="_blank" vunribility. Sorry for the annoying filename.
  myFactory.init = function () {
    // That old target="_blank" security fix
    // dev.to/ben/the-targetblank-vulnerability-by-example
    let blanks = document.querySelectorAll('[target="_blank"]');

    if (blanks.length) {
      for (let i = 0; i < blanks.length; i++) {
        let thisLink = blanks[i];
        let thisRel = thisLink.getAttribute('rel');

        // We have a valid rel attribute
        if (thisRel) {
          if (thisRel.indexOf('noopener') === -1) {
            thisRel += ' noopener';
            thisLink.setAttribute('rel', thisRel);
          }
          if (thisRel.indexOf('noreferrer') === -1) {
            thisRel += ' noreferrer';
            thisLink.setAttribute('rel', thisRel);
          }
        }
        // We dont' have a rel attribute
        else {
          thisLink.setAttribute('rel', 'noopener noreferrer');
        }
      }
    }

    // OK, this doesn't really belong in this file, but it's so wee, it's not
    // worth creating a file for it.
    if (document.body) {
      document.body.classList.add('js');
    }
  }

  return myFactory;
}
