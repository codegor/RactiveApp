var _Example__Example_element_ = Ractive.extend({//name camelcase!! and first letter is uppercase and consist from name of model+name of element. If element have own elements - name have - ModelElementFolder1ElementFolder2Ele.......
  class: '_Example__Example_element_',
  dependencies: {
    elements: [
    ],
    components: [
    ],
  },
  data: function(){
    return {
//      _example_element_'s data
      _e: function(t){
        return _e(t, this.class);
      },
    };
  },
  oninit: function(options){
    var obj = this;
    this.on({
//      _example_element_'s actions
    });
  },
  onrender: function(){

  },
  oncomplete: function(){
  },
//      _example_element_'s functions
});