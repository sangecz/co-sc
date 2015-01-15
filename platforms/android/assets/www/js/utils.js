/**
 * @author Petr Marek
 * Licence Apache 2.0, see below link
 * @link http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * util object - collection of different helper functions.
 *
 * @type {{UNDEF: string, CURRENT_ITEM_ID: string, storage: *, backTransOpt: {transition: string, reverse: boolean}, transOpt: {transition: string}, toast: Function, toastLong: Function, checkConnection: Function, isOnline: Function}}
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

    /**
     * Android like toast positioned horizontally in the middle
     * and vertically in 3/4 down on the screen.
     * @param msg
     */
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

    /**
     * Longer Android like toast.
     * @param msg
     */
    toastLong : function(msg){
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
            .appendTo( $.mobile.pageContainer ).delay( 5000 )
            .fadeOut( 400, function(){
                $(this).remove();
            });
    },

    /**
     * Uses network-information plugin to determine network state.
     */
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

    /**
     * Checks if device is online.
     * @returns {boolean}
     */
    isOnline : function () {
        var networkState = navigator.connection.type;

        if (networkState != Connection.UNKNOWN && networkState != Connection.NONE) {
            return true;
        } else {
            util.toast('Offline. Could not proceed.');
            return false;
        }
    }

};

/**
 * Prototype; forEach loop.
 */
if (!Array.prototype.forEach)
{
    Array.prototype.forEach = function(fun)
    {
        var len = this.length;
        if (typeof fun != "function")
            throw new TypeError();

        var thisp = arguments[1];
        for (var i = 0; i < len; i++)
        {
            if (i in this)
                fun.call(thisp, this[i], i, this);
        }
    };
}


