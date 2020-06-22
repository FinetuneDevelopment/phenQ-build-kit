'use strict';

import '../scss/app.scss';

import tabFactory from './components/tabs.js';
const myTabs = new tabFactory();
myTabs.init();
window.addEventListener('resize', myTabs.scrollCheck);

import blockScroll from './components/block-scroll.js';
const myBlockScroll = new blockScroll();
myBlockScroll.init();
//window.addEventListener('resize', myBlockScroll.scrollCheck);
