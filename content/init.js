// lanch ractive app--------------------------------------------------
(function ($, Ractive) {
    $(document).ready(function () {
        moment.locale(_e('lang'));
        Ractive.requireSysPart({name: 'app', src: 'app'});
    });
})(jQuery, Ractive);
//console.log = function(){};
Ractive.DEBUG = false;
// ---------------other scripts----------------------------------------
