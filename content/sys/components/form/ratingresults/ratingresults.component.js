var FormRatingresults = Ractive.extend({
  class: 'FormRatingresults',
  data: function(){
    return {
      rate_by_star: { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 }, // number of rate_by_star
      RATE_BY_STAR_LENGTH: 5,
      total: 0,
      percents: [0, 0, 0, 0, 0], //  for 5,4,3,2,1 stars respectively
      average: 0,
      starsNum: 0,
      _e: function(t){
        return _e(t, this.class);
      }
    };
  },
  oninit: function(){
    var obj = this;
    this.on({
      // clicked: function(){
      //   return false;
      // },
    });
    this.observe('rate_by_star', this.recalcParams);
  },
  onrender: function(){
  },
  oncomplete: function(){
    this.recalcParams();
  },
  recalcParams: function () {
    var rate_by_star = this.get('rate_by_star');

    // Remove "null" and "undefined" cases. Transform to integers. Remove wrong data
    for (var k in rate_by_star) {
      if (!rate_by_star[k]) {
        rate_by_star[k] = 0;
      } else {
        rate_by_star[k] = parseInt(rate_by_star[k], 10);
        if (!rate_by_star[k]) {
          rate_by_star[k] = 0;
        }
      }
    }

    var total = 0;
    var isZero = false;
    for (var k in rate_by_star) {
      total += rate_by_star[k];
    }
    if (total === 0) {
      total = 1; // No division by 0
      isZero = true;
    }

    var percents = [0, 0, 0, 0, 0]; //  for 5,4,3,2,1 stars respectively
    var len = this.get('RATE_BY_STAR_LENGTH');
    for (var k = 0; k < len; k++) {
      percents[k] = Math.round(rate_by_star['' + (5 - k)] / total * 100);
    }

    var average = 0;
    for (var k in rate_by_star) {
      average += rate_by_star[k] * parseInt(k, 10);
    }
    average = average / total;

    if (isZero) total = 0;

    this.set({
      total: total,
      percents: percents,
      average: average.toFixed(1),
      starsNum: Math.round(average),
    });
  },
});
