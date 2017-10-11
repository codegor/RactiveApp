var InfoClock = Ractive.extend({
    data: function(){
        return {
//            datetime: new Date(),
            major: new Array( 12 ),
            minor: new Array( 60 )
        };
    },
//    oncomplete: function (options) {
//        var obj = this;
//        setInterval( function () {
//            obj.set( 'datetime', new Date() );
//        }, 1000 );
//    },


});