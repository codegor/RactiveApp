var FormUserratinginfo = Ractive.extend({
  class: 'FormUserratinginfo',
  dependencies: {
    components: [
      'form/ratingresults',
      'form/viewdocsimages',
      'form/userportfel',
    ],
  },
  data: function(){
    return {
      id_user: undefined,
      photo: '',
      name: 'no name',
      regDate: '00.00.0000',
      socials: [],
      rate_by_star: { '5': 0, '4': 0, '3': 0, '2': 0, '1': 0 },
      docs: {},
      _e: function(t){
        return _e(t, this.class);
      }
    };
  },
  oninit: function(){
    var obj = this;
    this.on({});
  },
  onrender: function(){},
  oncomplete: function(){},
});
