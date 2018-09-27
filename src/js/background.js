// background.js
const VISITED = 'visitedTimes';
const blockedDomains = ['twitter.com', 'facebook.com'];

// This port enables a long-lived connection to in-content.js
let port = null;

// Send messages to the open port
const sendPortMessage = message => port.postMessage(message);

// Find the current active tab
const getTab = () =>
    new Promise(resolve => {
        chrome.tabs.query(
            {
                active: true,
                currentWindow: true
            },
            tabs => resolve(tabs[0])
        );
    });

// Listen for changes on the active tab and sends a message to the content
// when it should block the page from rendering
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        const tabUrl = tab.url;
        const blockDomain = blockedDomains.some(d => tabUrl.includes(d));
        if (blockDomain) {
            setVisitedTimes();
            // Find the current active tab, then open a port to it
            getTab().then(tab => {
                // Connects to tab port to enable communication with inContent.js
                port = chrome.tabs.connect(tab.id, { name: 'chrome-extension-template' });
                sendPortMessage('block-site');
            });
        }
    }
});

// Store how many times the user visited a forbidden site
const setVisitedTimes = callback => {
    getVisitedTimes((old = 0) => {
        const value = old + 1;
        chrome.storage.local.set({ [VISITED]: value }, callback);
    });
};

// Get from the store how many times the user visited a forbidden site
const getVisitedTimes = callback => {
    chrome.storage.local.get(VISITED, store => {
        callback(store[VISITED] || 0);
    });
};

// Reset the forbidden sites counter
const resetCounter = callback => {
    chrome.storage.local.set({ [VISITED]: 0 }, callback);
};

// Make variables accessible from chrome.extension.getBackgroundPage()
window.bgMethods = {
    blockedDomains,
    setVisitedTimes,
    getVisitedTimes,
    resetCounter
};
