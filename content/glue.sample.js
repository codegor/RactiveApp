(function ($, Ractive) {
  $(document).ready(function () {
    Ractive.appGlue = {
      path: '_glued/app/',
      js: 'scripts.js',
      css: 'style.css',
      html: 'templates.html',
    };
  });
})(jQuery, Ractive);