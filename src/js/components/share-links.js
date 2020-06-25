'use strict';

export default function formFactory() {
  let myFactory = {};

  myFactory.init = function () {
    let shareWidgetLinks = document.querySelectorAll('[data-js="share-links"] a');
    let thisURL = document.location;
    // At the time of writing, there's stuff added on to the end of the page title string which
    // isn't the current article heading.
    let thisTitle = document.title.split('|')[0].trim();

    if (shareWidgetLinks.length > 0) {
      for (let i = 0; i < shareWidgetLinks.length; i++) {
        let shareLink = shareWidgetLinks[i];
        let shareLinkURL = shareLink.getAttribute('href');

        // Twitter
        if (shareLinkURL === 'https://twitter.com/intent/tweet') {
          shareLink.setAttribute('href', shareLinkURL + '?url=' + encodeURIComponent(thisURL) + '&text=' + encodeURIComponent(thisTitle) + '&via=phen_q');
        }

        // Facebook
        else if (shareLinkURL === 'https://www.facebook.com/sharer/sharer.php') {
          shareLink.setAttribute('href', shareLinkURL + '?u=' + encodeURIComponent(thisURL) + '&title=' + encodeURIComponent(thisTitle));
        }

        // LinkedIn (special guest star)
        else if (shareLinkURL === 'https://www.linkedin.com/sharing/share-offsite/') {
          shareLink.setAttribute('href', shareLinkURL + '?url=' + encodeURIComponent(thisURL));
        }
      }
    }
  }

  return myFactory;
}
