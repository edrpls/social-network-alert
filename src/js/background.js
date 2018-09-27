// background.js
const VISITED = 'visitedTimes';
const blockedDomains = ['twitter.com', 'facebook.com', 'instagram.com'];

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

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log(changeInfo.status);
    if (changeInfo.status === 'loading') {
        const tabUrl = tab.url;
        const blockDomain = blockedDomains.some(d => tabUrl.includes(d));
        if (blockDomain) {
            setVisitedTimes(console.log);
            // Find the current active tab, then open a port to it
            getTab().then(tab => {
                // Connects to tab port to enable communication with inContent.js
                port = chrome.tabs.connect(tab.id, { name: 'chrome-extension-template' });
                sendPortMessage('block-site');
            });
        }
    }
});

const setVisitedTimes = callback => {
    getVisitedTimes((old = 0) => {
        const value = old + 1;
        chrome.storage.local.set({ [VISITED]: value }, callback);
    });
};

const getVisitedTimes = callback => {
    chrome.storage.local.get(VISITED, store => {
        callback(store[VISITED] || 0);
    });
};

getVisitedTimes(console.log);

// Make variables accessible from chrome.extension.getBackgroundPage()
window.blockedDomains = blockedDomains;
window.setVisitedTimes = setVisitedTimes;
window.getVisitedTimes = getVisitedTimes;
