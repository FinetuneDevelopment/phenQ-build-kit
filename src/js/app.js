'use strict';

import '../scss/app.scss';

import tabFactory from './components/tabs.js';
const myTabs = new tabFactory();
myTabs.init();
window.addEventListener('resize', myTabs.scrollCheck);

//import formFactory from './components/forms.js';
//const myForm = new formFactory();
//myForm.init();