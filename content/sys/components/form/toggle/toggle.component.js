var FormToggle = Ractive.extend({
//    dependencies:{
//        components:[],
//        elements:[],
//    },
    data: function(){
        return {
            position_help:'top',
            help_anim:'fade',
            value: false,
            toggle_id: 'toggle_id',
        };
    },
    oninit: function (options) {
    },
    onrender: function() {
        var self = this;
    },
    oncomplete: function(){
      var obj = this;
      this.observe('value', function(val){
        setTimeout(function(){
          if ( document.getElementById(obj.get('toggle_id')) ) {
            document.getElementById(obj.get('toggle_id')).checked = obj.get('value');
          }
        }, 5);
      });
    },
    selectRadio: function() {
        this.toggle('value');
        this.fire('clicked', this);
    },
});
