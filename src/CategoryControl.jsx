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


const meStyle = {
   color: 'blue',
   width:'80%',
};


class CategoryControl extends Component {
    constructor(props) {
        super(props);

        this.addNewsWeb = this.addNewsWeb.bind(this);
        this.addShopWeb = this.addShopWeb.bind(this);
        this.deleteNewsWeb = this.deleteNewsWeb.bind(this);
        this.deleteShopWeb = this.deleteShopWeb.bind(this);
        this.handleCSP = this.handleCSP.bind(this);
        this.handleShopCSP=this.handleShopCSP.bind(this);

        this.state = {
            newsWebsite:[],
            shopWebsite:[],
            webInput:'',
            cspInput:'',
            numChildren:0,
            childName:[],
        }

        this.bg = chrome.extension.getBackgroundPage();
        console.log('bg is: ', this.bg);
    }

    addNewsWeb(){
            var event = this.state.webInput;
            this.setState({
                newsWebsite: [event, ...this.state.newsWebsite]
            });
            this.bg.addNewsWebList(event);
    }

    addShopWeb(){
                var event = this.state.webInput;
                this.setState({
                    shopWebsite: [event, ...this.state.shopWebsite]
                });
                this.bg.addShopWebList(event);
    }

    deleteNewsWeb(){
             var event = this.state.webInput;
             this.setState(() => ({
                newsWebsite: this.state.newsWebsite.filter(el => el != event )
             }));
             this.bg.delNewsWebList(event);
    }

    deleteShopWeb(){
                 var event = this.state.webInput;
                 this.setState(() => ({
                    shopWebsite: this.state.shopWebsite.filter(el => el != event )
                 }));
                 this.bg.delShopWebList(event);
    }

    handleCSP(){
             console.log("Start to handle csp!");
             var csp = this.state.cspInput;
             console.log("csp: ",csp);
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

    handleShopCSP(){
             console.log("Start to handle csp!");
              var csp = this.state.cspInput;
              console.log("csp: ",csp);
              let that = this;

              chrome.tabs.query({
                      active: true,
                      currentWindow: true
                  }, function(tabs) {
                      let url = tabs[0].url;
                      let webList = that.bg.getShopWebList()
                      console.log('webList: ', webList);
                      if (webList){
                          for (let i = 0; i < webList.length; i++) {
                              var el = webList[i];
                              if (url.startsWith(el)){
                                   that.bg.setShopCSP(el,csp);
                                   console.log("modified: ",csp);
                                   console.log("found!");
                              }
                          }
                      }
                  });
    }






    componentDidMount() {
    }

    render() {
        const children = [];

        var tmp = this.bg.getChildList();
        for (var i = 0; i < this.state.numChildren; i += 1) {
          console.log(tmp[i]);
          children.push(<ChildComponent key={i} name={tmp[i]} />);
        };


        return(
            <div>
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
                                     {this.state.newsWebsite.map((el) => <li>{el}</li> )}
                                </ul>
                                </div>
                                <br />
                                <label> Web:<input type="text" id="web" value={this.state.webInput} onChange={e => this.setState({webInput: e.target.value})}/></label>
                                <br />
                                <br />
                                <Fab size= "small" onClick={this.addNewsWeb} color="secondary" aria-label="Add" ><AddIcon />
                                </Fab>
                                <Fab size= "small" onClick={this.deleteNewsWeb} color="secondary" aria-label="Delete"><DelIcon />
                                </Fab>

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
                                <label> Input CSP:<input type="text" id="cspInput" value={this.state.cspInput} onChange={e => this.setState({cspInput: e.target.value})}/></label>
                                  <Button variant="contained" onClick={this.handleCSP}>
                                          Confirm
                                  </Button>
                              </Typography>
                            </ExpansionPanelDetails>
                          </ExpansionPanel>
                    </div>
                  </Typography>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            </div>

            <div className="shopping">
                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography className="shopping">Shopping</Typography>
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
                                         {this.state.shopWebsite.map((el) => <li>{el}</li> )}
                                    </ul>
                                    </div>
                                    <br />
                                    <label> Web:<input type="text" id="web" value={this.state.webInput} onChange={e => this.setState({webInput: e.target.value})}/></label>
                                    <br />
                                    <br />
                                    <Fab size= "small" onClick={this.addShopWeb} color="secondary" aria-label="Add" ><AddIcon />
                                    </Fab>
                                    <Fab size= "small" onClick={this.deleteShopWeb} color="secondary" aria-label="Delete"><DelIcon />
                                    </Fab>

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
                                    <label> Input CSP:<input type="text" id="cspInput" value={this.state.cspInput} onChange={e => this.setState({cspInput: e.target.value})}/></label>
                                      <Button variant="contained" onClick={this.handleShopCSP}>
                                              Confirm
                                      </Button>
                                  </Typography>
                                </ExpansionPanelDetails>
                              </ExpansionPanel>
                        </div>
                      </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </div>

             <ParentComponent addChild={this.onAddChild} appendChild={this.onAppendChild}>
                    {children}
                  </ParentComponent>
            </div>
        );
    }
    onAddChild = () => {
        this.setState({
          numChildren: this.state.numChildren + 1
        });
    }

    onAppendChild = () => {
        console.log("begin append name");
        var newName = document.getElementById("name").value;
        this.setState({
          childName: [...this.state.childName,newName]
        });
        this.bg.addChildList(newName);
    }
}

const ParentComponent = props => (
  <div className="card calculator">
    <p><a href="#" onClick={props.addChild}>Add Another Child Component</a></p>
    <label> Give a Name:<input type="text" id="name" /></label>
    <Button variant="contained" onClick={props.appendChild}>
              Confirm
    </Button>
    <div id="children-pane">
      {props.children}
    </div>
  </div>
);



const ChildComponent = props => <div>{<ExpansionPanel>
                                     <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                       <Typography >{props.name}</Typography>
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
                                                          {}
                                                     </ul>
                                                     </div>
                                                     <br />
                                                     <label> Web:<input type="text" id="web" /></label>
                                                     <br />
                                                     <br />
                                                     <Fab size= "small" color="secondary" aria-label="Add" ><AddIcon />
                                                     </Fab>
                                                     <Fab size= "small" color="secondary" aria-label="Delete"><DelIcon />
                                                     </Fab>

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
                                                     <label> Input CSP:<input type="text" id="cspInput"/></label>
                                                       <Button variant="contained" >
                                                               Confirm
                                                       </Button>
                                                   </Typography>
                                                 </ExpansionPanelDetails>
                                               </ExpansionPanel>
                                         </div>
                                       </Typography>
                                     </ExpansionPanelDetails>
                                 </ExpansionPanel>}</div>;

export default CategoryControl;