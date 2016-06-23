import { query } from './query';

export class Listings extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      data: null
    }
  }

  update() {
    this.setState({
      data: query.data
    })
  }

  componentWillMount() {
    console.log('comp mount');
    query.attachListener(this);
  }

  componentWillUnmount() {
    console.log('comp un mount');
    query.detachListner(this);
  }

  renderNested() {
    var items = _.get(this.state, 'data.findItemsByKeywordsResponse[0].searchResult[0].item', []);
    console.log(items);
    return items.map(item => {
      return (
        <div className="listing col-sm-4" key={item.itemId[0]}>
          <div className="row">
            <img src={item.galleryURL[0]} className="listing-img col-sm-12"/>
          </div>
          <div className="row text-container">
            <div className="text-field col-sm-12">{item.title[0]}</div>
          </div>
        </div>
      );
    });
  }

  render() {
    return (
      <div className="listing-parent container">
        {this.renderNested()}
      </div>
    );
  }
}
