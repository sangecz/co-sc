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
                opacity: 0.90,
                position: "fixed",
                padding: "7px",
                "text-align": "center",
                width: "270px",
                left: ($(window).width() - 284)/2,
                "z-index": 10,
                top: $(window).height()/2 })
            .appendTo( $.mobile.pageContainer ).delay( 1500 )
            .fadeOut( 400, function(){
                $(this).remove();
            });
    },

    resizeElement: function (id){
        var newHeight=document.getElementById(id).contentWindow.document .body.scrollHeight;
        document.getElementById(id).height= (newHeight) + "px";
    }
};


