// popup.js

// Start the popup script, this could be anything from a simple script to a webapp
const initPopupScript = () => {
    // Access the background window object
    // Get list of blocked domains. In this example it comes from a hardcoded array
    // in background.js, but it might as well come from a server request or user input
    const {
        blockedDomains,
        getVisitedTimes,
        setVisitedTimes
    } = chrome.extension.getBackgroundPage();
    const blockedUl = document.getElementById('blocked');
    const visitedSpan = document.getElementById('visited');
    // Append list of domains to popup
    blockedDomains.forEach(domain => {
        const li = document.createElement('li');
        const content = document.createTextNode(domain);
        // add the text node to the newly created div
        li.appendChild(content);
        blockedUl.appendChild(li);
    });

    getVisitedTimes(value => {
        console.log(value);
        visited.innerText = value;
    });
};

// Fire scripts after page has loaded
document.addEventListener('DOMContentLoaded', initPopupScript);
