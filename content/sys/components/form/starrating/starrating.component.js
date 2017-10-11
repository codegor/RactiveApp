var FormStarrating = Ractive.extend({
  class: 'FormStarrating',
  myRating: null,
  data: function(){
    return {
      rating_value: 0,    // 0: no rating; 1-5: rating is 1...5
      isMutable: true,    // can be the rating changeable or not
      needTextRate: true, // should be a text rating added on the right or not
      _e: function(t){
        return _e(t, this.class);
      }
    };
  },
  oninit: function(){
    var obj = this;
    this.on({
    });
  },
  onrender: function(){
  },
  oncomplete: function(){
    this.init_star_rating();
    this.myRating = rating(
      this.find('#starrating-container'), // element to place the widget in
      this.get('rating_value'),           // currentRating
      5,                                  // maxRating
      this.starrating_cb.bind(this)       // callback
    );
    if (this.get('needTextRate')) {
      document.getElementById('c-rating__text').innerText =
        this.textRates[this.get('rating_value')];
    }
  },

  textRates: [
    _e('No rating', this.class),
    _e('Awful', this.class),
    _e('Bad', this.class),
    _e('So-so', this.class),
    _e('Good', this.class),
    _e('Excellent', this.class),
  ],
  starrating_cb: function (rating) {
    this.set('rating_value', rating);
    if (this.get('needTextRate')) {
      document.getElementById('c-rating__text').innerText = this.textRates[rating];
    }
  },

  // License
  // Copyright © 2015, Nick Salloum
  // Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
  // The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
  // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
  // See more at https://github.com/callmenick/five-star-rating
  init_star_rating: function () {
    'use strict';

    var isMutable = this.get('isMutable');
    var needTextRate = this.get('needTextRate');

    /**
     * rating
     * @description The rating component.
     * @param {HTMLElement} el The HTMl element to build the rating widget on
     * @param {Number} currentRating The current rating value
     * @param {Number} maxRating The max rating for the widget
     * @param {Function} callback The optional callback to run after set rating
     * @return {Object} Some public methods
     */
    function rating(el, currentRating, maxRating, callback) {
      /**
       * stars
       *
       * @description The collection of stars in the rating.
       * @type {Array}
       */
      var stars = [];
      /**
       * init
       *
       * @description Initializes the rating widget. Returns nothing.
       */
      (function init() {
        if (!el) { throw Error('No element supplied.'); }
        if (!maxRating) { throw Error('No max rating supplied.'); }
        if (!currentRating) { currentRating = 0; }
        if (currentRating < 0 || currentRating > maxRating) { throw Error('Current rating is out of bounds.'); }

        var ul_el = document.createElement('ul');
        ul_el.classList.add('c-rating');
        el.appendChild(ul_el);

        for (var i = 0; i < maxRating; i++) {
          var star = document.createElement('li');
          star.classList.add('c-rating__item');
          star.setAttribute('data-index', i);
          if (i < currentRating) { star.classList.add('is-active'); }
          ul_el.appendChild(star);
          stars.push(star);
          if (isMutable) {
            attachStarEvents(star);
            star.classList.add('c-rating__item-mutable');
          }
        }

        if (needTextRate) {
          var star = document.createElement('li');
          star.setAttribute('id', 'c-rating__text');
          ul_el.appendChild(star);
        }
      })();
      /**
       * iterate
       *
       * @description A simple iterator used to loop over the stars collection.
       *   Returns nothing.
       * @param {Array} collection The collection to be iterated
       * @param {Function} callback The callback to run on items in the collection
       */
      function iterate(collection, callback) {
        for (var i = 0; i < collection.length; i++) {
          var item = collection[i];
          callback(item, i);
        }
      }
      /**
       * attachStarEvents
       *
       * @description Attaches events to each star in the collection. Returns
       *   nothing.
       * @param {HTMLElement} star The star element
       */
      function attachStarEvents(star) {
        starMouseOver(star);
        starMouseOut(star);
        starClick(star);
      }
      /**
       * starMouseOver
       *
       * @description The mouseover event for the star. Returns nothing.
       * @param {HTMLElement} star The star element
       */
      function starMouseOver(star) {
        star.addEventListener('mouseover', function(e) {
          iterate(stars, function(item, index) {
            if (index <= parseInt(star.getAttribute('data-index'))) {
              item.classList.add('is-active');
            } else {
              item.classList.remove('is-active');
            }
          });
        });
      }
      /**
       * starMouseOut
       *
       * @description The mouseout event for the star. Returns nothing.
       * @param {HTMLElement} star The star element
       */
      function starMouseOut(star) {
        star.addEventListener('mouseout', function(e) {
          if (stars.indexOf(e.relatedTarget) === -1) {
            setRating(null, false);
          }
        });
      }
      /**
       * starClick
       *
       * @description The click event for the star. Returns nothing.
       * @param {HTMLElement} star The star element
       */
      function starClick(star) {
        star.addEventListener('click', function(e) {
          e.preventDefault();
          setRating(parseInt(star.getAttribute('data-index')) + 1, true);
        });
      }
      /**
       * setRating
       *
       * @description Sets and updates the currentRating of the widget, and runs
       *   the callback if supplied. Returns nothing.
       * @param {Number} value The number to set the rating to
       * @param {Boolean} doCallback A boolean to determine whether to run the
       *   callback or not
       */
      function setRating(value, doCallback) {
        if (value && value < 0 || value > maxRating) { return; }
        if (doCallback === undefined) { doCallback = true; }

        currentRating = value || currentRating;

        iterate(stars, function(star, index) {
          if (index < currentRating) {
            star.classList.add('is-active');
          } else {
            star.classList.remove('is-active');
          }
        });

        if (callback && doCallback) { callback(getRating()); }
      }
      /**
       * getRating
       *
       * @description Gets the current rating.
       * @return {Number} The current rating
       */
      function getRating() {
        return currentRating;
      }
      /**
       * Returns the setRating and getRating methods
       */
      return {
        setRating: setRating,
        getRating: getRating
      };
    }

    window.rating = rating;
  },
});
