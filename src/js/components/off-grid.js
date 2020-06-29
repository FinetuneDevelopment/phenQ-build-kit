'use strict';

export default function offGrid() {
  let myFactory = {};

  // This gives an element a negative margin which allows it to sit flush with
  // either the right or the left side of the screen, allowing it to be both
  // inside and outside the grid at the same time.
  // Assumption: the element is the same distance from both sides of the screen
  // (originally it was clever than this, but it didn't work)
  myFactory.init = function () {

    window.addEventListener('resize', this.gridMeasure);
    this.gridMeasure();
  },
    myFactory.gridMeasure = function () {
      let offGrids = document.querySelectorAll('[data-offgrid]');

      // Do we have owt to do?
      if (offGrids.length) {

        // Might need to do this more than once.
        for (let i = 0; i < offGrids.length; i++) {
          let currentOffGrid = offGrids[i];
          // 'right' or 'left'
          let direction = currentOffGrid.getAttribute('data-offgrid');
          let leftGutter = currentOffGrid.offsetLeft;

          if (direction === 'left') {
            currentOffGrid.style.marginLeft = -1 * leftGutter + 'px';
          } else if (direction === 'right') {
            currentOffGrid.style.marginRight = -1 * leftGutter + 'px';
          }
        }
      }
    }

  return myFactory;
}
