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
        const { classes } = this.props;
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