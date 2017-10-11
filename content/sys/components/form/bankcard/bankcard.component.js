var FormBankcard = Ractive.extend({
  class: 'FormBankcard',
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
      exp_label: _e('Expire', this.class),
      card_num: _e('Number', this.class),
      exp_placeholder: 'MM-YY',
      num_placeholder: 'xxxx',
      _e: function(t){
        return _e(t, this.class);
      }
    };
  },
  oninit: function(options){

  },
});