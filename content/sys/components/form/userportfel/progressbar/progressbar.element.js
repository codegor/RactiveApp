var FormUserportfelProgressbar = Ractive.extend({
  class: 'FormUserportfelProgressbar',
  data: function () {
    return {
      title: _e('', this.class),
      subtitle: _e('', this.class),
      palette: 'orange', // or 'blue' or 'grey' or 'lime'
      total_sum: 0,
      total_num: 0,
      paid_num: 0,
      active_num: 0,
      overdue_num: 0,

      paid_percent: 0,
      active_percent: 0,
      overdue_percent: 0,

      formatData: function (str, digits) {
        var num = parseFloat(str);
        return (isNaN(num) ? '' : num.toFixed(digits));
      },
      _e: function(t){
        return _e(t, this.class);
      },
    }
  },

  oninit: function (options) {
  },
  oncomplete: function () {
    var total_num = parseInt(this.get('total_num'), 10);
    var paid_num = parseInt(this.get('paid_num'), 10);
    var active_num = parseInt(this.get('active_num'), 10);
    var overdue_num = parseInt(this.get('overdue_num'), 10);

    if (total_num > 0) {
      var paid_percent = (paid_num / total_num * 100).toFixed(0);
      var active_percent = (active_num / total_num * 100).toFixed(0);
      var overdue_percent = (overdue_num / total_num * 100).toFixed(0);
    } else {
      var paid_percent = '0';
      var active_percent = '0';
      var overdue_percent = '0';
    }

    this.set({
      total_num: total_num,
      paid_percent: paid_percent,
      active_percent: active_percent,
      overdue_percent: overdue_percent,
    });
  },
});
