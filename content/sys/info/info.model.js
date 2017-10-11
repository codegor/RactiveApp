var Info = Ractive.extend({
  id: '#ractive-info',
  class: 'Info',
  create: function(template, name){
    var obj = this;
    return new Ractive.Promise(function(fulfil){
      var paralel = {
        cnt: 0,
        afterlast: function(){
          Ractive.addObj(name, {
            el: obj.id,
            template: template,
            data: {
              datetime: moment().utcOffset("00:00"),
              moment: moment,
              info: {
                issued:   {name: _e('Issued', obj.class),     val: 0, ed: {text: '$', position: 'first'}},
                borrowed: {name: _e('Borrowed', obj.class),   val: 0, ed: {text: '$', position: 'first'}},
                money:    {name: _e('My Cards', obj.class),   val: 0, ed: {text: '$', position: 'first'}},
                guarantee:{name: _e('Guarantees', obj.class), val: 0, ed: {text: '$', position: 'first'}},
                peoples:  {name: _e('Affiliates', obj.class), val: 0, val_u: 0, ed: {text: '$', position: 'first'}, ed_u: {text: _e('users', this.class), position: 'last'}},
              },
              user_info: {},
              getInt: function(v){
                return Ractive.helper.getInt(v);
              },
              getDecimal: function(v){
                var res = Ractive.helper.getDecimal(v)*100;
                res = res.toFixed();
                if(0 == res)
                  res = '00';
                if(1 == (res+'').length)
                  res = '0'+res;
                return res;
              },
              last_request_info: '',

              showBannersDebug: false,
              demand_percent: '0.00',
              demand_percent_paysys_perfectmoney: '0.00',
              demand_percent_paysys_payeer: '0.00',
              demand_percent_paysys_okpay: '0.00',
              guarant_percent: '0.00',
              guarant_percent_paysys_perfectmoney: '0.00',
              guarant_percent_paysys_payeer: '0.00',
              guarant_percent_paysys_okpay: '0.00',
              show_banners: false,
              banners: [],
              isLess992: false,
              serverUtcMinutesDiff: 0, // diff between server time and UTC in minutes

              _e: function(t){
                return _e(t, obj.class);
              }
            }
          });
          fulfil();
        }
      };
      Ractive.requireSysElement('info/clock', paralel);
      if(Ractive.DEBUG) console.log('Info created');
      fulfil();
    });
  },
  oninit: function(options){
    this.on({
      action_peoples: function(){
        Ractive.app.go('partners');
      },
      action_guarantee: function(){
        Ractive.app.go('all_orders', {'order-list>cols.df_type.filter.val': 'guarantee', 'order-list>cols.state.filter.val': 'active'});
      },
      action_money: function(){
        Ractive.app.go('cards');
      },
      action_borrowed: function(){
        Ractive.app.go('all_orders', {'order-list>cols.df_type.filter.val': 'borrowed', 'order-list>cols.state.filter.val': 'active'});
      },
      action_issued: function(){
        Ractive.app.go('all_orders', {'order-list>cols.df_type.filter.val': 'issued', 'order-list>cols.state.filter.val': 'active'});
      },
      info_update: function(){
//        Ractive.app.getUserInfo();
      }
    })
  },
  initApi: function(){
    var obj = this;
    Ractive.apiField('invests', function(field){obj.set('info.issued.val', field);});
    Ractive.apiField('credits', function(field){obj.set('info.borrowed.val', field);});
    Ractive.apiField('cards_money', function(field){obj.set('info.money.val', field);});
    Ractive.apiField('guarantee', function(field){obj.set('info.guarantee.val', field);});
    Ractive.apiField('myChildren', function(field){obj.set('info.peoples.val_u', field);});
    Ractive.apiField('soon', function(field){obj.set('info.peoples.val', field);});

    Ractive.apiField.fields([
      'demand_percent',
      'demand_percent_paysys_perfectmoney',
      'demand_percent_paysys_payeer',
      'demand_percent_paysys_okpay',
      'guarant_percent',
      'guarant_percent_paysys_perfectmoney',
      'guarant_percent_paysys_payeer',
      'guarant_percent_paysys_okpay',
      'serverUtcTimeDiff', // it is in hours
    ],
    function (fields) {
      var demand_percent = parseFloat(fields.demand_percent) || 0.0;
      var demand_percent_paysys_perfectmoney = parseFloat(fields.demand_percent_paysys_perfectmoney) || 0.0;
      var demand_percent_paysys_payeer = parseFloat(fields.demand_percent_paysys_payeer) || 0.0;
      var demand_percent_paysys_okpay = parseFloat(fields.demand_percent_paysys_okpay) || 0.0;
      var guarant_percent = parseFloat(fields.guarant_percent) || 0.0;
      var guarant_percent_paysys_perfectmoney = parseFloat(fields.guarant_percent_paysys_perfectmoney) || 0.0;
      var guarant_percent_paysys_payeer = parseFloat(fields.guarant_percent_paysys_payeer) || 0.0;
      var guarant_percent_paysys_okpay = parseFloat(fields.guarant_percent_paysys_okpay) || 0.0;
      var serverUtcMinutesDiff = fields.serverUtcTimeDiff * (-60) || 0;

      obj.set({
        demand_percent: obj.formatData(demand_percent, 2),
        demand_percent_paysys_perfectmoney: obj.formatData(demand_percent_paysys_perfectmoney, 2),
        demand_percent_paysys_payeer: obj.formatData(demand_percent_paysys_payeer, 2),
        demand_percent_paysys_okpay: obj.formatData(demand_percent_paysys_okpay, 2),
        guarant_percent: obj.formatData(guarant_percent, 2),
        guarant_percent_paysys_perfectmoney: obj.formatData(guarant_percent_paysys_perfectmoney, 2),
        guarant_percent_paysys_payeer: obj.formatData(guarant_percent_paysys_payeer, 2),
        guarant_percent_paysys_okpay: obj.formatData(guarant_percent_paysys_okpay, 2),
        serverUtcMinutesDiff: serverUtcMinutesDiff,
      });
    });
  },
  oncomplete: function(){
    window.addEventListener('resize', this.resizeHandler.bind(this));
    this.resizeHandler();

    var obj = this;
    setInterval(function(){
      // obj.set('datetime', moment().utcOffset("00:00"));
      obj.set('datetime', moment().utcOffset(obj.get('serverUtcMinutesDiff')));
    }, 1000);
    this.initApi();

    //setTimeout(function(){
    //  obj.set('showBannersDebug', !(window.SHOW_BANNERS_KOTIROVKI_DEBUG === false));
    //}, 1000);
    obj.set('show_banners', (SHOW_BANNERS === 'true'));

    var cur_lang = _e('lang');
    var any_banners = [];
    var cur_lang_banners = [];
    var banners = [];

    try {
      var bnrs = JSON.parse(BANNERS_LIST);
      if (bnrs['any']) {
        for (var k = 0, len = bnrs['any'].length; k < len; k++) {
          if (bnrs['any'][k].url !== '') {
            any_banners.push( bnrs['any'][k].url );
          }
        }
      }

      if (!bnrs[cur_lang] || bnrs[cur_lang].length === 0) {
        banners = any_banners;
      } else {
        for (var k = 0, len = bnrs[cur_lang].length; k < len; k++) {
          if (bnrs[cur_lang][k].url.indexOf('use_any_version') !== -1) {
            if (any_banners[k]) {
              cur_lang_banners.push( any_banners[k] );
            } else {
              continue;
            }
          } else if (bnrs[cur_lang][k].url.indexOf('no_banner_here') !== -1) {
            continue;
          } else if (bnrs[cur_lang][k].url !== '') {
            cur_lang_banners.push( bnrs[cur_lang][k].url );
          }
        }

        if (any_banners.length > bnrs[cur_lang].length) {
          var langLen = bnrs[cur_lang].length;
          var anyLen = any_banners.length;
          for (var k = langLen; k < anyLen; k++) {
            cur_lang_banners.push( any_banners[k] );
          }
        }

        banners = cur_lang_banners;
      }

    } catch (e) {
      console.error('Cannot read a list of banners');
    }

    obj.set('banners', banners);
  },
  onteardown: function () {
    window.removeEventListener('resize', this.resizeHandler.bind(this));
  },

  resizeHandler: function () {
    this.set('isLess992', (window.innerWidth < 992 ? true : false));
  },
  formatData: function (num, digits) {
    return (num === 0 ? '0.00' : num.toFixed(digits));
  },
});
