let map = new Map();
let originalCspMap = new Map();
let isCheckedMap = new Map();
let imageConfig = 'allow';
let iframeConfig = 'allow';
let controlCategory = 'page';
let blackListImage = [];
let whiteListImage = [];

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


chrome.webRequest.onBeforeSendHeaders.addListener(details => {
    if (controlCategory !== 'resources') {
        return;
    }
    console.log('resources!!!');
    if (details.type === 'image') {
        console.log(details);
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
}, {urls: ["<all_urls>"]}, ["requestHeaders", "extraHeaders", "blocking"]);





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

function findCSPObject(headers) {
    let index = -1;
    headers.map((header, i) => {
        if (header.name === 'content-security-policy') {
            index = i;
        }
    })
    return index;
}

function changeImageConfig(status) {
    imageConfig = status;
}

function getConfigs() {
    return {
        imageConfig,
        iframeConfig,
    }
}

function getControlCategory() {
    return controlCategory;
}

function changeControlCategory(category) {
    controlCategory = category;
}

function getBlackListImage() {
    return blackListImage;
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
            })
    }
}