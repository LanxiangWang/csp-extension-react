/*global chrome*/

import React, { Component } from 'react';
import SimpleExpansionPanel from './ExpansionPanel';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import DelIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
  fab: {
      position: 'absolute',
      bottom:0,
      right:0,
  },
  me: {
      width: '80%',
      overflow: 'auto',
      fontSize: '14px'
  },

});

const meStyle = {
   color: 'blue',
   width:'80%',
}


class CategoryControl extends Component {
    constructor(props) {
        super(props);

        this.processCSPHelper = this.processCSPHelper.bind(this);
        this.getCSPFromHeaders = this.getCSPFromHeaders.bind(this);
        this.addWeb = this.addWeb.bind(this);
        this.deleteWeb = this.deleteWeb.bind(this);
        this.handleCSP = this.handleCSP.bind(this);

        this.state = {
            originalDirectiveMap: new Map(),
            modifiedDirectiveMap: new Map(),
            url: '',
            website:[],
        }

        this.bg = chrome.extension.getBackgroundPage();
        console.log('bg is: ', this.bg);
    }

    addWeb(){
            var event = document.getElementById("web").value
            this.setState({
                website: [event, ...this.state.website]
            });
            this.bg.addNewsWebList(event);
    }

    deleteWeb(){
             var event = document.getElementById("web").value
             this.setState(() => ({
                    website: this.state.website.filter(el => el != event )
             }));
             this.bg.delNewsWebList(event);
    }

    handleCSP(){
             var csp = document.getElementById("cspInput").value
             let that = this;

             chrome.tabs.query({
                     active: true,
                     currentWindow: true
                 }, function(tabs) {
                     let url = tabs[0].url;
                     let webList = that.bg.getNewsWebList()
                     console.log('webList: ', webList);
                     if (webList){
                         for (let i = 0; i < webList.length; i++) {
                             var el = webList[i];
                             if (url.startsWith(el)){
                                  that.bg.setCatCSP(el,csp);
                                  console.log("modified: ",csp);
                                  console.log("found!");
                             }
                         }
                     }
                 });

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
            <div className="news">
            <ExpansionPanel>
                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                  <Typography className="news">News</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                  <Typography>
                                    <div>

                                        <ExpansionPanel style={meStyle}>
                                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                                  <Typography>Websites List</Typography>
                                                </ExpansionPanelSummary>
                                                <ExpansionPanelDetails>
                                                  <Typography>
                                                    <div>
                                                    <ul>
                                                         {this.state.website.map((el) => <li>{el}</li> )}
                                                    </ul>
                                                    </div>
                                                    <Fab onClick={this.addWeb} color="secondary" aria-label="Add" ><AddIcon />
                                                    </Fab>

                                                    <Fab onClick={this.deleteWeb} color="secondary" aria-label="Delete"><DelIcon />
                                                    </Fab>
                                                    <label> Web:<input type="text" id="web"/></label>
                                                  </Typography>
                                                </ExpansionPanelDetails>
                                              </ExpansionPanel>
                                    </div>
                                    <div>


                                    <ExpansionPanel  style={meStyle}>
                                                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                                  <Typography>CSP configuration</Typography>

                                                </ExpansionPanelSummary>
                                                <ExpansionPanelDetails>
                                                  <Typography>
                                                    <div style={meStyle}>
                                                        <label> Input CSP:<input type="text" id="cspInput"/></label>
                                                          <Button variant="contained" onClick={this.handleCSP}>
                                                                  Confirm
                                                          </Button>
                                                    </div>
                                                  </Typography>
                                                </ExpansionPanelDetails>
                                              </ExpansionPanel>
                                    </div>
                                  </Typography>
                                </ExpansionPanelDetails>
            </ExpansionPanel>

            </div>

        )
    }
}

export default CategoryControl;