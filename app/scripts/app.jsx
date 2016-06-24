import * as React from 'react';
import { render } from 'react-dom';
import { Listings } from './listings';
import { Start } from './start';
import { query } from './query';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
  }

  update() {
    console.log('to update');
    this.setState({
      data: query.data,
      dynamoDB: query.dynamoDB,
      keywords: query.keywords
    });
  }
  componentWillMount() {
    query.attachListener(this);
  }

  componentWillUnmount() {
    query.detachListner(this);
  }

  getHeader() {

  }

  render() {
    var ComponentToShow = null,
      state = _.get(this.state.dynamoDB, 'St', -1),
      header;
      console.log('what is state', state, this.state);
    if (state === 0) {
      ComponentToShow = Start;
      header = 'eBay Shopping Assistant';
    } else if (state === -1) {
      return null;
    } else {
      ComponentToShow = Listings;
      header = this.state.keywords;
    }
    
    return (
      <div>
        <h1 className="text-center">{header}</h1>
        <ComponentToShow/>
      </div>
    );
  }
}

query.run();

render(
  <App query={query}/>, document.getElementById('main'));
