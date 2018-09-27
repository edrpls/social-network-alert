// in-content.js

// Extension port to communicate with the popup, also helps detecting when it closes
let port = null;

// Send messages to the open port (Popup)
const sendPortMessage = data => port.postMessage(data);

// Handle incoming popup messages
const popupMessageHandler = message => {
    if (message === 'block-site') {
        console.log('rewrite stuff here');
        console.log(document.write('<div>You shall not pass!</div>'));
    }
};

// Start scripts after setting up the connection to popup
chrome.extension.onConnect.addListener(bgPort => {
    // Listen for popup messages
    bgPort.onMessage.addListener(popupMessageHandler);
    // Make popup port accessible to other methods
    port = bgPort;
});
