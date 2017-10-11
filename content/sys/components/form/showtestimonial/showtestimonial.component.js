var FormShowtestimonial = Ractive.extend({
  class: 'FormShowtestimonial',
  data: function(){
    return {
      isOwner: true,
      feedback: {
        comment_id: '00000',
        shot_user_data: {
          name: 'noname',
          foto: '',
        },
        like: { UP:'0', DOWN: '0' },
        orders: ['000000000'],
        rating: '0',
        rating_date: '0000-00-00 00:00:00',
        comment: 'No text',
        answer: '',
        spam: '0',
        author_user_id: '000000',
      },
      target_user_name: 'noname 2',

      isReply: false,
      showReply: false,
      id_icon_style: app_helper.getTestimonialIcon(),
      isSpam: false,

      _e: function(t){
        return _e(t, this.class);
      }
    };
  },
  oninit: function(){
    var obj = this;
    this.on({
      toggle_show_reply: function(){
        this.toggle('showReply');
        return false;
      },
      spam_cbox_changed: function () {
        var isSpam = this.get('isSpam');
        var question = isSpam ? 'Is it spam?' : 'Is it NOT spam?';
        if (confirm(question)) {
          this.set('feedback.spam', this.get('isSpam') ? '1' : '0');
        } else {
          this.toggle('isSpam');
        }
      },

      send_reply: function(){
        var answer = this.get('feedback.answer');
        if (!answer) {
          Ractive.app.alert(_e('Your reply is empty. Please type in something', this.class), 'danger');
          return false;
        }
        if (answer.length > 300) {
          Ractive.app.alert(_e('Your reply is larger than 300 symbols. Please shorten it', this.class), 'danger');
          return false;
        }

        var data = {};
        data.comment_id = this.get('feedback.comment_id');
        data.message = answer;
        console.log('My reply to a feedback = %o', data);
        var req = {
          request: JSON.stringify({
            created_id: {
              save: { answer: data },
              target: 'User_rating'
            }
          })
        };
/*
        Ractive.apiRequest('Api', req, 'POST').then(function (a) {
          if (typeof a.created_id === 'string') {
            Ractive.app.alert(a.created_id, 'danger');
          }
          if (a.created_id.answer && typeof a.created_id.answer === 'string') {
            Ractive.app.alert(a.created_id.answer, 'danger');
          }

          if (a.created_id.answer && a.created_id.answer.status &&
              a.created_id.answer.status === 'success') {
            Ractive.app.alert(_e('Your reply was sent', this.class), 'success');
            this.set('isReply', true);
          }
        });
*/
            this.set('isReply', true);

        return false;
      },

    });
  },
  onrender: function(){
  },
  oncomplete: function(){
    var answer = this.get('feedback.answer');
    var spam = this.get('feedback.spam');
    this.set({
      isReply: (typeof answer === 'string' && answer.length > 0),
      isSpam: (spam === '0' ? false : true),
    });
  },

  transitions: {
    fade: function (t, params) {
      var DEFAULTS = {
        delay: 0,
        duration: 300,
        easing: 'linear',
      };
      params = t.processParams(params, DEFAULTS);

      var targetOpacity;
      if (t.isIntro) {
        targetOpacity = t.getStyle('opacity');
        t.setStyle('opacity', 0);
      } else {
        targetOpacity = 0;
      }
      t.animateStyle('opacity', targetOpacity, params).then(t.complete);
    },
  },
});
