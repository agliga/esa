import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import React from 'react';

export class Start extends React.Component {

  constructor(props) {
    super(props);
    this.texts = [
      {
        text: 'ESA, please search for shoes',
        img: 'http://media.bloxi.com/media/uploads/images/370dd954-7116-4643-bb5a-68abde6b125f.jpg'
      },
      {
        text: 'Find me classic cars',
        img: 'http://cdn.images.express.co.uk/img/dynamic/24/590x/Classic-cars-581415.jpg'
      },
      {
        text: 'Search for phones',
        img: 'http://www.ericdresser.com/blog/uploaded_images/pile-o-cellphones-702573.jpg'
      }
    ];
    this.rotate();
  }

  componentWillMount() {
    this.setState({
      current: 0
    });
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  rotate() {
    this.timeout = setTimeout(() => {
      var cur = this.state.current + 1;
      if (cur >= this.texts.length) {
        cur = 0;
      }
      console.log(cur);

      this.setState({
        current: cur
      });
      this.rotate();
    }, 5000);
  }

  render() {
    var objText = this.texts[this.state.current];
    return (
      <div className="start container-fluid">
        <div className="row item-container">
          <div className="col-sm-4 item">
            <img src="images/ESA.png" className="col-sm-12 esa-icon"/>
          </div>
          <div className=" col-sm-4 item">
            <div className="search-text col-sm-11">
            Hello! I am ESA. <br/>How can I help you?
            <div className="bubble-arrow"></div>
            </div>
          </div>
          <div className="col-sm-4 item">
            <ReactCSSTransitionGroup transitionName="transition" transitionEnterTimeout={500} transitionLeaveTimeout={500}>
            <div className="search-phrase" key={this.state.current}>
              <div className="text-search col-sm-12">
                <span className="fa fa-microphone fa-fw"></span> {objText.text}
              </div>
                <img className="col-sm-12 img-search" src={objText.img} />
            </div>
            </ReactCSSTransitionGroup>
          </div>
        </div>
      </div>
    );
  }
}
