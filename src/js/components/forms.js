'use strict';

export default function formFactory() {
    let myFactory = {};

    myFactory.init = function () {

        // This attempts to make all input elements only as wide as their contents.
        // Unfortunately, due to preportional fonts, this approach does not work.
        var inputs = document.querySelectorAll('input');
        // Do we have owt to do?
        if (inputs.length) {
            for (var i = 0; i < inputs.length; i++) {
                var myInput = inputs[i],
                    stringLength;
                // Does this input already have a value?
                if (myInput.value !== '') {
                    stringLength = myInput.value.length; 
                    myInput.style.width = stringLength + 'ch';
                } else if (myInput.getAttribute('placeholder')) {
                    stringLength = myInput.getAttribute('placeholder').length; 
                    myInput.style.width = stringLength + 'ch';
                }
            }
        }
    }

    return myFactory;
}
