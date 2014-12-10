/**
 * Created by sange on 11/21/14.
 */

var util = {
    UNDEF : 'undefined',
    CURRENT_ITEM_ID: 'CURRENT_ITEM_ID',
    storage: window.localStorage,

    backTransOpt : {
        transition: 'slide',
        reverse: true
    },

    transOpt : {
        transition: 'slide'
    },

    toast : function(msg){
        $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><b>"+msg+"</b></div>")
            .css({ display: "block",
                "background-color": 'white',
                opacity: 1.0,
                position: "fixed",
                padding: "7px",
                "text-align": "center",
                width: "270px",
                left: ($(window).width() - 284)/2,
                "z-index": 10,
                top: 3*$(window).height()/4 })
            .appendTo( $.mobile.pageContainer ).delay( 2000 )
            .fadeOut( 400, function(){
                $(this).remove();
            });
    },

    checkConnection : function () {
        var networkState = navigator.connection.type;

        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'No network connection';

        alert('Connection type: ' + states[networkState]);

    },

    isOnline : function () {
        //var networkState = navigator.connection.type;

        //if(networkState != Connection.UNKNOWN && networkState != Connection.NONE) {
        //    return true;
        //}
        //return false;
        return true
    }

};


