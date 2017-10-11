var Windows = Ractive.extend({
  ver: '0.6.1',
  windowsSubDir: 'subwindow/',
  place: {
    1: '#ractive-windows',
    2:  '#ractive-sub-windows'
  },
  placies: {},
  id: '#ractive-windows-content',
  create: function(template, name){
    var obj = this;
    return new Ractive.Promise(function(fulfil){
      Ractive.addObj(name, {
        el: obj.id,
        template: template,
        data: {}
      });
      Ractive.win = Ractive.getObj('windows');
      Ractive.showWindow = function(name, data, callback, close_callback, place){
        return obj.showWindow(name, data, callback, close_callback, place);
      };
      if(Ractive.DEBUG) console.log('Windows manager created');
      fulfil();
    });
  },
  oninit: function(options){
//        var obj = this;
//        this.on({});

  },
  showWindow: function(name, data, callback, close_callback, place){
    // crate def for arg
    if("number" == typeof callback) {
      place = callback;
      callback = undefined;
    }
    if("number" == typeof close_callback) {
      place = close_callback;
      close_callback = undefined;
    }
    place = ("number" != typeof place) ? 1 : place;
    // save place for this name
    this.placies[name] = place;
    // do show
    this.clearWindows(place);
    this.loadWindow(name).then(function(){
      var win = Ractive.getObj(name);
      if(data) win.set('data', data);
      if(callback) win.callback = callback;
      if(close_callback) win.close_callback = close_callback;
      win.fire('data_set', data);
    })
  },
  loadWindow: function(name){
    return Ractive.requireWin(name);
  },
  loadSubWindow: function(name){
    var src = this.windowsSubDir + name;
    return Ractive.requireWin(src);
  },
  clearWindows: function(num){
    if(Ractive.helper.isRandered(this.place[num])){
      Ractive.getObj(this.place[num]).unrender();
      jQuery('.modal-backdrop').remove();
    }
  },
});