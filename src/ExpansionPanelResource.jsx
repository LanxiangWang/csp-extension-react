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
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';

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
  },
  myLabel: {
      marginLeft: '25%',
      width: '300px',
  }
});


class SimpleExpansionPanel extends React.Component {
    constructor(props) {
        super(props);

        this.onImageConfigChange = this.onImageConfigChange.bind(this);
        this.onIframeConfigChange = this.onIframeConfigChange.bind(this);
        this.onCssConfigChange = this.onCssConfigChange.bind(this);
        this.onScriptConfigChange = this.onScriptConfigChange.bind(this);

        this.state = {
            imageConfig: 'allow',
            iframeConfig: 'allow',
            cssConfig: 'allow',
            scriptConfig: 'allow',
        }

        this.bg = chrome.extension.getBackgroundPage();
    }

    componentDidMount() {
        const { imageConfig, iframeConfig } = this.bg.getConfigs();
        this.setState({
            imageConfig,
            iframeConfig,
        });
    }

    onImageConfigChange(event) {
        const config = event.target.value;
        this.setState({
            imageConfig: config,
        });
        this.props.onImageChange(config);
    }

    onIframeConfigChange(event) {
        const config = event.target.value;
        this.setState({
            iframeConfig: config,
        });
        this.props.onIframeChange(config);
    }

    onCssConfigChange(event) {
        const config = event.target.value;
        this.setState({
            cssConfig: config,
        });
        // this.props.onCssChange(config);
    }

    onScriptConfigChange(event) {
        const config = event.target.value;
        this.setState({
            scriptConfig: config,
        });
        // this.props.onScriptChange(config);
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <div className={classes.root}>
                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>Images</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Typography>
                            <RadioGroup
                                name='imageConfig'
                                className={classes.group}
                                value={this.state.imageConfig}
                                onChange={this.onImageConfigChange}
                            >
                                <FormControlLabel
                                    value='disable'
                                    control={
                                        <Radio color='primary' />
                                    }
                                    label='disable all images'
                                    className={classes.myLabel}
                                />
                                <FormControlLabel
                                    value='allow'
                                    control={
                                        <Radio color='primary' />
                                    }
                                    label='allow all images'
                                    className={classes.myLabel}
                                />
                                <FormControlLabel
                                    value='ask'
                                    control={
                                        <Radio color='primary' />
                                    }
                                    label='ask me to select'
                                    className={classes.myLabel}
                                />
                            </RadioGroup>
                        </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>

                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>iFrames</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Typography>
                                <RadioGroup
                                    name='iframeConfig'
                                    className={classes.group}
                                    value={this.state.iframeConfig}
                                    onChange={this.onIframeConfigChange}
                                >
                                    <FormControlLabel
                                        value='disable'
                                        control={
                                            <Radio color='primary' />
                                        }
                                        label='disable all iframes'
                                        className={classes.myLabel}
                                    />
                                    <FormControlLabel
                                        value='allow'
                                        control={
                                            <Radio color='primary' />
                                        }
                                        label='allow all iframes'
                                        className={classes.myLabel}
                                    />
                                    <FormControlLabel
                                        value='ask'
                                        control={
                                            <Radio color='primary' />
                                        }
                                        label='ask me to select'
                                        className={classes.myLabel}
                                    />
                                </RadioGroup>
                            </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>

                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>Style Sheets</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Typography>
                                <RadioGroup
                                    name='cssConfig'
                                    className={classes.group}
                                    value={this.state.cssConfig}
                                    onChange={this.onCssConfigChange}
                                >
                                    <FormControlLabel
                                        value='disable'
                                        control={
                                            <Radio color='primary' />
                                        }
                                        label='disable all css files'
                                        className={classes.myLabel}
                                    />
                                    <FormControlLabel
                                        value='allow'
                                        control={
                                            <Radio color='primary' />
                                        }
                                        label='allow all css files'
                                        className={classes.myLabel}
                                    />
                                    <FormControlLabel
                                        value='ask'
                                        control={
                                            <Radio color='primary' />
                                        }
                                        label='ask me to select'
                                        className={classes.myLabel}
                                    />
                                </RadioGroup>
                            </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>

                <ExpansionPanel>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography className={classes.heading}>Scripts</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Typography>
                                <RadioGroup
                                    name='iframeConfig'
                                    className={classes.group}
                                    value={this.state.scriptConfig}
                                    onChange={this.onScriptConfigChange}
                                >
                                    <FormControlLabel
                                        value='disable'
                                        control={
                                            <Radio color='primary' />
                                        }
                                        label='disable all scripts'
                                        className={classes.myLabel}
                                    />
                                    <FormControlLabel
                                        value='allow'
                                        control={
                                            <Radio color='primary' />
                                        }
                                        label='allow all scripts'
                                        className={classes.myLabel}
                                    />
                                    <FormControlLabel
                                        value='ask'
                                        control={
                                            <Radio color='primary' />
                                        }
                                        label='ask me to select'
                                        className={classes.myLabel}
                                    />
                                </RadioGroup>
                            </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                </div>
            </div>
            
        );
    }
  
}

SimpleExpansionPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleExpansionPanel);