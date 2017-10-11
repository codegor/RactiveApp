var Submenu = Ractive.extend({
  id: '#ractive-submenu',
  loaded: false,
  create: function(template, name){
    var obj = this;
    return new Ractive.Promise(function(fulfil){
      Ractive.addObj(name, {
        el: obj.id,
        template: template,
        data: {
          selected: '',
          update_action: false,
          menu: {},
          isItemEmpty: function (itemName) {
            return (itemName.indexOf('EMPTY_MENU_') !== -1);
          },
        }
      });
      if(Ractive.DEBUG) console.log('Submenu created');
      fulfil();
    });
  },
  MAX_MENU_LENGTH: 6,
  oninit: function(options){
    var obj = this;
    this.on({
      update_action: function(){
        Ractive.app.update_data();
      },
      sub_menu_load: function(item){
        if(Ractive.DEBUG) console.log('Submenu ' + item.context.name + ' fired!');
        var is_set_phone = (Ractive.apiRequestParalel.data.ApiPayInfo && 'undefined' != typeof Ractive.apiRequestParalel.data.ApiPayInfo.is_set_phone) ? Ractive.apiRequestParalel.data.ApiPayInfo.is_set_phone : true;
        if(!is_set_phone && 'me' != item.context.name){
          Ractive.app.alertPhone();
          if(this.loaded)
           return;
        }
        var route = Ractive.app_routes[item.context.name];
        Ractive.app.load_and_set(route.module, Ractive.helper.concatObj(route.settings, item.param));

        // swich off pop history
        Ractive.app.forward = true;
        if(Ractive.helper.isset(Ractive.getObj('menu').get('menu')[route.module].name))
          if(item.context.name == Ractive.getObj('menu').get('menu')[route.module].def)
            window.location.hash = '##' + route.module;
          else
            window.location.hash = '##' + route.module + '&' + item.context.name;
        // swich on pop history
        Ractive.app.forward = false;

        if(Ractive.DEBUG) console.log('%s->%s fire', route.module, item.context.name);

        this.loaded = true;
        return false;
      },
    });


  },
  setSubMenu: function (menu) {
    var menu_length_diff = this.MAX_MENU_LENGTH - Object.keys(menu).length;
    if (menu_length_diff > 0) {
      for (var k = 0; k < menu_length_diff; k++) {
        var itemName = 'EMPTY_MENU_' + k;
        menu[itemName] = '';
      }
    }
    this.set('menu', menu);
  },
  setSubMenuActive: function(route, param){
    var is_set_phone = (Ractive.apiRequestParalel.data.ApiPayInfo && 'undefined' != typeof Ractive.apiRequestParalel.data.ApiPayInfo.is_set_phone) ? Ractive.apiRequestParalel.data.ApiPayInfo.is_set_phone : true;
    if(!is_set_phone && 'me' != route){
      Ractive.app.alertPhone();
      if(this.loaded)
       return;
    }
    this.set('selected', route);
    this.fire('sub_menu_load', {context: {name: route}, param: param});
  },
});
