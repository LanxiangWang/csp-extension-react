import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Checkbox from '@material-ui/core/Checkbox';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  root: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  button: {
    margin: theme.spacing.unit,
  },
  myContainer: {
    display: 'flex',
    justifyContent: 'center',
  }
});

class NotificationList extends React.Component {
    constructor(props) {
        super(props);

        this.onSelectAll = this.onSelectAll.bind(this);
        this.onRemoveAll = this.onRemoveAll.bind(this);

        this.state = {
            checked: [],
        }
    }

    handleToggle = value => () => {
        const { checked } = this.state;
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
            this.props.onCheckChange(this.props.type, value, true);
        } else {
            newChecked.splice(currentIndex, 1);
            this.props.onCheckChange(this.props.type, value, false);
        }

        this.setState({
            checked: newChecked,
        });
    };

    onSelectAll() {
        const { blackList, onBulkChange, type } = this.props;
        this.setState({ checked: blackList });
        onBulkChange(type, blackList);
    }

    onRemoveAll() {
        const { onBulkChange, type } = this.props;
        this.setState({ checked: [] });
        onBulkChange(type, []);
    }

    render() {
        const { classes, blackList } = this.props;

        return (
            <div>
                <div className={classes.myContainer}>
                    <Button variant="contained" color="primary" 
                        className={classes.button} onClick={this.onSelectAll}>
                        Select All
                    </Button>
                    <Button variant="contained" color="secondary" 
                        className={classes.button} onClick={this.onRemoveAll}>
                        Remove All
                    </Button>
                </div>
                
                <List dense className={classes.root}>
                    {blackList.map(value => (
                    <ListItem key={value} button>
                        <ListItemText primary={value} />
                        <ListItemSecondaryAction>
                        <Checkbox
                            onChange={this.handleToggle(value)}
                            checked={this.state.checked.indexOf(value) !== -1}
                        />
                        </ListItemSecondaryAction>
                    </ListItem>
                    ))}
                </List>
            </div>
            
        );
    }
}

NotificationList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(NotificationList);