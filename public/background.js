let map = new Map();
let originalCspMap = new Map();
let isCheckedMap = new Map();
let imageConfig = 'allow';
let iframeConfig = 'allow';
let cssConfig = 'allow';
let scriptConfig = 'allow';
let controlCategory = 'page';
let blackListImage = [];
let whiteListImage = [];
let blackListCss = [];
let whiteListCss = [];
let blackListScript = [];
let whiteListScript = [];
let blackListIframe = [];
let whiteListIframe = [];
let newsWebList = [];
let catMap = new Map();

chrome.webRequest.onHeadersReceived.addListener(details => {
    if (controlCategory !== 'page') {
        return;
    }
    console.log('page!!!');
    if (details.type === 'main_frame') {
        let headers = details.responseHeaders;
        let url = details.url;

        
        if (!isCheckedMap.get(url)) {
            headers.map(header => {
                if (header.name === 'content-security-policy') {
                    originalCspMap.set(url, header.value);
                    // console.log(url, ' contains CSP: ', header.value);
                }
            })

            let toAdded = {
                name: 'content-security-policy',
                value: "default-src 'none';"
            }
            details.responseHeaders.push(toAdded);
    
            // console.log(url, ' added csp, ', details.responseHeaders);
    
            return { responseHeaders: details.responseHeaders };
        } else {
            let index = findCSPObject(details.responseHeaders);
            // console.log('use modified csp: ', map.get(url), 'and index is: ', index);
            if (index === -1) {
                details.responseHeaders.push({
                    name: 'content-security-policy',
                    value: map.get(url)
                });
            } else {
                details.responseHeaders[index] = {
                    name: 'content-security-policy',
                    value: map.get(url)
                }
            }
            // console.log('responseHeaders: ', details.responseHeaders);
            return { responseHeaders: details.responseHeaders };
        }
    }
}, {urls: ["<all_urls>"]}, ["responseHeaders", "extraHeaders", "blocking"]);

// this is for resources
chrome.webRequest.onBeforeSendHeaders.addListener(details => {
    if (controlCategory !== 'resources') {
        return;
    }
    // console.log(details);
    if (details.type === 'image') {
        switch(imageConfig) {
            case 'allow':
                break;
            case 'disable':
                console.log('this should be disabled');
                return { cancel: true };
            case 'ask':
                const url = details.url;
                if (whiteListImage.includes(url)) {
                    break;
                } else {
                    if (!blackListImage.includes(url)) {
                        blackListImage.push(url);
                    }
                    
                    return { cancel: true };
                }
                
        }
    }

    if (details.type === 'stylesheet') {
        switch(cssConfig) {
            case 'allow':
                break;
            case 'disable':
                console.log('CSS is disabled');
                return { cancel: true };
            case 'ask':
                const url = details.url;
                if (whiteListCss.includes(url)) {
                    break;
                } else {
                    if (!blackListCss.includes(url)) {
                        blackListCss.push(url);
                    }

                    return { cancel: true };
                }
        }
    }

    if (details.type === 'script') {
        switch(scriptConfig) {
            case 'allow':
                break;
            case 'disable':
                console.log('Script is disabled');
                return { cancel: true };
            case 'ask':
                const url = details.url;
                if (whiteListScript.includes(url)) {
                    break;
                } else {
                    if (!blackListScript.includes(url)) {
                        blackListScript.push(url);
                    }

                    return { cancel: true };
                }
        }
    }

    if (details.type === 'iframe') {
        switch(cssConfig) {
            case 'allow':
                break;
            case 'disable':
                console.log('CSS is disabled');
                return { cancel: true };
            case 'ask':
                const url = details.url;
                if (whiteListIframe.includes(url)) {
                    break;
                } else {
                    if (!blackListIframe.includes(url)) {
                        blackListIframe.push(url);
                    }

                    return { cancel: true };
                }
        }
    }

}, {urls: ["<all_urls>"]}, ["requestHeaders", "extraHeaders", "blocking"]);

chrome.webRequest.onHeadersReceived.addListener(details => {
    if (controlCategory !== 'categories') {
        return;
    }
    console.log('categories!!!');
    if (details.type === 'main_frame') {

        

        let headers = details.responseHeaders;
        console.log('******headers: ', headers);
        let url = details.url;

        
        
        let index = findCSPObject(details.responseHeaders);

        console.log('*****index: ', index);

        console.log('policy', getCatCSP(url))

        // if (!getCatCSP(url)){
        //     return;
        // } 

        if (index === -1) {
            details.responseHeaders.push({
                name: 'content-security-policy',
                value: getCatCSP(url)
            });
        } else {
            details.responseHeaders[index] = {
                name: 'content-security-policy',
                value: getCatCSP(url)
            }
        }
        console.log("headers:, ",{ responseHeaders: details.responseHeaders });
        return { responseHeaders: details.responseHeaders };
        
    }
}, {urls: ["<all_urls>"]}, ["responseHeaders", "extraHeaders", "blocking"]);





function getCSPHeader(url) {
    return {
        original: originalCspMap.get(url) || '',
        modified: map.get(url) || originalCspMap.get(url) || ''
    }
}

function checkUrl(url) {
    isCheckedMap.set(url, true);
}

function modifyCSP(url, modifiedCSP) {
    map.set(url, modifiedCSP);
    console.log('modified: ', map);
}

function getNewsWebList(){
    return newsWebList;
}
function addNewsWebList(website){
    newsWebList.push(website);
}

function delNewsWebList(website){
    newsWebList = newsWebList.filter(el => el != website);
}

function getCatCSP(url) {
    console.log("start getting");
    
    let keys =[ ...catMap.keys() ];
    for (let i = 0; i < keys.length; i++) {
        if (url.startsWith(keys[i])){
            return catMap.get(keys[i]);
        }
        console.log("looping");
    }

    return null;
}

function setCatCSP(url, modifiedCSP){
    catMap.set(url,modifiedCSP);
    console.log('modified: ', catMap);
}

function findCSPObject(headers) {
    let index = -1;
    headers.map((header, i) => {
        if (header.name === 'content-security-policy') {
            index = i;
        }
    })
    return index;
}

function changeConfig(type, status) {
    switch(type) {
        case 'image':
            imageConfig = status;
            break;
        case 'iframe':
            iframeConfig = status;
            break;
        case 'stylesheet':
            cssConfig = status;
            console.log('styleSheet config has been changed to: ', status);
            break;
        case 'script':
            scriptConfig = status;
            break;
        default:
            break;
    }
    
}

function getConfigs() {
    return {
        imageConfig,
        iframeConfig,
        cssConfig,
        scriptConfig
    }
}

function getControlCategory() {
    return controlCategory;
}

function changeControlCategory(category) {
    controlCategory = category;
}

function getBlackList(type) {
    switch(type) {
        case 'image':
            return blackListImage;
        case 'iframe':
            return blackListIframe;
        case 'stylesheet':
            return blackListCss;
        case 'script':
            return blackListScript;
    }
}

function addToWhiteList(type, list) {
    switch(type) {
        case 'image':
            list.map(value => {
                if (!whiteListImage.includes(value)) {
                    whiteListImage.push(value);
                    let index = blackListImage.indexOf(value);
                    blackListImage.splice(index, 1);
                }
            });
            break;
        case 'iframe':
            list.map(value => {
                if (!whiteListIframe.includes(value)) {
                    whiteListIframe.push(value);
                    let index = blackListIframe.indexOf(value);
                    blackListIframe.splice(index, 1);
                }
            });
            break;
        case 'stylesheet':
            list.map(value => {
                if (!whiteListCss.includes(value)) {
                    whiteListCss.push(value);
                    let index = blackListCss.indexOf(value);
                    blackListCss.splice(index, 1);
                }
            });
            break;
        case 'script':
            list.map(value => {
                if (!whiteListScript.includes(value)) {
                    whiteListScript.push(value);
                    let index = blackListScript.indexOf(value);
                    blackListScript.splice(index, 1);
                }
            });
            break;
    }
}