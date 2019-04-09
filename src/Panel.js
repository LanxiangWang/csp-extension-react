import React, { Component } from 'react';
import ButtonZoom from './FloatingActionButtonZoom';

class Panel extends Component {
    constructor(props) {
        super(props);

        this.indexChangeHandler = this.indexChangeHandler.bind(this);

        this.state = {
            index: 0
        }
    }

    indexChangeHandler(index) {
        this.setState({
            index,
        })
    }

    render() {
        return (
            <div>
                <ButtonZoom onChange={this.indexChangeHandler}/>


            </div>
        );
    }
}

export default Panel;