var FormTransactionslist = Ractive.extend({
  class: 'FormTransactionslist',
  data: function(){
    return {
      transactions_list: [{
        checked: true,
        id: '000000000',
        account: 'CARD **** 0000 (0)',
        summa: '0',
        percent: '0.00',
        profit: '0.00',
        name: 'Dummy Dummy',
        opened: false,
      }],
      id_icon_style: app_helper.getTestimonialIcon(),

      _e: function(t){
        return _e(t, this.class);
      }
    };
  },
  oninit: function(){
    var obj = this;
    this.on({
      toggle_show_details: function (event, index) {
        this.toggle('transactions_list[' + index + '].opened');
        return false;
      },
    });
  },
  onrender: function(){
  },
  oncomplete: function(){
  },
  transitions: {
    fade: function (t, params) {
      var DEFAULTS = {
        delay: 0,
        duration: 300,
        easing: 'linear',
      };
      params = t.processParams(params, DEFAULTS);

      var targetOpacity;
      if (t.isIntro) {
        targetOpacity = t.getStyle('opacity');
        t.setStyle('opacity', 0);
      } else {
        targetOpacity = 0;
      }
      t.animateStyle('opacity', targetOpacity, params).then(t.complete);
    },
  },
});
