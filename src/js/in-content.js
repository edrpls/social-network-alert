// in-content.js

const imgUrl = chrome.runtime.getURL('mad_cat.jpg');
console.log(imgUrl);
const pageTpl = `
<div style="text-align: center">
    <h1>You shall not pass!</h1>
    <img src="${imgUrl}" alt="Police cat will arrest you" />
</div>
`;

// Extension port to communicate with the popup, also helps detecting when it closes
let port = null;

// Send messages to the open port (Popup)
const sendPortMessage = data => port.postMessage(data);

// Handle incoming popup messages
const popupMessageHandler = message => {
    // Block unwanted pages (after rendering)
    if (message === 'block-site') {
        console.log(document.write(pageTpl));
    }
};

// Start scripts after setting up the connection to popup
chrome.extension.onConnect.addListener(bgPort => {
    // Listen for popup messages
    bgPort.onMessage.addListener(popupMessageHandler);
    // Make popup port accessible to other methods
    port = bgPort;
});
