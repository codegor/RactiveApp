var _Example_ = Ractive.extend({ //name camelcase!! and first letter is uppercase
  id: '#ractive-content',
  class: '_Example_',
  create: function(template, name){
    var obj = this;
    return new Ractive.Promise(function(fulfil){
      var paralel = {
        cnt: 0,
        afterlast: function(){
          Ractive.addObj(name, {
            el: obj.id,
            template: template,
            data: {
//              _example_'s data
              _e: function(t){
                return _e(t, obj.class);
              },
            }
          });
          fulfil();
        }
      };
      Ractive.requireElement('_example_/_example_element_', paralel);

      if(Ractive.DEBUG) console.log('_example_ created');
    });
  },
  oninit: function(options){
    var obj = this;
    this.on({
//      _example_'s actions
    });

  },
  oncomplete: function(){
  },
  initApi: function(){
    var obj = this;
    Ractive.apiField('field_name_from_common_api_request', function(field){obj.set('var_in__Example__', field);}, this.class); // если нужно чтоб следило за обновлением
    Ractive.apiField('field_name_from_common_api_request').then(function(params){}); // params = {field, model, name} если нужно просто получить данные (например елемент убивается и появляется при перерисовке то этот способ)
    Ractive.apiField.fields(['field_name_from_common_api_request1','field_name_from_common_api_request2'], function(fields){ // fields = {field_name_from_common_api_request1: val1, field_name_from_common_api_request2: val2}
      obj.set('var_in__Example__', fields.field_name_from_common_api_request1 - fields.field_name_from_common_api_request2);
    }, this.class);
    Ractive.apiField.fields(['field_name_from_common_api_request1','field_name_from_common_api_request2']).then(function(fields){
//      ...
//      fields.field_name_from_common_api_request1
//      ...
//      fields.field_name_from_common_api_request2
//      ...
//    Ractive.apiField.update('field_name_from_common_api_request'); // this is for update
//    if need model itself
//    Ractive.requireApi('name_of_api_model').then(function(model){});
//    for sinhronius function having
//    Ractive.isApiLoaded('name_of_api_model') -> true|false
//    Ractive.getApiLoaded('name_of_api_model') return model
//    in model we can create function for field to get it sinchronius - 2 function - isLoaded() and getLoaded() for one field - for example - ApiPayInfo.isCurLoaded and ApiPayInfo.getCurLoaded();
    });;
  },
//      _example_'s functions
});