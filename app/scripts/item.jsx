import React from 'react';
import {query} from './query';
import _ from 'lodash';

export class Item extends React.Component {

  update() {
    this.setState({
      dynamoDB: query.dynamoDB,
      data: query.data,
      listing: query.listing
    });
  }

  componentWillMount() {
    query.attachListener(this);
    this.update();
  }

  componentWillUnmount() {
    query.detachListener(this);
  }

  render() {
    console.log(this.state.listing);
    if (!this.state.listing) {
      return null;
    }
    var item = _.get(this.state.listing, 'Item');

    return (
      <div className="row">
        <div className="col-sm-4">
          <img src={item.PictureURL[0]}/>
        </div>
        <div className="col-sm-8">

        </div>
      </div>
    );
  }
}
