var FormCheckbox = Ractive.extend({
//    dependencies:{
//        components:[],
//        elements:[],
//    },
    data: function(){
        return {
            position_help:'top',
            help_anim:'fade',
            value: false,
        };
    },
    oninit: function (options) {

    },
    onrender: function() {
        var self = this;
        self.observe('value', function() {
            setTimeout(function(){
                if (Ractive.DEBUG) console.log('FormCheckbox .checkboxb refresh');
                jQuery('.checkboxb').trigger('refresh');
            },4);
        });
    },
    oncomplete: function(){
        jQuery('.checkboxb').styler();
    },
    selectRadio: function() {
        this.toggle('value');
        this.fire('clicked', this);
    },
});