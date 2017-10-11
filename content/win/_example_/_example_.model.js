var _Example_ = Ractive.extend({//name camelcase!! and first letter is uppercase
  id: '#ractive-window-_example_',
  type: 'window',
  class: '_Example_',
  create: function(template, name){
    var obj = this;
    return new Ractive.Promise(function(fulfil){
      Ractive.addObj(name, {
        el: Ractive.win.place[Ractive.win.placies[name]],
        template: template,
        data: {
//                    _example_ 's data
          _e: function(t){
            return _e(t, obj.class);
          }
        }
      });
      if(Ractive.DEBUG)
       console.log('_example_ window loaded');
      fulfil();
    });
  },
  oninit: function(){
    this.on({
      saved: function(){
        // your some code
        this.send();
      },
      //_example_ 's actions
    });
    this.on('data_set', function(d){

    });
    this.onhidejqevent();
  },
  oncomplete: function(){
    this.show();
  },
  show: function(){
    jQuery(this.id).modal('show');
  },
  send: function(){
    jQuery(this.id).modal('hide');
    this.callback();
    this.reset();
  },
  reset: function(){
    this.set({
        data: {},
//                _example_'s reset data on close
    });
    this.close_callback = function(){};
    this.callback = function(){};
    console.log('_example_ window closed!');
  },
  close_callback: function(){

  },
  onhidejqevent: function(){
    var obj = this;
    jQuery('html').on("hidden.bs.modal", this.id, function(){
      obj.close_callback();
      obj.reset();
    });
  },
});