import * as React from 'react';
import { render } from 'react-dom';
import { Listings } from './listings';
import { query } from './query';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  render() {
    return (
      <Listings/>
    );
  }
}

query.run();

render(
  <App query={query}/>, document.getElementById('main'));
