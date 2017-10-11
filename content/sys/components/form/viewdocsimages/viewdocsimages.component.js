var FormViewdocsimages = Ractive.extend({
  class: 'FormViewdocsimages',
  data: function(){
    return {
      docs: {},
      name: '',

      social_img: Ractive.pathSys + 'components/form/viewdocsimages/assets/img/',
      docs_img: {
        psprt: 'passport.png',
        other: 'document.gif',
      },
      _e: function(t){
        return _e(t, this.class);
      }
    };
  },
  oninit: function(){
    var obj = this;
    this.on({
      show_docs: function (e) {
        if(Ractive.DEBUG) console.log('Show docs fired');
        var data = {};
        data.name = this.get('name');
        data.img = e.context.img;
        data.img_type = e.context.img_type;
        Ractive.win.loadSubWindow('showImage').then(function(){
          var win = Ractive.getObj('showImage');
          win.set(data);
          if(Ractive.helper.isRandered('showImage'))
            win.unrender();
          win.render('#ractive-window-img-contener');
        });
      },

    });
  },
  onrender: function(){
  },
  oncomplete: function(){
  },
});
