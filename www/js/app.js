var page = {
    INDEX: "index",
    ENTERPIN: "enterpin",
    OVERVIEW: 'page_overview',
    PROTOCOLS: 'page_protocols',
    SCRIPTS: 'page_scripts',
    SCRIPTS_EDIT: 'page_scripts_edit',
    SETTINGS: 'page_settings',
    SCRIPTS_ADD: 'page_scripts_add'

};

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();

    },
    // Bind Event Listeners
    bindEvents: function() {
        document.addEventListener('deviceready', app.onDeviceReady);
    },

    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },

    receivedEvent: function(id) {

        document.addEventListener("pause", this.onPauseApp);
        document.addEventListener("resume", this.onResumeApp);
        document.addEventListener("backbutton", this.onBackKeyDown);

        $("#enterpin").trigger("pagecreate");

        //alert(util.isOnline());
    },

    onBackKeyDown: function () {

        if($.mobile.activePage.attr('id') == page.INDEX || $.mobile.activePage.attr('id') == page.ENTERPIN) {
            navigator.app.exitApp();
        } else if($.mobile.activePage.attr('id') == page.OVERVIEW) {
            $.mobile.changePage($('#' + page.INDEX), util.backTransOpt);
        } else if($.mobile.activePage.attr('id') == page.SCRIPTS) {
            $.mobile.changePage($('#' + page.INDEX), util.backTransOpt);
        } else if($.mobile.activePage.attr('id') == page.SCRIPTS_EDIT) {
            $.mobile.changePage($('#' + page.SCRIPTS), util.backTransOpt);
        } else if($.mobile.activePage.attr('id') == page.SETTINGS) {
            $.mobile.changePage($('#' + page.INDEX), util.backTransOpt);
        }  else if($.mobile.activePage.attr('id') == page.SCRIPTS_ADD) {
                $.mobile.changePage($('#' + page.SCRIPTS), util.backTransOpt);
        } else {
            history.back();
        }
    },

    onPauseApp : function() {
        secStorage.instance.removePass();
        secStorage.instance = util.UNDEF;
    },

    onResumeApp : function() {
        setTimeout(function(){

            $.mobile.changePage($('#' + page.ENTERPIN), util.backTransOpt);
            $( "#unlock_hedline" ).html('Unlock app');
            $( "#submit_pin" ).html('Unlock');
            $('#enterpin_pin').val('');
        }, 0);
    }
};

app.initialize();




