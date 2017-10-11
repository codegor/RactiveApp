/* Simple JavaScript Inheritance
* By John Resig http://ejohn.org/
* http://ejohn.org/blog/simple-javascript-inheritance/
* MIT Licensed.
*/
// Inspired by base2 and Prototype
//<editor-fold defaultstate="collapsed" desc="Clss">
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


var AppCommonMethods = Class.extend({
  getOutCame: function(m){
    var out = {};
    out.fond_psnt = 0;
    if('garant' == m.option){
      out.fond_psnt = 0;
      if(m.day <= 10)
        out.fond_psnt = 50;
      else if(m.day <= 20)
        out.fond_psnt = 45;
      else
        out.fond_psnt = 40;
    } else if('standart' == m.option)
      out.fond_psnt = 10;

    out.info_incame = m.summa * (m.prsnt / 100 * m.day);
    out.info_outcame = out.info_incame * (out.fond_psnt / 100);
    out.info_outcame_formated = this.comboOutcame(out.info_outcame, out.fond_psnt);
    return out;
  },
  calcInfoOrder: function(m){
    var out = {
      info_summa: 0,
      info_incame: 0,
      info_outcame: 0,
      info_resalt: 0
    }
    m.count = (parseInt(m.count)) ? parseInt(m.count) : 1;
    m.summa = parseFloat(m.summa) * m.count;
    m.day = parseFloat(m.day);
    m.prsnt = parseFloat(m.prsnt);

    var r = this.getOutCame(m);
    out.info_incame = r.info_incame;
    out.info_outcame = r.info_outcame;

    if('invest' == m.type){
      out.info_summa = m.summa;
      out.info_resalt = m.summa + out.info_incame - out.info_outcame;
      out.info_outcame = r.info_outcame_formated;
    } else if('credit' == m.type){
      out.info_summa = m.summa + out.info_incame;
      out.info_incame = (m.currency && m.currency.sum) ? m.currency.sum : 0;
      out.info_outcame = (m.max_day_credit_summ) ? m.max_day_credit_summ : 0;
    }

    return out;
  },
  comboOutcame: function(outcame, pst){
    return Ractive.helper.beautyFloat(outcame) + " (" + pst + "%)";
  },
  countDayToNow: function(date){
    return Math.floor((moment() - moment(date)) / (1 * 24 * 60 * 60 * 1000));
  },
  sertificateSumm: function(o){
    if(null == o.date_kontract)
      return o.summa;
    var days = this.countDayToNow(o.date_kontract);
    return o.summa * (1 + (0.00065 * days));
  },
  getMiddle:function(type){ // day, psnt, sum
    if('undefined' == typeof type) return 0;
    var min = _wtauth_params[type+'_min'], max = _wtauth_params[type+'_max'], step = _wtauth_params[type+'_step'];
    var body = max - min;
    var middle = Math.floor(body / step / 2)*step + min;
    return Math.round(middle*1000)/1000;
  },
  // "daysToHours" should return only hours for "debit-coin" currency in Lend-Issue pro
  daysToHours: function (bill, payment, time, id) {
      if (typeof bill !== 'string' || typeof payment !== 'string' || typeof time !== 'string') {
        console.error('Error in helper.js#daysToHours: id='
          + id + ', bill=' + bill + ', payment=' + payment + ', time=' + time);
        return 'error';
      }
      if (bill !== 'debit-coin') return time;
      if (payment === 'hourly_invest') return time;
      // return String(parseInt(time, 10) * 24);
      return time; // this's a temporary workaround, it'll be modified in the future
  },
  calcOutcomeToCurrentMinute: function (summa, percentPerDay, date) {
    // Check arguments
    var startSumma = parseFloat(summa);
    if (!startSumma) {
      // console.trace();
      console.error('Error in helper.js#calcOutcomeToCurrentMinute: bad summa = ' + summa);
      return 'Err1';
    }
    var percent = parseFloat(percentPerDay);
    if (!percent) {
      // console.trace();
      console.error('Error in helper.js#calcOutcomeToCurrentMinute: bad percentPerDay = ' + percentPerDay);
      return 'Err2';
    }
    var startTime = new Date(date);
    if (date === '' || !startTime.getFullYear()) {
      // console.trace();
      console.error('Error in helper.js#calcOutcomeToCurrentMinute: bad date = ' + date);
      return 'Err3';
    }

    var oneMinuteSumm = startSumma * (percent / 100 ) / 24 / 60;

    // var totalMinutes = Math.floor((Date.now() - startTime) / 60 / 1000);
    // var totalMinutes = Math.floor((moment.utc() - moment.utc(date)) / 60 / 1000);
    var totalMinutes = this.calcTimeInMinutes(date);

    return (totalMinutes * oneMinuteSumm).toFixed(2);
  },
  calcOutcomeToDate: function (summa, percentPerDay, startDate, endDate) {
    if (endDate < startDate) {
      console.error('Error in helper.js#calcOutcomeToDate: incorrect date range');
      return 'Error';
    }
    var res = summa * percentPerDay / 100 *
      (moment.utc(endDate) - moment.utc(startDate)) / 1000 / 60 / 60 / 24;
    return res;
  },
  calcTimeInMinutes: function (date) {
    var serverUtcMinutesDiff = 0;
    if (typeof ApiPayInfo !== 'undefined' && ApiPayInfo.fields && ApiPayInfo.fields.serverUtcTimeDiff) {
      serverUtcMinutesDiff = ApiPayInfo.fields.serverUtcTimeDiff * 60; // transform into minutes
    }
    // return Math.floor((Date.now() - new Date(date)) / 60 / 1000);
    return Math.floor((moment.utc() - moment.utc(date)) / 60 / 1000) - serverUtcMinutesDiff;
  },
  isCreditOnDemand: function (bonus, type) {
    return (bonus === 'arbitrage' && type === 'invest');
  },
  isMicroLoan: function (bonus, type) {
    return (bonus === 'arbitrage' && type === 'credit');
  },
  isGuaranteeBorrowed: function (bonus, type) {
    return (bonus === 'garantee' && type === 'credit');
  },
  isGuaranteeIssued: function (bonus, type) {
    return (bonus === 'garantee' && type === 'invest');
  },
  isGuarantee: function (bonus) {
    return (bonus === 'garantee');
  },

  getOrderDType: function (state, bonus, type, option, account_type) {
    var res = { name: '', style: '' };
    var baseStyle = 'background: url(' + Ractive.pathApp +
      'order/list/item/parts/icon/' + 'assets/img/icons20.png)';

    if (this.isCreditOnDemand(bonus, type)) {
      res.name = 'Credit on Demand';
      res.style = baseStyle + ' 94px -26px repeat-x;';
      return res;
    }
    if (this.isMicroLoan(bonus, type)) {
      res.name = 'Microloan';
      res.style = baseStyle + ' 22px -2px repeat-x;';
      return res;
    }
    if (this.isGuaranteeBorrowed(bonus, type)) {
      res.name = 'Guarantee Borrowed';
      res.style = baseStyle + ' 70px -26px repeat-x;';
      return res;
    }
    if (this.isGuaranteeIssued(bonus, type)) {
      res.name = 'Guarantee Issued';
      res.style = baseStyle + ' 70px -2px repeat-x;';
      return res;
    }

    if (type === 'invest' && option === 'standart' && bonus !== 'arbitrage') { // Issued Standard
      res.name = 'Loan application';
      res.style = baseStyle + ' 46px -2px repeat-x;';
      return res;
    }
    if (type === 'credit' && option === 'standart' && bonus !== 'arbitrage') { // Borrowed Standard
      res.name = 'Guarantor application';
      res.style = baseStyle + ' 70px -2px repeat-x;';
      return res;
    }

    if (type === 'invest' && option === 'garant' &&
        bonus !== 'garantee' && bonus !== 'arbitrage') { // Issued Garant
      res.name = 'Issued';
      res.style = baseStyle + ' 0px -2px repeat-x;';
      return res;
    }
    if (type === 'credit' && option === 'garant' &&
        bonus !== 'garantee' && bonus !== 'arbitrage') { // Borrowed Garant
      res.name = 'Borrowed';
      res.style = baseStyle + ' 94px -2px repeat-x;';
      return res;
    }

    if (bonus === 'garantee' && option === 'garant' && account_type === 'giftguarant') { // Gift card
      res.name = 'Hyphae map';
      res.style = baseStyle + ' 0px -26px repeat-x;';
      return res;
    }

    return res;
  },
  getTestimonialIcon: function () {
    var res = 'background: url('+ Ractive.pathApp +
      'order/list/item/parts/icon/assets/img/icons20.png) 94px -26px repeat-x;';
    return res;
  },

});
var app_helper = new AppCommonMethods();
