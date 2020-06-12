function tabFactory() {
    // https://itnext.io/different-ways-to-achieve-encapsulation-in-javascript-es6-7cb938e83f2d
    //this.name = 'Sonic';
    this.init = function () {
        var tabset = document.querySelectorAll('.tab-set');
        // Do we have owt to do?
        if (tabset.length) {
            // Might need to do this more than once.
            for (var i = 0; i < tabset.length; i++) {
                // Tab scroll controls
                var scrollControl = document.createElement('p'),
                    currentTabs = tabset[i];

                scrollControl.classList.add('scroll-control','hidden');
                scrollControl.setAttribute('data-js', 'scroll-control');
                // Need some SVGs here, eventually.
                scrollControl.innerHTML = '<button class="btn btn-icon" type="button" data-js="previous" title="Select previous tab"><span class="shape sh-arrow-left-round"><span class="sr-only">Scroll tabs left</span></span></button> <button class="btn btn-icon" type="button" data-js="next" title="Select next tab"><span class="shape sh-arrow-right-round"><span class="sr-only">Scroll tabs right</span></span></button>';
                // Insert the controls into the tabs
                currentTabs.insertBefore(scrollControl, currentTabs.firstChild);
                // Add an attribute, so CSS can hide the scrollbar
                currentTabs.setAttribute('data-js', 'active');
                // Check if we need to show the scroll buttons or not
                this.scrollCheck();
                // Set up click events
                var btnPrevious = currentTabs.querySelector('[data-js="previous"]'),
                    btnNext = currentTabs.querySelector('[data-js="next"]');
                
                btnPrevious.addEventListener('click', this.previousTab,false);
                btnNext.addEventListener('click', this.nextTab,false);
            }
        }
    },
    // This function searches the DOM for tabsets and shows or hides the
    // scroll buttons, as required.
    this.scrollCheck = function () {
        var tabset = document.querySelectorAll('.tab-set');
        if (tabset.length) {
            for (var i = 0; i < tabset.length; i++) {
                var nav = tabset[i].querySelectorAll('[data-js="scroll-control"]');
                // If the element has a scroll bar
                if ((tabset[i].scrollWidth > tabset[i].clientWidth)) {
                    nav[0].classList.remove('hidden');
                } else {
                    nav[0].classList.add('hidden');
                }
            }
        }
    },
    // User has clicked on the (<-) button
    this.previousTab = function (e) {
        var tabset = e.target.closest('.tab-set'),
            selectedTab;
        
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
        // Scroll to the left the width of the currently selected tab
        tabset.scroll((selectedTab.clientWidth * -1), 0);
        // Click on the tab to the left of the current tab, if it exists
        if (selectedTab.previousElementSibling) {
            selectedTab.previousElementSibling.querySelector('a').click();
        }
    },
    // User has clicked on the (->) button
    this.nextTab = function (e) {
        var tabset = e.target.closest('.tab-set'),
            selectedTab;
        
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
        // Scroll to the left the width of the currently selected tab
        tabset.scroll(selectedTab.clientWidth, 0);
        // Click on the tab to the left of the current tab, if it exists
        if (selectedTab.nextElementSibling) {
            selectedTab.nextElementSibling.querySelector('a').click();
        }
    }
}
 
const myTabs = new tabFactory();
myTabs.init();
window.addEventListener('resize', myTabs.scrollCheck);
 
//console.log(myTabs.name) //valid value
//console.log(myTabs.speed) // undefined