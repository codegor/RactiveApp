(function($, Ractive){
  Ractive.validation = {
    /**
     * Validates form fields against specified rules
     * @param {Object} data -- Values of the form fields
     *  Example:
     data = {
     key1: value1,
     key2: value2,
     key3: value3, ...
     },
     * @param {Object} fieldsForValidation -- Fields to validate and validating rules:
     *  Example:
     fieldsForValidation = {
     key1: { hasError: false, errorMessage: '', validate: { required: '' } },
     key2: { hasError: false, errorMessage: '', validate: { email: '' } },
     key3: { hasError: false, errorMessage: '', validate: { min: 5, max: 100 } },
     },
     *  Available rules:
     required      --- the value means nothing (you can use any one).
     To exclude the rule just do not mention it
     emptyOrEmail  --- the value means nothing
     email         --- the value means nothing
     min           --- the value is an integer number
     max           --- the value is an integer number
     * @return {Boolean} -- It is equal "true", if the form is valid
     */
    validate: function(data, fieldsForValidation){
      var isValid = true;
      var errMessage = '';

      for(var key in fieldsForValidation){
        fieldsForValidation[key].hasError = false;
        fieldsForValidation[key].errorMessage = '';

        for(var rule in fieldsForValidation[key].validate){
          var ruleValue = fieldsForValidation[key].validate[rule];
          var isRulePassed = true;

          switch(rule){
            case 'required':
              isRulePassed = data[key].length > 0;
              if(!isRulePassed)
                errMessage = 'This field is required';
              break;
            case 'emptyOrEmail':
              if(data[key].length === 0){
                isRulePassed = true;
                break;
              }
            case 'email':
              var reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
              isRulePassed = reg.test(data[key]);
              if(!isRulePassed)
                errMessage = 'Please type in a correct email address';
              break;
            case 'min':
              isRulePassed = data[key].length >= ruleValue;
              if(!isRulePassed)
                errMessage = 'Too small text, mininal length is ' + ruleValue + ' symbols';
              break;
            case 'max':
              isRulePassed = data[key].length <= ruleValue;
              if(!isRulePassed)
                errMessage = 'No more than ' + ruleValue + ' symbols, please';
              break;
              /*
               case 'url':
               isRulePassed = ;
               break;
               */
            default:
              break;
          }

          isValid = isValid && isRulePassed;
          if(!isRulePassed){
            fieldsForValidation[key].hasError = true;
            fieldsForValidation[key].errorMessage = errMessage;
          }

        } // end of "for (var rule in fieldsForValidation[key].validate)..."
      }   // end of "for (var key in fieldsForValidation)..."

      return isValid;
    },
    /**
     * Auxiliary Function for Validation
     * >>> NOTE: at the moment this function is NOT used yet
     * Tracks when a user fixes incorrect fields
     * @param {event Object} event
     * @param {String} item -- a field to track
     * @param {String} dataObjName -- the name of data subobject in "params" or "validation" objects
     * @return {Boolean} -- It return "false" to stop the event propagation
     */
    trackValidation: function(event, item, dataObjName){
      var fieldsForValidation = this.get('validation.' + dataObjName);

      // We don't track changes when there is no validation error found yet
      var hasError = fieldsForValidation[item].hasError;
      if(!hasError){
        return false;
      }

      // If a validation error is found, then track the changes
      var data = this.get('params.' + dataObjName);
      Ractive.helper.validate(data, fieldsForValidation);
      this.set('validation.' + dataObjName, fieldsForValidation);

      return false;
    },
  };
})(jQuery, Ractive);