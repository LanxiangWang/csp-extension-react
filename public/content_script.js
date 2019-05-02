let hasCSPMeta = false;
let cspDirectives = '';
let isPageControl = true;
let shouldStop = localStorage.getItem('stopStatus') || 'true';

console.log('get stopStatus from local storage: ', shouldStop);
console.log('add listener');
chrome.runtime.onMessage.addListener(function(req, sender, sendResponse) {
    console.log('contentScript receives message: ', req);
    if (req.action === 'getCSPMeta') {
        if (hasCSPMeta) {
            sendResponse({
                containsCSP: true,
                directives: cspDirectives
            });
        } else {
            sendResponse({
                containsCSP: false,
                directives: cspDirectives
            });
        }
    }

    if (req.action === 'changeStopStatus') {
        localStorage.setItem('stopStatus', false);
    }

    if (req.action === 'refresh') {
        location.reload();
    }

    if (req.action === 'disablePageControl') {
        isPageControl = false;
    }

    if (req.action === 'enablePageControl') {
        isPageControl = true;
    }
});


window.onload = function() {
    chrome.storage.local.get(['isPageControl'], function (res) {
        console.log('***, ', res);
        let isPageOn = res['isPageControl'];
        if (isPageOn) {
            console.log('this is page control');
            let cspMeta = $('meta[http-equiv="Content-Security-Policy"')[0];
            if (cspMeta) {
                hasCSPMeta = true;
                cspDirectives = cspMeta.content;
            }
    
            if (shouldStop === 'true') {
                injectLoadingPage();
            }
        }
    })
};

function injectLoadingPage() {
    console.log('prepare to inject');
    let body = document.createElement('body');
    body.setAttribute('class', 'loading_body');
    let pic = document.createElement('img');
    pic.src = chrome.runtime.getURL('csp_default_page.png');
    pic.setAttribute('class', 'my_image');
    body.appendChild(pic);
    let html = document.getElementsByTagName('html')[0];
    let oldBody = document.getElementsByTagName('body')[0];
    html.removeChild(oldBody);
    html.appendChild(body);
}