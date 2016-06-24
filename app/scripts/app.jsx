import * as React from 'react';
import {render} from 'react-dom';
import {Listings} from './listings';
import {Start} from './start';
import {Item} from './item';
import {query} from './query';
import {Route, Router, IndexRoute, hashHistory} from 'react-router';
import _ from 'lodash';

class Blank extends React.Component {
  render() {
    return null;
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  update() {
    console.log('to update');
    this.setState({
      data: query.data,
      dynamoDB: query.dynamoDB,
      keywords: query.keywords,
      listing: query.getListing()
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
    var state = _.get(this.state.dynamoDB, 'St', -1);
    var header;
    console.log('what is state', state, this.state);
    if (state === '0') {
      header = 'eBay Shopping Assistant';
    } else if (state === '-1') {
      header = '';
    } else if (state === '3') {
      header = _.get(this.state, 'listing.title[0]', '');
    } else {
      header = this.state.keywords || query.header;
    }

    return (
      <div>
        <h1 className="text-center">{header}</h1>
        {this.props.children}
      </div>
    );
  }
}

query.run();

render(
  (
    <Router history={hashHistory}>
      <Route path="/" component={App}>
        <IndexRoute component={Blank}/>
        <Route path="start" component={Start}/>
        <Route path="listings" component={Listings}/>
        <Route path="item" component={Item}/>
      </Route>
    </Router>
  ), document.getElementById('main'));
