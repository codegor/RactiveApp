var FormWploadimg = Ractive.extend({
  class: 'FormWploadimg',
//    dependencies:{
//        components:[],
//        elements:[],
//    },
  data: function(){
    return {
      position_help: 'top',
      help_anim: 'fade',
      w: 115,
      h: 90,
      button: _e('Load', this.class),
      _e: function(t){
        return _e(t, this.class);
      }
    };
  },
  computed: {
    src: function(){
      var v = this.get('value');
      if(v){
        return v;
      } else{
        return this.get('default');
      }
    },
    default: function(){
      return _r + "img/def_" + this.get('form_name') + ".png";
    },
  },
  oninit: function(options){
    var obj = this;
    this.on({
      load: function(){
        wp.media.editor.send.attachment = function(props, attachment){
          obj.set('value', attachment.url);
        }
        wp.media.editor.open(obj);
      },
      reset_def: function(){
        if(true == confirm("Conferm?")){
          obj.set('value', '');
        }
      },
    });
  },
});