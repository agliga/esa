class Query {
  constructor() {
    this.listeners = [];
    this.keyword = null;
    this.urlFilter = {};
    this.filterArray = [{
        name: 'MaxPrice',
        value: '5000',
        paramName: 'Currency',
        paramValue: 'USD'
      }, {
        name: 'FreeShippingOnly',
        value: 'true',
        paramName: '',
        paramValue: ''
      }, {
        name: 'ListingType',
        value: [
          'AuctionWithBIN', 'FixedPrice', 'StoreInventory'
        ],
        paramName: '',
        paramValue: ''
      }
    ];

  }

  buildURLArray() {
    this.urlFilter = {};

    // Iterate through each filter in the array
    for (var i = 0; i < this.filterArray.length; i++) {
      //Index each item filter in filterarray
      var itemFilter = this.filterArray[i];

      // Iterate through each parameter in each item filter
      for (var index in itemFilter) {
        // Check to see if the paramter has a value (some don't)
        if (itemFilter[index] !== '') {
          if (itemFilter[index]instanceof Array) {
            for (var r = 0; r < itemFilter[index].length; r++) {
              var value = itemFilter[index][r];
              this.urlFilter['itemFilter\(' + i + '\).' + index + '\(' + r + '\)'] = value;
            }
          } else {
            this.urlFilter['itemFilter\(' + i + '\).' + index] = itemFilter[index];
          }
        }
      }
    }
  }

  getMockData() {
    var data = {};
    _.set(data, 'findItemsByKeywordsResponse[0].searchResult[0].item', [
      {
        title: ['Athletic'],
        viewItemURL: [0],
        galleryURL: ['http://i.ebayimg.com/00/s/ODgyWDg4Mg==/z/HUUAAOSwx-9W0vNC/$_26.JPG']
      },
      {
        title: ['Boots'],
        viewItemURL: [1],
        galleryURL: ['http://thumbs.ebaystatic.com/images/g/K9gAAOSwBLlVK~jU/s-l160.jpg']
      },
      {
        title: ['Heels'],
        viewItemURL: [2],
        galleryURL: ['http://thumbs.ebaystatic.com/images/g/U5QAAOSwwE5WZ02T/s-l160.jpg']
      },
      {
        title: ['Flats and Oxfords'],
        viewItemURL: [3],
        galleryURL: ['http://thumbs.ebaystatic.com/images/g/~OQAAOSwEeFVHCJ9/s-l160.jpg']
      },
      {
        title: ['Sandals and Flip Flops'],
        viewItemURL: [4],
        galleryURL: ['http://thumbs.ebaystatic.com/images/m/mcsNOBOpc6suLgo56MMyysw/s-l160.jpg']
      },
      {
        title: ['Occupational'],
        viewItemURL: [5],
        galleryURL: ['http://thumbs.ebaystatic.com/images/g/dYcAAOSwpRRWpXRh/s-l160.jpg']
      }
    ]);
    return data;
  }

  runQuery() {
    $.ajax({
      url: '/query',
      success: (response) => {
        var item = JSON.parse(response);

        this.dynamoDB = item.Item;
        var size = this.dynamoDB.Size ? `size ${this.dynamoDB.Size}` : '';
        this.keywords = '';
        if (this.dynamoDB.St >= 2) {
          this.keywords = `${this.dynamoDB.Gender || ''} ${this.dynamoDB.Tipe || ''} ${this.dynamoDB.Category || ''} ${size}`;
        } else if (this.dynamoDB.St === 1) {
          // Mock data
          this.data = this.getMockData();
          this.header = 'Shop for shoes';
        }

        if (this.keywords) {
          this.runJSONP();
        } else {
          this.triggerUpdate();
        }
      }
    });
  }

  run() {
    this.runQuery();
    setTimeout(() => {
      this.run();
    }, 5000);
  }

  runJSONP() {
    this.buildURLArray();
    console.log(this.urlFilter);
    $.getJSON('http://svcs.ebay.com/services/search/FindingService/v1?callback=?', _.extend({
      'OPERATION-NAME': 'findItemsByKeywords',
      'SERVICE-VERSION': '1.0.0',
      'SECURITY-APPNAME': 'AndrewGl-ebayalex-PRD-15a6394d9-1ee6a642',
      'GLOBAL-ID': 'EBAY-US',
      'RESPONSE-DATA-FORMAT': 'JSON',
      'REST-PAYLOAD': true,
      'keywords': this.keywords,
      'paginationInput.entriesPerPage': 6
    }, this.urlFilter), (response) => {
      this.data = response;
      this.triggerUpdate();
    });
  }

  triggerUpdate() {
    this.listeners.forEach((cb) => {
      cb.update();
    });
  }

  attachListener(callback) {
    this.listeners.push(callback);
  }
  detachListner(callback) {
    this.listeners.splice(this.listeners.indexOf(callback), 1);
  }
}

// Singleton
export var query = new Query();
