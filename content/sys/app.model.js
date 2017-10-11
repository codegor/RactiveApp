var AppBase = Ractive.extend({
  class: 'App',
  loader_id: '#ractive-loading',
  loader_count: 0,
  ver: '0.7.2',
  id: '#main',
  alert_id: '#ractive-alert-content',
  sys_mess_shown: false,
  update_callback: false,
  forward: false,
  loader: {},
  create: function(template, name){
    var obj = this;
    return new Ractive.Promise(function(fulfil){
      Ractive.addObj(name, {
        el: obj.id,
        template: template,
        data: {}
      });
      Ractive.app = Ractive.getObj('app');
      obj.loader = new Ractive.components.loader();
      if(Ractive.DEBUG)
        console.log('App created');
      fulfil();
    });
  },
  oninit: function(options){
    this.on({
      menu: function(){
        Ractive.requireSysPart('menu');
      },
      windows: function(){
        Ractive.requireSysPart('windows');
      },
      showLoader: function(){
        if(0 >= this.loader_count){
          this.showLoader();
          this.loader_count = 0;
        }
        this.loader_count++;
      },
      hideLoader: function(){
        this.loader_count--;
        if(0 >= this.loader_count){
          this.hideLoader();
          this.loader_count = 0;
        }
      }
    });
  },
  oncomplete: function(){
    this.fire('menu');
    this.fire('windows');
    this.setHistoryEvent();
  },
  showLoader: function(){
    jQuery('.modal-backdrop').remove();
    jQuery(this.loader_id).modal('show');
  },
  hideLoader: function(){
    jQuery(this.loader_id).modal('hide');
    jQuery('.modal-backdrop').remove();
  },
  clearContent: function(){
    if(Ractive.getObj('#ractive-content'))
      Ractive.getObj('#ractive-content').unrender();
    jQuery('#ractive-content').html(this.loader.toHTML());
  },
  setHistoryEvent: function(){
    var obj = this;
    window.addEventListener("popstate", function (e) {if(!obj.forward)Ractive.getObj('menu').parseHash();}, false)
  },
  load_and_set: function(name, param){
    Ractive.getObj('submenu').setSubMenu(Ractive.getObj('menu').get('menu')[name].submenu);
    Ractive.getObj('menu').set('active', name);
    this.clear_update_action();
    if(!Ractive.helper.isRandered(name))
      this.clearContent();
    Ractive.requirePart(name).then(function(){
      for(var i in param){
        if(-1 != i.indexOf('>')){
          var path = i.split('>');
          var d = path.pop();
          var obj = Ractive.getObj(name);
          for(var j in path)
            obj = obj.findComponent(path[j]);
          obj.set(d, param[i]);
        } else
          Ractive.getObj(name).set(i, param[i]);
      }
    });
  },
  alertx: function(mess, type){
    this.alert(mess, type, false);
  },
  alert: function(mess, type, esc){
    type = type || 'success'; // success, info, warning, danger
    esc = (Ractive.helper.isset(esc)) ? esc : true;
    var tmpl = Ractive.alertx;
    if(esc)
      tmpl = Ractive.alert;
    tmpl.set({mess: _e(mess), type: type});
    jQuery(this.alert_id).append(tmpl.toHTML());
    if(Ractive.DEBUG) console.log('Alert: ' + mess + '; Type: ' + type);
  },
  go: function(route, param){
    Ractive.getObj('submenu').setSubMenuActive(route, param);
  },
  set_update_action: function(callback){
    this.update_callback = callback;
    Ractive.getObj('submenu').set('update_action', true);
  },
  update_data: function(){
    if('function' == typeof this.update_callback)
      return this.update_callback();
  },
  clear_update_action: function(){
    this.update_callback = false;
    Ractive.getObj('submenu').set('update_action', false);
  }
});

var App = AppBase.extend({
  alertPhone: function(){
    Ractive.app.alertx(
      _e('Please enter your phone number in your %s to continue.', this.class).replace(/%s/g,
          '<a href="##profile" onclick="Ractive.app.go(\'me\');" class="alert-link">'+_e('profile', this.class)+'</a>'
      )
    , 'danger');
  },
  alertBonus: function(){
    Ractive.app.alertx('<a href="##money&createcard" onclick="Ractive.app.payBonusesOnRegister(this);" class="alert-link">'
            +'<img src="'+Ractive.pathSys+'assets/banners/'+_e('lang')+'/get_bonus.jpg" width="270" />'
            +'</a>', 'danger');
  },
  payBonusesOnRegister: function(el){
//    Ractive.apiAction('ApiPayBonusesOnRegister').then(function(a){
////      Ractive.app.alert(a.message);
//    });
    jQuery('.alert').alert('close');
  },
  getUserInfo: function(){
    console.log('run update pay info in app');
    var info = Ractive.getObj('info');
    var last_request_info = info.get('last_request_info');
//    var format = Ractive.helper.formatSum;
    var obj = this;
    if(moment().unix() > last_request_info + 10){
      info.set('last_request_info', moment().unix());
      Ractive.apiRequestParalel.onAfterLast(function(d){
        info.set('last_request_info', moment().unix());
        var di = d['ApiPayInfo'];
//                var bal = (di.cards_money+di.investments_garant_by_bonus[7]+di.investments_garant_percent_by_bonus[7]+di.my_investments_standart_by_bonus[7]) - (di.active_cards_credits+(di.active_cards_credits_outsumm - di.active_cards_credits)+di.overdue_garant_interest) + ((di.active_cards_invests_outsumm - di.active_cards_invests) + di.soon - di.future_interest_payout);
        info.set({
          user_info: di,
//          'info.peoples.val': (di.soon),
//          'info.peoples.val_u': di.myChildren,
//          'info.guarantee.val': (di.guarantee), //di.guarantee
//          'info.money.val': (di.cards_money), // di.payment_account + di.bonuses + di.partner_funds + di.c_creds_total + di.c_creds_total,
//          'info.borrowed.val': parseFloat(di.credits), //(di.active_cards_credits+di.garant_fa_received),
//          'info.issued.val': parseFloat(di.invests), //(di.active_cards_invests+di.garant_fa_issued),
        });
//        if(di.system_messages && di.system_messages['10'] && !obj.sys_mess_shown){
//          for(var i in di.system_messages['10']){
//            Ractive.app.alert(di.system_messages['10'][i].text, 'info');
//          }
//          obj.sys_mess_shown = true;
//          setTimeout(function(){
//            obj.sys_mess_shown = false;
//          }, 30 * 60 * 60 * 1000);
//        }
//        if(!di.is_set_phone){
//          Ractive.app.alertPhone();
//        }
//        if(!di.is_payed_bonuses_on_register)
//          Ractive.app.alertBonus();
      });
      Ractive.apiRequest('ApiPayInfo');
    } else
        setTimeout(function(){if(Ractive.apiRequestParalel.isEnded()) Ractive.apiRequestParalel.afterLast();},0);
  },
});
