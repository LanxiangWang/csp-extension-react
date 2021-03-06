/*global chrome*/
import React, { Component } from 'react';
import ExpansionPanel from './ExpansionPanelResource';
import Dialog from '@material-ui/core/Dialog';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import NotificationIcon from '@material-ui/icons/Notifications';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';
import NotificationList from './NotificationList';
import { stat } from 'fs';


function Transition(props) {
    return <Slide direction="up" {...props} />;
}

const styles = theme => ({
    root: {
      backgroundColor: theme.palette.background.paper,
      width: 420,
      position: 'relative',
      minHeight: 300,
      margin: '10px auto',
    },
    fab: {
      position: 'relative',
      float: 'left',
      left: '85%',
      top: '50%',
    },
    fabGreen: {
      color: theme.palette.common.white,
      backgroundColor: green[500],
      '&:hover': {
        backgroundColor: green[600],
      },
    },
    appBar: {
      position: 'relative',
    },
    flex: {
      flex: 1,
    },
    container: {
        height: '500px',
    },
});

function TabContainer({ children, dir }) {
    return (
      <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
        {children}
      </Typography>
    );
}

class ResourceControl extends Component {
    constructor(props) {
        super(props);

        this.onFabClick = this.onFabClick.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.onImageConfigChange = this.onImageConfigChange.bind(this);
        this.onIframeConfigChange = this.onIframeConfigChange.bind(this);
        this.onCssConfigChange = this.onCssConfigChange.bind(this);
        this.onScriptConfigChange = this.onScriptConfigChange.bind(this);
        this.handleChangeIndex = this.handleChangeIndex.bind(this);
        this.onCheckChange = this.onCheckChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.onBulkUpdate = this.onBulkUpdate.bind(this);

        this.state = {
            open: false,
            imageConfig: 'allow',
            iframeConfig: 'allow',
            cssConfig: 'allow',
            scriptConfig: 'allow',
            index: 0,
            tempImageWhitelist: [],
            tempIframeWhiteList: [],
            tempCssWhiteList: [],
            tempScriptWhiteList: [],
        }

        this.bg = chrome.extension.getBackgroundPage();
    }

    handleClose() {
        this.setState({ 
            open: false,
            tempImageWhitelist: [],
            tempCssWhiteList: [],
            tempIframeWhiteList: [],
            tempScriptWhiteList: [],
        });
    }

    handleSave() {
        this.bg.addToWhiteList('image', this.state.tempImageWhitelist);
        this.bg.addToWhiteList('iframe', this.state.tempIframeWhiteList);
        this.bg.addToWhiteList('stylesheet', this.state.tempCssWhiteList);
        this.bg.addToWhiteList('script', this.state.tempScriptWhiteList);
        this.handleClose();
    }
    
    onFabClick() {
        this.setState({
            open: true,
        })
    }

    onImageConfigChange(status) {
        this.setState({ imageConfig: status });
        this.bg.changeConfig('image', status);
        console.log('panel, image config ', status);
    }

    onIframeConfigChange(status) {
        this.setState({ iframeConfig: status });
        this.bg.changeConfig('iframe', status);
        console.log('panel, iframe config ', status);
    }

    onCssConfigChange(status) {
        console.log('react trys to change config of bg: ', status);
        this.bg.changeConfig('stylesheet', status);
        this.setState({ cssConfig: status });
    }

    onScriptConfigChange(status) {
        this.bg.changeConfig('script', status);
        this.setState({ scriptConfig: status });
    }

    handleChangeIndex(event, value) {
        this.setState({ index: value });
    }

    onCheckChange(type, value, isChecked) {
        let newWhiteList;
        switch(type) {
            case 'image':
                newWhiteList = [...this.state.tempImageWhitelist];
                if (isChecked) {
                    if (!newWhiteList.includes(value)) {
                        newWhiteList.push(value);
                    }
                } else {
                    let index = newWhiteList.indexOf(value);
                    if (index !== -1) {
                        newWhiteList.splice(index, 1);
                    }
                }
                this.setState({ tempImageWhitelist: newWhiteList });
                break;
            case 'stylesheet':
                newWhiteList = [...this.state.tempCssWhiteList];
                if (isChecked) {
                    if (!newWhiteList.includes(value)) {
                        newWhiteList.push(value);
                    }
                } else {
                    let index = newWhiteList.indexOf(value);
                    if (index !== -1) {
                        newWhiteList.splice(index, 1);
                    }
                }
                this.setState({ tempCssWhiteList: newWhiteList });
                break;
            case 'iframe':
                newWhiteList = [...this.state.tempIframeWhiteList];
                if (isChecked) {
                    if (!newWhiteList.includes(value)) {
                        newWhiteList.push(value);
                    }
                } else {
                    let index = newWhiteList.indexOf(value);
                    if (index !== -1) {
                        newWhiteList.splice(index, 1);
                    }
                }
                this.setState({ tempIframeWhiteList: newWhiteList });
                break;
            case 'script':
                newWhiteList = [...this.state.tempScriptWhiteList];
                if (isChecked) {
                    if (!newWhiteList.includes(value)) {
                        newWhiteList.push(value);
                    }
                } else {
                    let index = newWhiteList.indexOf(value);
                    if (index !== -1) {
                        newWhiteList.splice(index, 1);
                    }
                }
                this.setState({ tempScriptWhiteList: newWhiteList });
                break;
        }
    }

    onBulkUpdate(type, list) {
        const newWhiteList = [...list];
        switch(type) {
            case 'image':
                this.setState({ tempImageWhitelist: newWhiteList });
                break;
            case 'stylesheet':
                this.setState({ tempCssWhiteList: newWhiteList });
                break;
            case 'iframe':
                this.setState({ tempIframeWhiteList: newWhiteList });
                break;
            case 'script':
                this.setState({ tempScriptWhiteList: newWhiteList });
                break;
        }
    }

    render() {
        const { classes, theme } = this.props;
        console.log('tempWhiteList: ', this.state.tempImageWhitelist);
        const transitionDuration = {
            enter: theme.transitions.duration.enteringScreen,
            exit: theme.transitions.duration.leavingScreen,
        };

        console.log('resource control display');

        return (
            <div className={classes.container}>
            <ExpansionPanel 
                onImageChange={this.onImageConfigChange} 
                onIframeChange={this.onIframeConfigChange}
                onCssChange={this.onCssConfigChange}
                onScriptChange={this.onScriptConfigChange}
            />

            <Fab className={classes.fab} color='secondary' onClick={this.onFabClick}>
                <NotificationIcon />
            </Fab>

            <Dialog
            fullScreen
            open={this.state.open}
            onClose={this.handleClose}
            TransitionComponent={Transition}
            >
            <AppBar className={classes.appBar}>
                <Toolbar>
                <IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
                    <CloseIcon />
                </IconButton>
                <Typography variant="h6" color="inherit" className={classes.flex}>
                    Notifications
                </Typography>
                <Button color="inherit" onClick={this.handleSave}>
                    save
                </Button>
                </Toolbar>
            </AppBar>

            <div className={classes.root}>
                <AppBar position="static" color="default">
                <Tabs
                    value={this.state.index}
                    onChange={this.handleChangeIndex}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    <Tab label="Images" />
                    <Tab label="Iframes" />
                    <Tab label="Style Sheets" />
                    <Tab label="Scripts" />
                </Tabs>
                </AppBar>
                <SwipeableViews
                axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                index={this.state.index}
                onChangeIndex={this.handleChangeIndex}
                >
                <TabContainer dir={theme.direction}>
                    <NotificationList 
                        type='image'
                        onCheckChange={this.onCheckChange} 
                        onBulkChange={this.onBulkUpdate}
                        blackList={this.bg.getBlackList('image')}/>
                </TabContainer>
                <TabContainer dir={theme.direction}>
                    <NotificationList 
                        type='iframe'
                        onCheckChange={this.onCheckChange} 
                        onBulkChange={this.onBulkUpdate}
                        blackList={this.bg.getBlackList('iframe')}/>
                </TabContainer>
                <TabContainer dir={theme.direction}>
                    <NotificationList 
                        type='stylesheet'
                        onCheckChange={this.onCheckChange} 
                        onBulkChange={this.onBulkUpdate}
                        blackList={this.bg.getBlackList('stylesheet')}/>
                </TabContainer>
                <TabContainer dir={theme.direction}>
                    <NotificationList 
                        type='script'
                        onCheckChange={this.onCheckChange} 
                        onBulkChange={this.onBulkUpdate}
                        blackList={this.bg.getBlackList('script')}/>
                </TabContainer>
                </SwipeableViews>
            </div>

            </Dialog>
            </div>
        )
    }
}

export default withStyles(styles, { withTheme: true })(ResourceControl);