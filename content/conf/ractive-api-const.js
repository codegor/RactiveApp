(function ($, Ractive) {
  $(document).ready(function () {
    // common data api (GET reguest)
//    Ractive.Api_Info_Example_Name         = {url: 'Example_Action_url' /*or _u + 'url postfix with action'*/, type: 'info'};

    // personal data api (POST request)
//    Ractive.Api_Post_Info_Example_Name    = {url: 'Example_Action_url' /*or _u + 'url postfix with action'*/, type: 'data', params: {}};

    // action  api
//    Ractive.Api_Action_Example_Name       = {url: 'Example_Action_url' /*or _u + 'url postfix with action'*/, type: 'action', toChange: ['Api_Info_Example_Name'/*, 'and else info action'*/]};

    // sql_api method
//    Ractive.Api                      = {url: 'Example_Action_url' /*or _u + 'url postfix with action'*/, type: 'sql_api'};

    // fields (status - exclude)
    // name:{api: "NameOfApi", path*:"dif name if need", type: "type of data: calculate, indicate, list, flag"

    Ractive.apiFields = {
//      field1: {api: 'Api_Info_Example_Name', type: "list"},
//      field2: {api: 'Api_Info_Example_Name', type: "calculate"},
//      field3: {api: 'Api_Info_Example_Name', type: "indicate"},
//      field4: {api: 'Api_Info_Example_Name', type: "flag"},
//      field5: {api: 'Api_Info_Example_Name_1', path:'name_of_param_if_field_isnot_in_root_of_answer', type: 'list'},
//      field6: {api: 'Api_Info_Example_Name_1', path:'name_of_param_if_field_isnot_in_root_of_answer', type: 'indicate'},
    };
  });
})(jQuery, Ractive);
