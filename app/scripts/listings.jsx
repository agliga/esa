import {query} from './query';
import _ from 'lodash';
import React from 'react';

export class Listings extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  update() {
    this.setState({
      data: query.data
    });
  }

  componentWillMount() {
    console.log('comp mount');
    query.attachListener(this);
    this.update();
  }

  componentWillUnmount() {
    console.log('comp un mount');
    query.detachListner(this);
  }

  getData() {
    var items = _.get(this.state, 'data.findItemsByKeywordsResponse[0].searchResult[0].item', []);

    return [items.slice(0, 3), items.slice(3, 6)];
  }

  renderNested(items, offset) {
    return items.map((item, index) => {
      return (
        <div className="listing col-sm-4" key={item.viewItemURL[0]}>
          <div className="row">
            <div className="number-indicator"> <strong>{offset + index + 1}</strong></div>
            <img src={item.galleryURL[0]} className="listing-img col-sm-12"/>
          </div>
          <div className="row text-container">
            <div className="text-field col-sm-12">
               {item.title[0]}
            </div>
          </div>
        </div>
      );
    });
  }

  render() {
    var data = this.getData();

    return (
      <div className="container">
        {
          data.map((item, index) => {
            return (
              <div className="row listing-parent" key={index}>
              {this.renderNested(item, index * 3)}

              </div>
            );
          })
        }
      </div>
    );
  }
}
