(function($, Ractive){
  var cls = 'rative-app-config';
  $(document).ready(function(){
    Ractive.pathApp = _p + 'app/';
    Ractive.pathWin = _p + 'win/';
    Ractive.pathSys = _p + 'sys/';
    Ractive.pathApi = _p + 'api/';
    Ractive.pathDBViews = _u + '?action=getDBTemplate&templ=';

    Ractive.templateAsset = ['css']; //, 'js'
    Ractive.templateExt = 'html';
    Ractive.templateModel = 'model.js';
    Ractive.templateElement = 'element.js';
    Ractive.templateComponent = 'component.js';
    Ractive.componentsDir = 'components';
    Ractive.DEBUG_APP_LOAD_ELEMENTS = false;
    Ractive.apiError = _e('API Error. Maybe session expired. Please try relogin again.', cls);

    Ractive.components['api-loader'] = Ractive.extend({
      template: '<div class="api-request" style="width: {{cont}}px;"><div id="block_1" class="barlittle" style="width: {{height}}px; height: {{width}}px; margin-left: {{margin}}px;"></div><div id="block_2" class="barlittle" style="width: {{height}}px; height: {{width}}px; margin-left: {{margin}}px;"></div><div id="block_3" class="barlittle" style="width: {{height}}px; height: {{width}}px; margin-left: {{margin}}px;"></div><div id="block_4" class="barlittle" style="width: {{height}}px; height: {{width}}px; margin-left: {{margin}}px;"></div><div id="block_5" class="barlittle" style="width: {{height}}px; height: {{width}}px; margin-left: {{margin}}px;"></div></div>',
      data: function(){
        return {
          size: 1
        };
      },
      computed: {
        height: '10 * ${size}',
        width: '10 * ${size}',
        margin: '5 * ${size}',
        cont: '75 * ${size}',
      }
    });
    Ractive.components['loader'] = Ractive.extend({template: '<div class="loader"><div id="loader_content"><span class="expand"></span></div></div>'});
    Ractive.alert = new Ractive({
      template: '<alert type="{{type}}" closable="true">{{mess}}</alert>',
      data: {type: '', mess: ''}
    });
    Ractive.alertx = new Ractive({
      template: '<alert type="{{type}}" closable="true">{{{mess}}}</alert>',
      data: {type: '', mess: ''}
    });

    Ractive.events.enter = function(node, fire){
      var keydownHandler = function(event){
        var which = event.which || event.keyCode;
        if(which === 13){
          fire({node: node, original: event});
        }
      };

      node.addEventListener('keydown', keydownHandler);

      return {
        teardown: function(){
          node.removeEventListener('keydown', keydownHandler);
        }
      };
    };
  });
})(jQuery, Ractive);
