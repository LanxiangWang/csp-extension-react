/*global chrome*/
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import SwipeableViews from 'react-swipeable-views';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Zoom from '@material-ui/core/Zoom';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import UpIcon from '@material-ui/icons/KeyboardArrowUp';
import green from '@material-ui/core/colors/green';

import PageControl from './PageControl';
import ResourceControl from './ResourceControl';
import CategoryControl from './CategoryControl';

import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import { stat } from 'fs';

function TabContainer(props) {
  const { children, dir } = props;

  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

const styles = theme => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 450,
    position: 'relative',
    minHeight: 600,
  },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.unit * 2,
    right: theme.spacing.unit * 2,
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
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class FloatingActionButtonZoom extends React.Component {
  constructor(props) {
    super(props);

    this.onFabClick = this.onFabClick.bind(this);
    // this.onChangeImageStatus = this.onChangeImageStatus.bind(this);
    // this.onChangeIframeStatus = this.onChangeIframeStatus.bind(this);

    this.state = {
      value: 0,
      open: false,
    };

    this.bg = chrome.extension.getBackgroundPage();
  }
  
  // onChangeImageStatus(status) {
  //   this.setState({
  //     imageAskStatus: status
  //   })
  // }

  // onChangeIframeStatus(status) {
  //   this.setState({
  //     iframeAskStatus: status
  //   })
  // }

  componentDidMount() {
    const category = this.bg.getControlCategory();
    let newValue = 0;
    switch(category) {
      case 'page':
        newValue = 0;
        break;
      case 'resources':
        newValue = 1;
        break;
      case 'categories':
        newValue = 2;
    }
    this.setState({ value: newValue });
  }

  handleChange = (event, value) => {
    this.setState({ value });
    this.props.onChange(value);

    if (value !== 0) {
      this.sendMessageToContentScript({ action: 'disablePageControl' }, function() {
        console.log('turn off page control');
      });
      if (value === 1) {
        this.bg.changeControlCategory('resources');
      } else {
        this.bg.changeControlCategory('categories');
      }
    } else {
      this.sendMessageToContentScript({ action: 'enablePageControl' }, function() {
        console.log('turn on page control');
      });
      this.bg.changeControlCategory('page');
    }
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  handleClose = () => {
    this.setState({ open: false })
  }

  onFabClick(event) {
	  if (this.state.value === 1) {
      this.setState({
        open: true,
      })
    }
  }

  sendMessageToContentScript(message, callback) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        console.log(tabs[0]);
        chrome.tabs.sendMessage(tabs[0].id, message, callback);
    });
  }

  render() {
    const { classes, theme } = this.props;
    const transitionDuration = {
      enter: theme.transitions.duration.enteringScreen,
      exit: theme.transitions.duration.leavingScreen,
    };

    const fabs = [
      {
        color: 'primary',
        className: classes.fab,
        icon: <AddIcon />,
      },
      {
        color: 'secondary',
        className: classes.fab,
        icon: <EditIcon />,
      },
      {
        color: 'inherit',
        className: classNames(classes.fab, classes.fabGreen),
        icon: <UpIcon />,
      },
    ];

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Page" />
            <Tab label="Resources" />
            <Tab label="Categories" />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
        >
          <TabContainer dir={theme.direction}><PageControl /></TabContainer>
          <TabContainer dir={theme.direction}><ResourceControl /></TabContainer>
          <TabContainer dir={theme.direction}><CategoryControl /></TabContainer>
        </SwipeableViews>
      </div>
    );
  }
}

FloatingActionButtonZoom.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(FloatingActionButtonZoom);