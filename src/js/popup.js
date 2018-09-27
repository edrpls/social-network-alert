// popup.js

// Start the popup script, this could be anything from a simple script to a webapp
const initPopupScript = () => {
    // Access the background window object
    // Get list of blocked domains. In this example it comes from a hardcoded array
    // in background.js, but it might as well come from a server request or user input
    const {
        bgMethods: { blockedDomains, getVisitedTimes, setVisitedTimes, resetCounter }
    } = chrome.extension.getBackgroundPage();
    // UL element
    const blockedUl = document.getElementById('blocked');
    // visisted times element
    const visitedSpan = document.getElementById('visited');
    // reset counter button
    const button = document.getElementById('reset');

    // Asks bg for times forbidden sites have been accessed and
    // decides to display the reset button or not
    const readVisitedTimes = () =>
        getVisitedTimes(value => {
            visited.innerText = value;
            if (value) {
                button.style.display = 'block';
            } else {
                button.style.display = 'none';
            }
        });

    // button click listener to reset the counter
    button.onclick = () => resetCounter(readVisitedTimes);
    // Append list of domains to popup
    blockedDomains.forEach(domain => {
        const li = document.createElement('li');
        const content = document.createTextNode(domain);
        // add the text node to the newly created div
        li.appendChild(content);
        blockedUl.appendChild(li);
    });
    // Call readVisitedTimes()
    readVisitedTimes();
};

// Fire scripts after page has loaded
document.addEventListener('DOMContentLoaded', initPopupScript);
