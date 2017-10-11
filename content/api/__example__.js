var __Example__ = new (ApiModel.extend({
  api: '__Example__',
  format: function (data) {
    var obj = this;
    return new Ractive.Promise(function(fulfil){
      fulfil(data);
    });
  },
  formatters: {
  },
  computed:{
  },
  // other function for this model

}));
