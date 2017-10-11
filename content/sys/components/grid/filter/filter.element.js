var GridFilter = Ractive.extend({
  entered_timer: 0,
  changed_run: false,
  data: function(){
    return {
      formatter: function(){}
    }
  },
  oninit: function(options){
    var obj = this;

    this.observe('filter.val', function(){
        obj.fire('entered');
    });

    this.on({
      changed: function(){
        obj.changed_run = true;
      },
      entered: function(){
        clearTimeout(this.entered_timer);
        this.entered_timer = setTimeout(function(){
          if(!obj.changed_run)
            obj.fire('changed');
          obj.changed_run = false;
        }, 350);
      },
    });
  },
});
