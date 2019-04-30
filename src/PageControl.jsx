/*global chrome*/

import React, { Component } from 'react';
import ExpansionPanel from './ExpansionPanel';

class PageControl extends Component {
    constructor(props) {
        super(props);

        this.processCSPHelper = this.processCSPHelper.bind(this);
        this.getCSPFromHeaders = this.getCSPFromHeaders.bind(this);

        this.state = {
            originalDirectiveMap: new Map(),
            modifiedDirectiveMap: new Map(),
            url: '',
        }

        this.bg = chrome.extension.getBackgroundPage();
        console.log('bg is: ', this.bg);
    }

    componentDidMount() {
        Promise.all([this.getCSPFromHeaders()]).then(values => {
            let directives = values[0];
            console.log('directives: ', directives);
            this.processCSP(directives);
            // displayCSP();
        });
    }

    getCSPFromDOM() {
        let toReturnPromise = new Promise((resolve, reject) => {
            this.sendMessageToContentScript({action: 'getCSPMeta'}, function(result) {
                if (result.containsCSP) {
                    resolve(result.directives);
                } else {
                    resolve('');
                }
            });
        });
        return toReturnPromise;
    }

    getCSPFromHeaders() {
        let that = this;
        let toReturnPromise = new Promise((resolve, reject) => {
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, function(tabs) {
                let url = tabs[0].url;
                let headers = that.bg.getCSPHeader(url);
                that.setState({
                    url: url
                })
                resolve(headers);
            }); 
        });
        return toReturnPromise;
    }

    processCSP(directives) {
        this.processCSPHelper(directives.original, true);
        this.processCSPHelper(directives.modified, false);
    }

    processCSPHelper(directives, isOriginalMap) {
        let map = null;
        if (isOriginalMap) {
            map = new Map(this.state.originalDirectiveMap);
        } else {
            map = new Map(this.state.modifiedDirectiveMap);
        }
        let directivesAry = directives.split(';');
        directivesAry.map(directive => {
            if (directive != '') {
                directive = directive.trim();
                let cutIndex = directive.indexOf(' ');
                let name = directive.substring(0, cutIndex);
                let value = directive.substring(cutIndex + 1);
                let directiveArray = value.split(' ');
                map.set(name, directiveArray);
            }
        });

        this.setState(prevState => {
            if (isOriginalMap) {
                return {
                    originalDirectiveMap: map
                }
            } else {
                return {
                    modifiedDirectiveMap: map
                }
            }
        });
    }

    render() {
        
        return(
            <div>
                <ExpansionPanel 
                originalDirectives={this.state.originalDirectiveMap}
                modifiedDirectives={this.state.modifiedDirectiveMap}
                url={this.state.url}
                />
            </div>
        )
    }
}

export default PageControl;