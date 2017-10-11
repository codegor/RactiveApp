/* Simple JavaScript Inheritance
* By John Resig http://ejohn.org/
* http://ejohn.org/blog/simple-javascript-inheritance/
* MIT Licensed.
*/
// Inspired by base2 and Prototype
//<editor-fold defaultstate="collapsed" desc="Class">
var Class = (function () {
   var initializing = false, fnTest = /xyz/.test(function () {
       xyz;
   }) ? /\b_super\b/ : /.*/;

   // The base Class implementation (does nothing)
   var Class = function () {
   };

   // Create a new Class that inherits from this class
   Class.extend = function (prop) {
       var _super = this.prototype;

       // Instantiate a base class (but only create the instance,
       // don't run the init constructor)
       initializing = true;
       var prototype = new this();
       initializing = false;

       // Copy the properties over onto the new prototype
       for (var name in prop) {
           // Check if we're overwriting an existing function
           prototype[name] = typeof prop[name] == "function" &&
               typeof _super[name] == "function" && fnTest.test(prop[name]) ?
               (function (name, fn) {
                   return function () {
                       var tmp = this._super;

                       // Add a new ._super() method that is the same method
                       // but on the super-class
                       this._super = _super[name];

                       // The method only need to be bound temporarily, so we
                       // remove it when we're done executing
                       var ret = fn.apply(this, arguments);
                       this._super = tmp;

                       return ret;
                   };
               })(name, prop[name]) :
               prop[name];
       }

       // The dummy class constructor
       function Class() {
           // All construction is actually done in the init method
           if (!initializing && this.init) {
               this.init.apply(this, arguments);
           }
       }

       // Populate our constructed prototype object
       Class.prototype = prototype;

       // Enforce the constructor to be what we expect
       Class.prototype.constructor = Class;

       // And make this class extendable
       Class.extend = arguments.callee;

       return Class;
   };

   return Class;
})();
//</editor-fold>
var app_obj = {};
(function($, Ractive){
  console.info('Ractive App version: 2.7.3');
  // dependencies
  // ractive-helper.js, ractive-api-const.js, ractive.js

// configs sets in ractive-app-config.js
//    Ractive.pathApp  = path to app folder;
//    Ractive.pathWin = path to window folder;
//    Ractive.pathSys = path to system folder;
//    Ractive.pathApi = _path to api model folder;
//    Ractive.pathDBViews  = url for DB templete;
//
//    tamlates names
//    Ractive.templateAsset = ['css']; //, 'js'
//    Ractive.templateExt = 'html';
//    Ractive.templateModel = 'model.js';
//    Ractive.templateElement = 'element.js';
//    Ractive.templateComponent = 'component.js';
//    Ractive.componentsDir = 'components';

  Ractive.requireComponentLoading = {};
  Ractive.requireElementLoading = {};
  Ractive.requireApiLoading = {};
  Ractive.templates = {};
  Ractive.fieldListeners = {},
  Ractive.apiHistory = {}, // ApiName(key):{class: 'false/loading/true', loading: true/false, loaded: time, result: (status)}
  Ractive.apiRequestParalel = {
    cnt: 0,
    timer: false,
    timeout: 5 * 60 * 60,
    start: function(){
      this.cnt++;
      var obj = this;
      if(this.timer === !!this.timer)
        this.timer = setTimeout(function(){
          obj.cnt = 0;
          obj.timer = true;
        }, this.timeout);
    },
    end: function(){
      this.cnt--;
    },
    isEnded: function(){
      var res = (0 >= this.cnt);
      if(res){
        clearTimeout(this.timer);
        this.timer = false;
      }
      return res;
    },
    data: {},
    afterLastFnc: [],
    onAfterLast: function(callback){
      this.afterLastFnc.push(callback);
    },
    afterLast: function(){
      for(var i in this.afterLastFnc)
        this.afterLastFnc[i](this.data);

      this.afterLastFnc = '';
      this.afterLastFnc = [];
    }
  }

  Ractive.addObj = function(name, params){
    if(!window.app_obj[name]){
      var Obj = window[name.capitalizeFirstLetter()];
      window.app_obj[name] = new Obj(params);
    } else if(Ractive.DEBUG)
      console.log('Obj ' + name + ' have been added previosly');

    if(params.el)
      window.app_obj[params.el] = window.app_obj[name];
  };
  Ractive.getObj = function(name){
    return window.app_obj[name];
  };
  Ractive.setObj = function(name, obj){
    window.app_obj[name] = obj;
  };
  Ractive.getTemplate = function(name){
    return this.templates[name];
  };
  Ractive.setTemplate = function(name, template){
    this.templates[name] = template;
  };
  Ractive.requireDependensis = function(cls, paralel){
    if(Ractive.helper.isset(window[cls].prototype.dependencies)){
      var dep = window[cls].prototype.dependencies;
      for(var i in dep.components)
        Ractive.requireComponent(dep.components[i], paralel);

      for(var i in dep.elements){
        if('comp' == paralel.type)
          Ractive.requireElement({
            name: dep.elements[i],
            src: Ractive.componentsDir + '/' + Ractive.helper.addNameFile(dep.elements[i]),
            path: 'pathSys'
          }, paralel);
        else
          Ractive.requireElement({name: dep.elements[i], path: paralel.param.path}, paralel);
      }
    }
  };
  Ractive.requireSysPart = function(param){
    if('string' == typeof param){
      var name = param;
      param = {name: name};
    }
    param.path = 'pathSys';
    return Ractive.requirePart(param);
  };
  Ractive.requireSysElement = function(param, paralel){
    if('string' == typeof param){
      var name = param;
      param = {name: name};
    }
    param.path = 'pathSys';
    return Ractive.requireElement(param, paralel);
  };
  Ractive.requireWin = function(param){
    if('string' == typeof param){
      var name = param;
      param = {name: name};
    }
    param.path = 'pathWin';
    return Ractive.requirePart(param);
  };
  Ractive.requireWinElement = function(param, paralel){
    if('string' == typeof param){
      var name = param;
      param = {name: name};
    }
    param.path = 'pathWin';
    return Ractive.requireElement(param, paralel);
  };
  Ractive.requirePart = function(param){
    if('string' == typeof param){
      var name = param;
      param = {name: name};
    } else{
      var name = param.name;
    }
    param.assets = param.assets || ['css'];
    param.path = param.path || 'pathApp';

    if(!name){
      throw new Error('You have to specify a file/name for Ractive.requirePart');
    }
    var src = param.src || Ractive.helper.addNameFile(name);
    var obj = this;
    var path = obj[param.path];
    if(!path){
      throw new Error('Wrong path for Ractive.requirePart');
    }

    name = name.split("/").pop();
    var cls = name.capitalizeFirstLetter();

    return new Ractive.Promise(function(fulfil){
      if(!window[cls]){
        var template;
        Ractive.requireTemplate(param).then(function(t){
          template = t;
          return Ractive.require(Ractive.helper.addVer(path + src + '.' + obj.templateModel));
        }).then(function(){
          if(Ractive.DEBUG) console.log('Ractive.requirePart: cls = ' + cls);
          window[cls].prototype.create(template, name).then(fulfil);
          if(Ractive.DEBUG) console.log('Part ' + name + ' loaded');
        });
      } else if(!Ractive.helper.isset(Ractive.getObj(name))) {
        window[cls].prototype.create(Ractive.getTemplate(param.name), name).then(fulfil);
        if(Ractive.DEBUG) console.log('Part ' + name + ' loaded');
      } else {
        var cur_obj = Ractive.getObj(name);
        if(cur_obj.id && !cur_obj.fragment.rendered){
          if('window' != cur_obj.type){
            cur_obj.render(cur_obj.id); //Ractive.getObj(name).onrender()
            Ractive.setObj(cur_obj.id, cur_obj);
          } else {
            cur_obj.render(Ractive.win.place[Ractive.win.placies[name]]);
            Ractive.setObj(Ractive.win.place[Ractive.win.placies[name]], cur_obj);
          }
        }
        fulfil();
      }

    });
  };
  Ractive.requireTemplate = function(param, paralel){
    paralel = paralel || {
      cnt: 0, afterlast: function(){
      }
    };
    paralel.cnt++;
    var assets = param.assets || this.templateAsset;
    var name = param.name;

    if(!name){
      throw new Error('You have to specify a file/name Ractive.requireTemplate');
    }
    param.path = param.path || 'pathApp';

    var src = param.src || Ractive.helper.addNameFile(name);
    var obj = this;
    var path = obj[param.path];
    if(!path){
      throw new Error('Wrong path for Ractive.requirePart');
    }

    var templ = path + src + '.' + obj.templateExt;
    if(param.db){
      templ = obj.pathDBViews + param.db;
    }
    var work = function(fulfil){
      var loaded = function(){
        fulfil(obj.templates[name]);
        paralel.cnt--;
        paralel.template = obj.getTemplate(name);
        if(0 >= paralel.cnt && !paralel.ran){
          paralel.ran = true;
          paralel.afterlast();
        }
      };
      if(!obj.templates[name]){
        for(var a in assets){
          Ractive.require(Ractive.helper.addVer(path + src + '.' + assets[a]));
        }
        Ractive.getHtml(Ractive.helper.addVer(templ), param.asinc).then(function(template){
          obj.setTemplate(name, template);
          if(Ractive.DEBUG) console.log('Tamplate ' + name + ' loaded');
          loaded();
        });
      } else
        loaded();

    };

    if(false === param.asinc){
      return {then: work};
    } else
      return new Ractive.Promise(work);
  };
  Ractive.requireComponent = function(param, paralel){
    paralel = paralel || {
      cnt: 0, afterlast: function(){
      }
    };
    paralel.cnt++;
    if('string' == typeof param){
      var name = param;
      param = {name: name};
    } else{
      var name = param.name;
    }
    param.assets = param.assets || ['css'];
    param.type = 'component';
    param.path = param.path || 'pathSys';

    if(!name){
      throw new Error('You have to specify a file/name Ractive.requireComponent');
    }
    var src = param.src || Ractive.helper.addNameFile(name);
    param.src = src = this.componentsDir + '/' + src;
    var obj = this;
    var path = obj[param.path];
    if(!path){
      throw new Error('Wrong path for Ractive.requirePart');
    }

    name = name.split("/");
    var cls = name;
    name = name.join('-');
    for(var i in cls)
      cls[i] = cls[i].capitalizeFirstLetter();
    cls = cls.join('');

    return new Ractive.Promise(function(fulfil){
      var loaded = function(){
        paralel.cnt--;
        setTimeout(function(){
          if(0 >= paralel.cnt && !paralel.ran){
            paralel.ran = true;
            paralel.afterlast();
          }
        }, 1);
        fulfil();
      };
      if(!Ractive.components[name]){
        var r = Ractive.helper.addVer(path + src + '.' + obj.templateComponent);
        if(Ractive.requireIsLoading(r)){
          if(!Ractive.requireComponentLoading[r])
            Ractive.requireComponentLoading[r] = [];
          Ractive.requireComponentLoading[r].push(loaded);
        } else {
          var define = function(){
            var comp_paralel = {
              type: 'comp',
              param: param,
              cnt: 0,
              afterlast: function(){
                if(Ractive.DEBUG) console.log('Component ' + name + ' loaded');

                Ractive.components[name] = window[cls].extend({
                  template: this.template
                });
                loaded();
//                paralel.cnt--;
//                if(0 >= paralel.cnt && !paralel.ran){
//                  paralel.ran = true;
//                  paralel.afterlast();
//                }
//                fulfil();
                Ractive.requireComponentLoaded(r);
              }
            };
            Ractive.requireDependensis(cls, comp_paralel);
            Ractive.requireTemplate(param, comp_paralel);
          };
          if(!window[cls])
            Ractive.require(r).then(define);
          else
            define();
        }
      } else
        loaded();
    });
  };
  Ractive.requireElement = function(param, paralel){
    paralel = paralel || {
      cnt: 0, afterlast: function(){
      }
    };
    if(Ractive.DEBUG_APP_LOAD_ELEMENTS) console.log(paralel.cnt, 'param', param);
    paralel.cnt++;
    if('string' == typeof param){
      var name = param;
      param = {name: name};
    } else{
      var name = param.name;
    }
    if(Ractive.DEBUG_APP_LOAD_ELEMENTS) console.log(paralel.cnt, 'name', name);
    param.assets = param.assets || ['css'];
    param.type = 'element';
    param.path = param.path || 'pathApp';

    if(!name){
      throw new Error('You have to specify a file/name Ractive.requireElement');
    }
    var src = param.src || Ractive.helper.addNameFile(name);
    var obj = this;
    var path = obj[param.path];
    if(!path){
      throw new Error('Wrong path for Ractive.requirePart');
    }

    name = name.split("/");
    var cls = name;
    name = name.join('-');
    for(var i in cls)
      cls[i] = cls[i].capitalizeFirstLetter();
    cls = cls.join('');

    return new Ractive.Promise(function(fulfil){
      var loaded = function(){
        paralel.cnt--;
        if(Ractive.DEBUG_APP_LOAD_ELEMENTS) console.log(paralel.cnt, name, '--');
        setTimeout(function(){
          if(Ractive.DEBUG_APP_LOAD_ELEMENTS) console.log(paralel.cnt, name, 'try setTimeout', paralel.ran);
          if(0 >= paralel.cnt && !paralel.ran){
            paralel.ran = true;
            paralel.afterlast();
          }
        }, 1);
        fulfil();
      };
      if(!Ractive.components[name]){
        var r = Ractive.helper.addVer(path + src + '.' + obj.templateElement);
        if(Ractive.requireIsLoading(r)){
          if(!Ractive.requireElementLoading[r])
            Ractive.requireElementLoading[r] = [];
          Ractive.requireElementLoading[r].push(loaded);
        } else{
          var define = function(){
            var el_paralel = {
              type: 'el',
              param: param,
              cnt: 0,
              afterlast: function(){
                if(Ractive.DEBUG)
                  console.log('Element ' + name + ' loaded');

                Ractive.components[name] = window[cls].extend({
                  template: this.template
                });
                if(Ractive.DEBUG_APP_LOAD_ELEMENTS) console.log(paralel.cnt, name, 'el_paralel.afterlast');
                loaded();
//                paralel.cnt--;
//                if(0 >= paralel.cnt && !paralel.ran){
//                  paralel.ran = true;
//                  paralel.afterlast();
//                }
//                fulfil();
                Ractive.requireElementLoaded(r);
              }
            };
            Ractive.requireDependensis(cls, el_paralel);
            Ractive.requireTemplate(param, el_paralel);
          };
          if(!window[cls])
            Ractive.require(r).then(define);
          else
            define();
        }
      } else
        loaded();
    });
  };
  Ractive.requirePartial = function(param){
    if('string' == typeof param){
      var name = param;
      param = {name: name};
    } else{
      var name = param.name;
    }
    param.assets = param.assets || ['css'];
    param.type = 'partial';
    param.asinc = false;
    param.create_obj = param.create_obj || false;

    if(!name){
      throw new Error('You have to specify a file/name Ractive.requirePartial');
    }
    Ractive.requireTemplate(param).then(function(template){
      if(Ractive.DEBUG)
        console.log('Partial ' + name + ' loaded');

      Ractive.partials[name] = template;
    }
    );
    return name;

  };
  Ractive.apiRequest = function(action, data, type, onerror, async){
    Ractive.apiRequestParalel.start();
    var url = Ractive.helper.addVer(Ractive[action].url);
    return new Ractive.Promise(function(fulfil, reject){
      Ractive.requireJson(url, data, type, async).then(function(a, b, c){
        Ractive.apiRequestParalel.end();
        if("success" == a.status){
          Ractive.apiRequestParalel.data[action] = a;
          setTimeout(function(){
            fulfil(a, b, c);
          }, 0);
        } else if("error" == a.status && !onerror)
          setTimeout(function(){
            Ractive.app.alert(a.error, 'danger');
            reject(a, b, c);
          }, 0);
        else if("error" == a.status && onerror)
          setTimeout(function(){
            onerror();
            reject(a, b, c);
          }, 0);
        else if("need_update" == a.status)
          setTimeout(function(){
            Ractive.app.alert(a.error, 'danger');
            window.location.reload();
          }, 0);
        else
          setTimeout(function(){
            Ractive.app.alert('Произошла какая-то ошибка', 'warning'), 0
          });
        if(Ractive.apiRequestParalel.isEnded())
          Ractive.apiRequestParalel.afterLast();
      });
    });
  };
  Ractive.requireJson = function(url, data, type, async){
    type = type || 'GET';
    async = async || true;
    data = data || [];
    Ractive.app.fire('showLoader');
    return new Ractive.Promise(function(fulfil, reject){
      $.ajax(url, {
        url: url,
        type: type,
        async: async,
        data: data,
        dataType: "json",
        error: function(error){
          reject(error);
          setTimeout(function(){
            Ractive.app.fire('hideLoader');
          }, 500);
          Ractive.app.alert(Ractive.apiError, 'danger');
          if(Ractive.DEBUG)
            console.log('Error on load from ' + url);
        },
        success: function(a, b, c){
          fulfil(a, b, c);
          if(Ractive.DEBUG)
            console.log('data loaded from ' + url);
          setTimeout(function(){
            Ractive.app.fire('hideLoader');
          }, 500);
        }
      });
    });
  };
  Ractive.getHtml = function(url, async, data, type){
    type = (Ractive.helper.isset(type)) ? type : 'GET';
    async = (Ractive.helper.isset(async)) ? async : true;
    data = (Ractive.helper.isset(data)) ? data : [];
    if(async)
      return new Ractive.Promise(function(fulfil, reject){
        $.ajax(url, {
          url: url,
          type: type,
          async: async,
          data: data,
          error: function(error){
            reject(error);
//                        if (Ractive.DEBUG) console.log('Error on load html from ' + url);
          },
          success: function(a, b, c){
            fulfil(a, b, c); /*if(Ractive.DEBUG) console.log('html loaded from '+url);*/
          }
        });
      });
    else{
      return $.ajax(url, {
        url: url,
        type: type,
        async: async,
        data: data,
        error: function(error){
          if(Ractive.DEBUG)
            console.log('Error on sinc load html');
          return {
            then: function(fulfil, reject){
              if("function" == typeof reject)
                return reject(error);
            }
          };
        },
        success: function(a, b, c){
          if(Ractive.DEBUG)
            console.log('html sinc loaded');
          return {
            then: function(fulfil, reject){
              if("function" == typeof fulfil)
                return fulfil(a, b, c);
            }
          };
        }
      });
    }
  };
  Ractive.requireIsLoading = function(name){
    if(Ractive.injects.indexOf(name) > -1){
      return true;
    } else
      return false;
  };
  Ractive.requireComponentLoaded = function(name){
    for(var i in Ractive.requireComponentLoading[name])
      Ractive.requireComponentLoading[name][i]();
    Ractive.requireComponentLoading[name] = [];
  };
  Ractive.requireElementLoaded = function(name){
    for(var i in Ractive.requireElementLoading[name])
      Ractive.requireElementLoading[name][i]();
    Ractive.requireElementLoading[name] = [];
  };
  Ractive.requireApiLoaded = function(r){
    for(var i in Ractive.requireApiLoading[r])
      Ractive.requireApiLoading[r][i].f(window[Ractive.requireApiLoading[r][i].a]);
    Ractive.requireApiLoading[r] = [];
  };
  Ractive.requireApi = function(name){
    var obj = this;
    var path = obj.pathApi;
    return new Ractive.Promise(function(fulfil){
      if(!Ractive.isApiLoaded(name)){
        var r = Ractive.helper.addVer(path + name + '.js');
         if(Ractive.requireIsLoading(r)){
            if(!Ractive.requireApiLoading[r])
              Ractive.requireApiLoading[r] = [];
            Ractive.requireApiLoading[r].push({f:fulfil, a:name});
          } else {
            var define = function(){
              fulfil(window[name]);
              Ractive.requireApiLoaded(r);
            };
            Ractive.require(r).then(define);
          }
      } else
        fulfil(window[name]);
    });
  };
  Ractive.isApiLoaded = function(name){
    return !!window[name];
  };
  Ractive.getApiLoaded = function(name){
    return window[name];
  };
  Ractive.apiField = function(name, cache, onUpdate, id){ // если есть update то его выполнять при первой загрузке тоже, и если из кеша то тоже выполняьт именно для этой функции, не вызывать update всего поля
    id = ('string' == typeof id) ? id : false;
    id = ('string' == typeof onUpdate) ? onUpdate : id;
    id = ('string' == typeof cache) ? cache : id;
    onUpdate = ('function' == typeof onUpdate) ? onUpdate : false;
    onUpdate = ('function' == typeof cache) ? cache : onUpdate;
    cache = ('boolean' == typeof cache) ? cache : true;
    if(!Ractive.helper.isset(Ractive.apiFields[name]))
      console.error('API Field %s has not present in config file', name);
    var params = Ractive.apiFields[name];
    return new Ractive.Promise(function(fulfil){ //вернуть в then значения поля
      Ractive.requireApi(params.api).then(function(model){
        model.adjoin(name, cache, onUpdate, id).then(function(field){
          fulfil({field:field, model:model, name:name});
        });
      });
    });
  };
  Ractive.apiField._get = function(name, cache){ // если есть update то его выполнять при первой загрузке тоже, и если из кеша то тоже выполняьт именно для этой функции, не вызывать update всего поля
    cache = ('boolean' == typeof cache) ? cache : true;
    if(!Ractive.helper.isset(Ractive.apiFields[name]))
      console.error('API Field %s has not present in config file', name);
    var params = Ractive.apiFields[name];
    return new Ractive.Promise(function(fulfil){ //вернуть в then значения поля
      Ractive.requireApi(params.api).then(function(model){
        model.get(name, cache).then(function(field){
          fulfil({field:field, model:model, name:name});
        });
      });
    });
  };
  Ractive.apiField._subs = function(name, onUpdate, id, single){ // если есть update то его выполнять при первой загрузке тоже, и если из кеша то тоже выполняьт именно для этой функции, не вызывать update всего поля
    if(!Ractive.helper.isset(Ractive.apiFields[name]))
      console.error('API Field %s has not present in config file', name);
    var params = Ractive.apiFields[name];
    return new Ractive.Promise(function(fulfil){ //вернуть в then значения поля
      Ractive.requireApi(params.api).then(function(model){
        model.subscribe(name, onUpdate, id, single);
        fulfil(model, name);
      });
    });
  };
  Ractive.apiField.fields = function(fields, cache, onUpdate, id){ // fields - array || object
    id = ('string' == typeof id) ? id : false;
    id = ('string' == typeof onUpdate) ? onUpdate : id;
    id = ('string' == typeof cache) ? cache : id;
    onUpdate = ('function' == typeof onUpdate) ? onUpdate : false;
    onUpdate = ('function' == typeof cache) ? cache : onUpdate;
    cache = ('boolean' == typeof cache) ? cache : true;
    return new Ractive.Promise(function(fulfil){
      var thread = 0;
      var values = {};
      var run = false;
      var afterLast = function(){
        run = false;
        if('function' == typeof onUpdate)
          onUpdate(values);
        fulfil(values);
      };
      var update = function(val, name){
        if(true == run) return;
        run = true;
        if(Ractive.helper.isset(val))
          values[name] = val;
        for(var i in fields){
          if(name == fields[i]) continue;
          thread++;
          Ractive.apiField._get(fields[i], cache).then(function(params){
            values[params.name] = params.field;
            thread--;
            if(0 >= thread)
              afterLast();
          })
        }
      };
      update();
      for(var i in fields)
        Ractive.apiField._subs(fields[i], update, id, true);
    });
  };
  Ractive.apiField.update = function(name){
    if(!Ractive.helper.isset(Ractive.apiFields[name]))
      console.error('API update Field %s has not present in config file', name);
    var params = Ractive.apiFields[name];
    return new Ractive.Promise(function(fulfil){
      Ractive.requireApi(params.api).then(function(model){
        model.update().then(function(){
          fulfil(model.fields);
        });
      });
    });
  };
  Ractive.apiData = function(action, data, type, onerror, async){
    return Ractive.apiRequest(action, data, type, onerror, async);
  };
  Ractive.apiAction = function(action, data, type, onerror, async){
    return new Ractive.Promise(function(fulfil){
      var res = Ractive.apiRequest(action, data, type, onerror, async);
      fulfil(res);
      res.then(function(){
        var api = Ractive[action];
        if('action' == api.type)
          for(var i in api.toChange){
            if(Ractive.isApiLoaded(api.toChange[i])){
              Ractive.getApiLoaded(api.toChange[i]).update();
            }
          }
      });
    });
  };
})(jQuery, Ractive);

String.prototype.capitalizeFirstLetter = function(){
  return this.charAt(0).toUpperCase() + this.slice(1);
};

/*! part of: Ractive-Require (0.5.2). (C) 2015 CodeCorico. MIT @license: en.wikipedia.org/wiki/MIT_License
 *  src: http://ractive-require.codecorico.com
 */
(function(){
  'use strict';

  function _inject(name, file, elementConstructor, callback){
//    name = name.split('/').pop();

    if(window.Ractive.injects.indexOf(name) > -1){
      return callback();
    }

    var element = elementConstructor();
    element.onload = callback;

    window.Ractive.injects.push(name);
    document.getElementsByTagName('head')[0].appendChild(element);
  }

  function _injectJS(name, file, callback){
    _inject(name, file, function(){
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = file;

      return script;
    }, callback);
  }

  function _injectCSS(name, file, callback){
    _inject(name, file, function(){
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = file;

      return link;
    }, callback);
  }

  window.Ractive.injects = window.Ractive.injects || [];

  window.Ractive.require = function(name, file){
    var extension = null;

    if(!name){
      throw new Error('You have to specify a file/name');
    }

    file = file || name;

    extension = (file.split('?').shift().split('.').pop() || '').toLowerCase();
    if(extension == 'js'){
      return new window.Ractive.Promise(function(fulfil){
        _injectJS(name, file, fulfil);
      });
    } else if(extension == 'css'){
      return new window.Ractive.Promise(function(fulfil){
        _injectCSS(name, file, fulfil);
      });
    }
  };

  window.Ractive.prototype.require = function(name){
    name = name || null;

    var _this = this;

    this.childrenRequire = this.childrenRequire || [];

    return new window.Ractive.Promise(function(fulfil){

      var elements = name ?
              _this.el.querySelectorAll('rv-require[src][ondemand="' + name + '"]:not([loaded="true"])') :
              _this.el.querySelectorAll('rv-require[src]:not([loaded="true"]):not([ondemand])'),
              count = elements.length;

      if(count < 1){
        return fulfil();
      }

      [].forEach.call(elements, function(element){

        if(_inScope(element, _this.el)){
          _requireElement(_this, element, function(){
            --count;
            if(count < 1){
              fulfil();
            }
          });
        } else{
          --count;
          if(count < 1){
            fulfil();
          }
        }
      });

    });
  };

})();

// load all app
(function($, Ractive){
  $(document).ready(function(){
    if(Ractive.helper.isset(Ractive.appGlue)){
      var path = _p+Ractive.appGlue.path;
      Ractive.getHtml(Ractive.helper.addVer(path + Ractive.appGlue.html), false).then(function(templates){
        var repl = ['app/', 'win/', 'sys/components/', 'sys/', '.html'];
        var arr_templts = templates.split('<!!!>');
        var parts = [];
        var name = '';
        for(var i in arr_templts){
          if(arr_templts[i].length){
            parts = arr_templts[i].split('<!:!>');
            name = parts[0];
            if(!Ractive.helper.str_find(name, 'app.html')){
              var tmp = name.split('/');
              tmp.pop();
              name = tmp.join('/');
            }
            for(var j in repl)
              name = name.replace(repl[j],'');
            Ractive.setTemplate(name, parts[1]);
          }
        }
        if(Ractive.DEBUG) console.log('Tamplates loaded');
      });
//      Ractive.require(Ractive.helper.addVer(path + Ractive.appGlue.css));
      Ractive.require(Ractive.helper.addVer(path + Ractive.appGlue.js));
    }
  });
})(jQuery, Ractive);

var ApiModel = Class.extend({
  api: '',
  params: {},
  formatter: function(data){return data;},
  init: function(){
    this.subs = {};
    this.stack = [];
    this.load_req = [];
    this.fields = {};
    this.loading = false;
    this.loaded = false;
    this.counter = 0;
  },
  update: function(){
    var loading = this.loading;
    var obj = this;
    return new Ractive.Promise(function(fulfil){
      obj.startLoading(fulfil);
      if(!loading)
        Ractive.apiRequest(obj.api, obj.params).then(function(data){
          delete(data.status);
          obj.format(data).then(function(formd_data){
            obj.fields = formd_data;
            obj.scatter();
            fulfil();
            obj.stopLoading();
          });
        });
    });
  },
  adjoin: function(name, cache, callback, id){ // возвращает текущее значение поля
    this.subscribe(name, callback, id, false);
    if(Ractive.helper.isset(this.fields[name]) && 'function' == typeof callback)
      callback(this.fields[name], name, this);
    return this.get(name, cache);
  },
  get: function(name, cache){
    var obj = this;
    return new Ractive.Promise(function(fulfil){
      if(false === cache || !Ractive.helper.isset(obj.fields[name])){
        if(!obj.loading)
          obj.update().then(function(){
            fulfil(obj.fields[name]);
          });
        else {
          obj.pushStack(name, fulfil);
        }
      }else
        fulfil(obj.fields[name]);
    });
  },
  subscribe: function(name, callback, id, single){
    if('function' == typeof callback){
      var key = ('string' == typeof id) ? id : this.counter++;
      if(!Ractive.helper.isset(this.subs[key]) || single)
        this.subs[key] = {name: name, callback: callback};
      else {
        var need = (name == this.subs[key].name) ? false : true; // это для борьбы с дубликатами
        if(Ractive.helper.isset(this.subs[key].fields)){
          for(var j in this.subs[key].fields){
            need = (name == this.subs[key].fields[j].name) ? false : need;
          }
        }
        if(need){
          if(Ractive.helper.isset(this.subs[key].fields))
            this.subs[key].fields.push({name: name, callback: callback});
          else
            this.subs[key].fields = [{name: name, callback: callback}, this.subs[key]];
        }
      }
    }
  },
  scatter: function(){
    var s = this.subs;
    for(var i in s){
      if(Ractive.helper.isset(s[i].fields)){
        for(var j in s[i].fields){
          s[i].fields[j].callback(this.fields[s[i].fields[j].name], s[i].fields[j].name, this);
        }
      } else
        s[i].callback(this.fields[s[i].name], s[i].name, this);

    }
  },
  pushStack: function(name, callback){
    this.stack.push({name: name, callback: callback});
  },
  emptyStack: function(){
    for(var i in this.stack)
      this.stack[i].callback(this.fields[this.stack[i].name]);
    this.stack = [];
  },
  pushLoadReq: function(callback){
    this.load_req.push(callback);
  },
  emptyLoadReq: function(){
    for(var i in this.load_req)
      this.load_req[i]();
    this.load_req = [];
  },
  startLoading: function(callback){
    this.loading = true;
    this.loaded = false;
    this.pushLoadReq(callback);
  },
  stopLoading: function(){
    this.loading = false;
    this.loaded = true;
    this.emptyStack();
    this.emptyLoadReq();
  },
});
