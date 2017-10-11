var Menu = Ractive.extend({
  id: '#ractive-menu',
  create: function(template, name){
    var obj = this;
    return new Ractive.Promise(function(fulfil){
      Ractive.requireSysPart('menu/submenu').then(function(){
        Ractive.addObj(name, {
          el: obj.id,
          template: template,
          data: {
            menu: Ractive.app_menu,
            active: '',
            obj_length: Ractive.helper.obj_length,
            is_active: function(v, cur){
              return v == cur;
            },
          }
        });
        if(Ractive.DEBUG) console.log('Menu created');
        fulfil();
      });
    });
  },
  oninit: function(){
    this.on({
      load: function(inp){
        if(Ractive.DEBUG) console.log('Menu ' + inp.index.k + ' fired!');
        Ractive.getObj('submenu').setSubMenuActive(this.get('menu')[inp.index.k].def);
        return false;
      },
      submenu: function(inp){
        if(Ractive.DEBUG) console.log('Menu (sub) ' + inp.index.s + ' fired!');
        Ractive.getObj('submenu').setSubMenuActive(inp.index.s);
        return false;
      },
    });
  },
  oncomplete: function(){
    this.parseHash();
  },
  parseHash: function(){
    var module = window.location.hash.replace(/#/g, "").split('&');
    var obj = this;
    var m = this.get('menu');

    if(!Ractive.helper.isset(m[module[0]]))
      module = ['money'];
    if(Ractive.helper.isset(module[1]))
      setTimeout(function(){obj.fire('submenu', {index: {s: module[1]}});},0);
    else
      setTimeout(function(){obj.fire('load', {index: {k: module[0]}});},0);
  },
});