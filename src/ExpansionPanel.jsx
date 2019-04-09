/*global chrome*/
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  myButton: {
      marginLeft: '40%',
      marginTop: '20px',
  }
});


class SimpleExpansionPanel extends React.Component {
    constructor(props) {
        super(props);

        this.onCheckChange = this.onCheckChange.bind(this);
        this.onSaveOnClick = this.onSaveOnClick.bind(this);

        this.state = {
            originalCSP: new Map(),
            modifiedCSP: new Map(),
        }

        this.bg = chrome.extension.getBackgroundPage();
    }

    static getDerivedStateFromProps(props, state) {
        if (props.originalDirectives.size !== 0 && state.originalCSP.size === 0) {
            return {
                originalCSP: props.originalDirectives
            }
        }

        if (props.modifiedDirectives.size !== 0 && state.modifiedCSP.size === 0) {
            return {
                modifiedCSP: props.modifiedDirectives
            }
        }
    }

    onCheckChange(event, checked) {
        let [name, value] = event.target.value.split('-magicword-');
        let valueArray = this.state.modifiedCSP.get(name);
        if (!checked) {
            let index = valueArray.indexOf(value);
            if (index > -1) {
                valueArray.splice(index, 1);
            }
        } else {
            valueArray.push(value);
        }

        this.setState(prevState => {
            let newDirectives = new Map(this.state.modifiedCSP);
            newDirectives.set(name, valueArray);

            return {
                modifiedCSP: newDirectives
            }
        })
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

    onSaveOnClick() {
        const { url } = this.props;
        if (!url) {
            console.log('URL missing!');
            return;
        }

        console.log('this.bg: ', this.bg);

        this.bg.checkUrl(url);

        this.bg.modifyCSP(url, this.toString(this.state.modifiedCSP));

        this.sendMessageToContentScript({action: 'changeStopStatus'}, function() {
            console.log('stop status has been changed');
        });
    
        this.sendMessageToContentScript({action: 'refresh'}, function() {
            console.log('refresh current page');
        })
    }

    toString(map) {
        let res = "";
        map.forEach((value, key, map) => {
            console.log('key is: ', key, ' and value is: ', value);
            res += key;
            value.map(each => {
                res += " " + each;
            });
            res += " ;";
        });

        console.log('toString: ', res);
        return res;
    }

    render() {
        console.log('state: ', this.state);
        console.log('props: ', this.props);
        const { classes, originalDirectives, modifiedDirectives } = this.props;
        let panelArray = [];
        originalDirectives.forEach((value, key) => {
            let valueAry = originalDirectives.get(key);
            let checkBoxAry = [];
            let modifiedAry = this.state.modifiedCSP.get(key) || [];
            valueAry.map(each => {
                checkBoxAry.push(
                    <FormControlLabel
                        control={
                            <Checkbox
                            checked={modifiedAry.includes(each)}
                            onChange={this.onCheckChange}
                            value={`${key}-magicword-${each}`}
                            color='primary'
                            />
                        }
                        label={each}
                    />
                )
            })

            panelArray.push(
                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>{key}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Typography>
                            { checkBoxAry }
                        </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            )
        });

        return (
            <div>
                <div className={classes.root}>
                { panelArray }
                </div>

                <Button 
                variant="contained" 
                color="primary" 
                className={classes.button} className={classes.myButton}
                onClick={this.onSaveOnClick}
                >
                Save
                </Button>
            </div>
            
        );
    }
  
}

SimpleExpansionPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleExpansionPanel);