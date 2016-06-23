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

  run() {
    $.ajax({
      url: '/query',
      success: (response) => {
        var item = JSON.parse(response);
        this.keywords = item.Item.SearchString || item.Item.Category;
        this.runJSONP();
      }
    });

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
      this.listeners.forEach((cb) => {
        cb.update();
      });
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
