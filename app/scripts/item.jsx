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

  getItem(url, index) {
    return (
      <div className="col-sm-4 item" key={index}>
      <img className="images" src={url}/>
      </div>
    )

  }

  render() {
    console.log(this.state.listing);
    if (!this.state.listing) {
      return null;
    }
    var item = _.get(this.state.listing, 'Item');

    return (
      <div className="row view-item">
        {item.PictureURL.map(this.getItem)}
      </div>
    );
  }
}
