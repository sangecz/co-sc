var overview = {

    checkIfUrlSet: function(){
        if(typeof $("#"  + settings.overview.IFRAME_ID).attr('src') == util.UNDEF || $("#" + settings.overview.IFRAME_ID).attr('src') == "") {
            //$.mobile.changePage($('#' + page.OVERVIEW_SETTINGS), util.transOpt);
        }
    }
};