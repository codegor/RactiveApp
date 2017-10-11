var FormUserportfel = Ractive.extend({
  class: 'FormUserportfel',
  dependencies: {
    elements: [
      'form/userportfel/progressbar',
    ],
  },
  data: function(){
    return {
      icons: { portfel: true },
      base_img_path: Ractive.pathSys + 'components/form/userportfel/assets/img/',
      img_names: {
        portfel: 'portfel.png',
      },

      id_user: undefined,   // or "123456789"
      show_portfel: false,
      portfolio: undefined, // or { issued: {}, borrowed: {} },
      isMyBankZero: true,
      isDataShown: false,

      titles: {
        issued: _e('Issued', this.class),
        borrowed: _e('Borrowed', this.class),
      },
      arbitrageTitles: {
        issued: _e('Demands', this.class),
        borrowed: _e('Microloans', this.class),
      },

      formatData: function (str, digits) {
        var num = parseFloat(str);
        return (isNaN(num) ? '' : num.toFixed(digits));
      },
      _e: function(t){
        return _e(t, this.class);
      },
    };
  },
  oninit: function(){
    var obj = this;

    this.observe('id_user', function (newValue, oldValue) {
      if (newValue) this.fire('init_data');
    });

    this.on({
      toggle_show_data: function (e) {
        this.toggle('isDataShown');
      },

      init_data: function () {
        //Ractive.getObj('app').fire('showLoader');
        var obj = this;
        var req = {
          request: JSON.stringify({
            portfolioData: {
              select: {
                // comments: [],
                user_info: [
                  // 'target_user_id',
                  // 'rate_by_star',
                  //'rate',
                  'user_data', // { user_data: { order_id: '117391715' } },
                ]
              },
              from: 'User_rating',
              where: { target_user_id: obj.get('id_user') }
            },
          }),
        };
        Ractive.apiRequest('Api', req, 'POST').then(
          function (a) {
            if (Ractive.DEBUG) console.log('profile-portfolio = %o', a);
            if (typeof a.portfolioData === 'string') {
              Ractive.app.alert(a.portfolioData, 'danger');
            }

            if (a.portfolioData && typeof a.portfolioData === 'object') {
              var res = a.portfolioData.user_info.user_data.portfolio;
              if (res) {
                res.issued.arbitrage = res.issued.demand;
                res.borrowed.arbitrage = res.borrowed.microloan;
                obj.set({
                  show_portfel: true,
                  portfolio: res,
                  isMyBankZero: (res.issued.my.total_sum === 0 && res.borrowed.my.total_sum === 0),
                });
              }
            }
            //setTimeout(function(){Ractive.getObj('app').fire('hideLoader');}, 0);
          },
          function () {
            //setTimeout(function(){Ractive.getObj('app').fire('hideLoader');}, 0);
          }
        );
      }, // end of "init_data: function(){..."
    });
  },
  onrender: function(){},
  oncomplete: function(){
    if (this.get('id_user')) {
      this.fire('init_data');
    }
  },
  onunrender: function(){
    this.set({
      id_user: undefined,
      show_portfel: false,
      isDataShown: false,
    });
  },
});
