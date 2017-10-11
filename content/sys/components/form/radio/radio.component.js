var FormRadio = Ractive.extend({
//    dependencies:{
//        components:[],
//        elements:[],
//    },
    data:function(){
        return {
            position_help:'top',
            help_anim:'fade'
        };
    },
    oninit: function (options) {

    },
    oncomplete: function(){
        jQuery('.radiob').styler({selectSearch: true});
    },
});