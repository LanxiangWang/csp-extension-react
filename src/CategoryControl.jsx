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
        //this.addSelfWeb = this.addSelfWeb.bind(this);
        this.deleteNewsWeb = this.deleteNewsWeb.bind(this);
        this.deleteShopWeb = this.deleteShopWeb.bind(this);
        //this.deleteSelfWeb = this.deleteSelfWeb.bind(this);
        this.handleCSP = this.handleCSP.bind(this);
        this.handleShopCSP=this.handleShopCSP.bind(this);
        //this.handleSelfCSP=this.handleSelfCSP.bind(this);
        //this.onAppendChild = this.onAppendChild.bind(this);
        //this.onDeleteChild=this.onDeleteChild.bind(this);


        this.state = {
            newsWebsite:[],
            shopWebsite:[],
            selfWebsite:[],
            webInput:'',
            cspInput:'',
            selfInput:'',
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
                var event = document.getElementById("shopWeb").value;
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
                 var event = document.getElementById("shopWeb").value;
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
             //shopCSP
              var csp = document.getElementById("shopCSP").value;
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
          children.push(<ChildComponent key={i} name={tmp[i]} addSelfWeb={this.onAddSelfWeb}
                           deleteSelfWeb={this.onDeleteSelfWeb} handleSelfCSP={this.onHandleSelfCSP} selfWeb={this.state.selfWebsite}/>);
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
                                    <label> Web:<input type="text" id="shopWeb" /></label>
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
                                    <label> Input CSP:<input type="text" id="shopCSP"/></label>
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

             <ParentComponent appendChild={this.onAppendChild} deleteChild={this.onDeleteChild}>
                    {children}
                  </ParentComponent>
            </div>


        );
    }

    onAppendChild = () => {
        console.log("begin append name");
        this.setState({
              numChildren: this.state.numChildren + 1
        });
        var newName = document.getElementById("name").value;
        console.log('newName: ', newName);
        this.setState({
          childName: [...this.state.childName,newName]
        });
        this.bg.addChildList(newName);
    }

    onDeleteChild = () => {
          console.log("begin delete name");
          this.setState({
                   numChildren: this.state.numChildren - 1
         });
          var newName = document.getElementById("name").value;
          this.setState(() => ({
              childName: this.state.childName.filter(el => el != newName)
           }));
          this.bg.delChildList(newName);
      }

    onAddSelfWeb = () => {
           var event = document.getElementById("selfWeb").value;
           this.setState({
               selfWebsite: [event, ...this.state.selfWebsite]
           });
           this.bg.addSelfList(event);
    }

    onDeleteSelfWeb = () => {
            var event = document.getElementById("selfWeb").value;
            this.setState(() => ({
               selfWebsite: this.state.selfWebsite.filter(el => el != event )
            }));
            this.bg.delSelfList(event);
    }

    onHandleSelfCSP = () => {
            console.log("Start to handle csp!");
             //selfCSP
              var csp = document.getElementById("selfCSP").value;
              console.log("csp: ",csp);
              let that = this;

              chrome.tabs.query({
                      active: true,
                      currentWindow: true
                  }, function(tabs) {
                      let url = tabs[0].url;
                      let webList = that.bg.getSelfList()
                      console.log('webList: ', webList);
                      if (webList){
                          for (let i = 0; i < webList.length; i++) {
                              var el = webList[i];
                              if (url.startsWith(el)){
                                   that.bg.setSelfCSP(el,csp);
                                   console.log("modified: ",csp);
                                   console.log("found!");
                              }
                          }
                      }
                  });
    }

    onListWeb = () => {
          console.log("hope it works==========");
          return (this.state.selfWebsite.map((el) => <li>{el}</li>));
    }





}

const ParentComponent = props => (
  <div>
    <div>
        <br />
        <br />
        <label> Give a Name:<input type="text" id="name" /></label>
        <br />
        <br />
    </div>
    <Button variant="contained" onClick={props.appendChild}>
              Add Your Component!
    </Button>

    <Button variant="contained" onClick={props.deleteChild}>
              Delete Your Component!
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
                                                         {props.selfWeb.map((el) => <li>{el}</li> )}
                                                     </ul>
                                                     </div>
                                                     <br />
                                                     <label> Web:<input type="text" id="selfWeb" /></label>
                                                     <br />
                                                     <br />
                                                     <Fab size= "small" onClick={props.addSelfWeb} color="secondary" aria-label="Add" ><AddIcon />
                                                     </Fab>
                                                     <Fab size= "small" onClick={props.deleteSelfWeb} color="secondary" aria-label="Delete"><DelIcon />
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
                                                     <label> Input CSP:<input type="text" id="selfCSP"/></label>
                                                       <Button variant="contained" onClick={props.handleSelfCSP}>
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