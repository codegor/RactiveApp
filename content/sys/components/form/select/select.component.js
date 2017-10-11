var FormSelect = Ractive.extend({
  class: 'FormSelect',
//    dependencies:{
//        components:[],
//        elements:[],
//    },
  data: function(){
    return {
      nothing_string: _e('Not selected', this.class),
      nothing_val: 0,
      position_help: 'top',
      help_anim: 'fade',
      unclear_key: Ractive.helper.unclear_key,
      _e: function(t){
        return _e(t, this.class);
      }
    };
  },
  oninit: function(options){

  },
  onrender: function(){

  },
  oncomplete: function(){
  },
});