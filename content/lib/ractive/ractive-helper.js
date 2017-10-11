(function($, Ractive){
  Ractive.helper = {
    getDecimal: function(num) {
      var str = "" + num;
      var zeroPos = str.indexOf(".");
      if (zeroPos == -1) return 0;
      str = str.slice(zeroPos);
      return +str;
    },
    getInt: function(v){
      if(this.isInt(v))
        return v;
      var str = "" + v;
      var zeroPos = str.indexOf(".");
      if (zeroPos == -1) return 0;
      str = str.slice(0,zeroPos);
      return str;
    },
    getDecimalStr: function(num) {
      var str = "" + num;
      var zeroPos = str.indexOf(".");
      if (zeroPos == -1) return 0;
      str = str.slice(zeroPos+1);
      return str;
    },
    isRandered: function(name){
      var R_obj = Ractive.getObj(name);
      return !!(R_obj && R_obj.fragment.rendered);
    },
    addVer: function(url){
      var concat = (url.indexOf('?') == -1) ? '?' : '&';
      return url + concat + 'ver=' + _ver + '&csfr=' + _csfr;
    },
    addCsfr: function(url){
      var concat = (url.indexOf('?') == -1) ? '?' : '&';
      return url + concat + 'csfr=' + _csfr;
    },
    addNameFile: function(path){
      path = path.split('/');
      var l = path.pop();
      path.push(l);
      path.push(l);
      return path.join('/');
    },
    beautyFloat: function(val){
      if('number' == typeof val)
        return Math.round((val + 0.00001) * 100) / 100;
      else
        return val;
    },
    formatSum: function(n){
      return numeral(n).format(prFormat);
    },
    isNumber: function(n) {
      if('number' == typeof n) return true; // если тип уже число просто выход

      return !isNaN(parseFloat(n)) && isFinite(n);
    },
    unformat: function(t){
      if(this.isNumber(t))
          return numeral().unformat(t);
      else return t;
    },
    objSort: function(obj){
      var s = [];
      for(var i in obj)
        s.push({key: i, value: obj[i]});
      s.sort(function(a, b){
        return (+a.key - (+b.key));
      });
      var r = {};
      for(var i in s)
        r[s[i].key] = s[i].value;
      return r;
    },
    objSortDef: function(obj){
      var s = [];
      for(var i in obj)
        s.push({key: i, value: obj[i]});
      s.sort();
      var r = {};
      for(var i in s)
        r[s[i].key] = s[i].value;
      return r;
    },
    objSortSumm: function(obj){
      var s = [];
      for(var i in obj)
        s.push({key: i, value: obj[i]});
      s.sort(function(a, b){
        return a.key * 100 - b.key * 100;
      });
      var r = {};
      for(var i in s)
        r[s[i].key / 100] = s[i].value;
      return r;
    },
    objSortSummVal: function(obj){
      var s = [];
      for(var i in obj)
        s.push({key: i, value: obj[i]});
      s.sort(function(a, b){
        return a.value * 100 - b.value * 100;
      });
      var r = {};
      for(var i in s)
        r[s[i].key] = s[i].value;
      return r;
    },
    objSortKeyDate: function(obj, rev){
      rev = rev || false;
      if(true == rev) rev = -1;
      else            rev = 1;

      var s = [];
      for(var i in obj)
        s.push({date: i, value: obj[i]});
      s.sort(function(a, b){
        var c = new Date(a.date);
        var d = new Date(b.date);
        return rev*c - rev*d;
      });
      var r = {};
      for(var i in s)
        r[s[i].date] = s[i].value;
      return r;
    },
    objSortKeyString: function(obj, rev){
      rev = rev || false;
      if(true == rev) rev = -1;
      else            rev = 1;

      var s = [];
      for(var i in obj)
        s.push({key: i, value: obj[i]});
      s.sort(function(a, b){
        var A = a.key, B = b.key;
        if('string' == typeof A)
          A = A.toLowerCase();
        if('string' == typeof B)
          B = B.toLowerCase();
        if(A < B)
          return -1*rev;
        else if(A > B)
          return 1*rev;
        else
          return 0;
      });
      var r = {};
      for(var i in s)
        r[s[i].key] = s[i].value;
      return r;
    },
    objSortString: function(r, rev){
      rev = rev || false;
      if(true == rev) rev = -1;
      else            rev = 1;
      var s = [];
      for(var i in r)
        s.push({key: i, value: r[i]});
      s.sort(function(a, b){
        var A = a.value, B = b.value;
        if('string' == typeof A)
          A = A.toLowerCase();
        if('string' == typeof B)
          B = B.toLowerCase();
        if(A < B)
          return -1*rev;
        else if(A > B)
          return 1*rev;
        else
          return 0;
      });
      var r = {};
      for(var i in s)
        r[s[i].key] = s[i].value;
      return r;
    },
    objSortByCol: function(r, col, type){
      if (col === false)
        return r;
      if({} == r)
        return r;
      type = type || 'ask';
      var val;
      var s = [];
      for(var i in r){
        s.push(r[i]);
        val = r[i][col];
      }
      if('ask' == type){
        if(this.isFloat(val) || this.isInt(val)){
          s.sort(function(a, b){
            return +a[col] - (+b[col]);
          });
        } else if(this.isDate(val)){
          s.sort(function(a, b){
            var c = new Date(a[col]);
            var d = new Date(b[col]);
            return c - d;
          });
        } else{
          s.sort(function(a, b){
            var A = a[col];
            var B = b[col];
            if(A < B)
              return -1;
            else if(A > B)
              return 1;
            else
              return 0;
          });
        }
      } else{
        if(this.isFloat(val) || this.isInt(val)){
          s.sort(function(a, b){
            return +b[col] - (+a[col]);
          });
        } else if(this.isDate(val)){
          s.sort(function(a, b){
            var c = new Date(a[col]);
            var d = new Date(b[col]);
            return d - c;
          });
        } else{
          s.sort(function(a, b){
            var A = a[col];
            var B = b[col];
            if(A < B)
              return 1;
            else if(A > B)
              return -1;
            else
              return 0;
          });
        }
      }
      return s;
    },
    formatteDate: function(date){
      return moment(date).format('L');
//            return new Date(date).toLocaleDateString();
    },
    formatteDateTime: function(date){
      return moment(date).format('L') + ' ' + moment(date).format('LTS');
//            return new Date(date).toLocaleString();
    },
    formatteTime: function(date){
      return moment(date).format('LTS');
//            return new Date(date).toLocaleTimeString();
    },
    isFloat: function(v){
      if(isNaN(+v))
        return false;
      if(0 < (v + '').indexOf('.'))
        return true;
      return false;
    },
    isInt: function(v){
      if(isNaN(+v))
        return false;
      if(0 < (v + '').indexOf('.'))
        return false;
      return true;
    },
    isDate: function(v){
      var r = Date.parse(v);
      if(isNaN(r))
        return false;
      return true;
    },
    isset: function(v){
      return 'undefined' != typeof v;
    },
    concatObj: function(){
      var res = {};
      for(var i = 0; i < arguments.length; i++){
        if('object' == typeof arguments[i]){
          for(var j in arguments[i]){
            res[j] = arguments[i][j];
          }
        }
      }
      return res;
    },
    serializeObject: function(el){
      var o = {};
      var a = el.serializeArray();
      $.each(a, function(){
        if(o[this.name] !== undefined){
          if(!o[this.name].push){
            o[this.name] = [o[this.name]];
          }
          o[this.name].push(this.value || '');
        } else{
          o[this.name] = this.value || '';
        }
      });
      return o;
    },
    getMaxKey: function(obj){
      var m = 0;
      for(var i in obj)
        m = (+i > m) ? +i : m;
      return m;
    },
    revert: function(obj){
      var res = {};
      for(var i in obj){
        for(var j in obj[i]){
          if(!this.isset(res[obj[i][j]])) res[obj[i][j]] = +i;
          if(i > res[obj[i][j]]) res[obj[i][j]] = +i;
        }
      }
      return res;
    },
    in_array: function(needle, haystack, strict){
      var found = false, key, strict = !!strict;
      for(key in haystack){
        if((strict && haystack[key] === needle) || (!strict && haystack[key] == needle)){
          found = true;
          break;
        }
      }
      return found;
    },
    array_last: function(arr){
      if(arr instanceof window.Array)
        return arr[arr.length - 1];
      else
        return null;
    },
    obj_last: function(obj, key){
      key = key || false;
      if(obj instanceof window.Object){
        for(var i in obj) ;
        return (key) ? i : obj[i];
      }else
        return null;
    },
    obj_last_key: function(obj){
      return this.obj_last(obj, true);
    },
    cutObj: function(obj, num){
      var res = {};
      var n = 0;
      for(var i in obj){
        if(n >= num)
          return res;
        res[i] = obj[i];
        n++;
      }
      return res;
    },
    clone: function($obj){
      if($obj === null || typeof $obj !== 'object'){
        return $obj;
      }

      var temp = $obj.constructor(); // give temp the original obj's constructor
      for(var key in $obj){
        temp[key] = this.clone($obj[key]);
      }

      return temp;
    },
    obj_length: function(obj){
      return Object.keys(obj).length;
    },
    str_find: function(str, needle){
      return (-1 == str.indexOf(needle)) ? false : str.indexOf(needle);
    },
    is_needed: function(item,p,cond){ // по типу MongoDB.find(), за исключением что спец символы что описаны далее
      cond = cond || 'AND';
      var m = 0, r = false, t = 0;
      var l = this.obj_length(p);
      for(var i in p){ // i это название поля или спец символ || если не спец символ - то это &&,
        // p[i] - это либо значение тогда это ==, либо объект, где ключ это спец символ а значение это знчение,
        // но для спец символа || - это означает in должен быть масив и ==
        // если  объект имеет несколько итемов - то это значит что И между условиями
        if('||' == i)
          m += ((this.is_needed(item, p[i], 'OR')) ? 1 : 0);
//        else if('&&' == i)
//          m += ((this.is_needed(item, p[i], 'AND')) ? 1 : 0);
        else if('object' == typeof p[i]){
          var tl = this.obj_length(p[i]);
          t = 0;
          for(var j in p[i]){ // j - это символ указывающий на сравнение (<, <=, ==, !=, >, >=) либо спец символ ||
            if('||' == j){
              if('object' != typeof p[i][j]) throw 'Ractive.helper.is_needed var '+i+' values should be an array';
              var on = 0;
              for(var k in p[i][j]){
                on = ((p[i][j][k] == item[i]) ? 1 : on);
              }
              t += on;
            } else if(this.in_array(j, ['<', '<=', '==', '!=', '>', '>='])){
              t += ((eval(p[i][j]+j+item[i])) ? 1 : 0);
            } else throw 'Ractive.helper.is_needed var '+i+' have unknow operator '+j;
          }
          m += ((tl == t) ? 1 : 0);
        } else
          m += ((p[i] == item[i]) ? 1 : 0);
      }

      if('AND' == cond)
        r = l == m;
      else if('OR' == cond)
        r = !!m;

      return r;
    },
    clear_key: function(v){
      return (v+'').replace(/\./,',');
    },
    unclear_key: function(v){
      return (v+'').replace(/,/,'.');
    },
    redirect: function(url, data, method, target){
      if('string' == typeof target) target = " target='"+target+"'";
      if('string' != typeof method) method = "GET";
      var str = '';
      str += "<form action='"+url+"' method='"+method+"' name='frm' "+target+">";
      for(var i in data) {
          str += "<input type='hidden' name='"+i+"' value='"+data[i]+"'>";
      }
      str += "</form>";
      var formElement = $(str);
      $('body').append(formElement);
      $(formElement).submit();
    },
  };
})(jQuery, Ractive);
