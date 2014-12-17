"use strict";

var page = {
    INDEX: "index",
    ENTERPIN: "enterpin",
    OVERVIEW: 'page_overview',
    PROTOCOLS: 'page_protocols',
    PROTOCOLS_EDIT: 'page_protocols_edit',
    SCRIPTS: 'page_scripts',
    SCRIPTS_EDIT: 'page_scripts_edit',
    SETTINGS: 'page_settings'

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

    },

    onBackKeyDown: function () {

        if($.mobile.activePage.attr('id') == page.INDEX || $.mobile.activePage.attr('id') == page.ENTERPIN) {

            navigator.app.exitApp();

        } else if($.mobile.activePage.attr('id') == page.OVERVIEW
            || $.mobile.activePage.attr('id') == page.SCRIPTS
            || $.mobile.activePage.attr('id') == page.PROTOCOLS
            || $.mobile.activePage.attr('id') == page.SETTINGS) {

            $.mobile.changePage($('#' + page.INDEX), util.backTransOpt);

        } else if($.mobile.activePage.attr('id') == page.SCRIPTS_EDIT) {

            $.mobile.changePage($('#' + page.SCRIPTS), util.backTransOpt);

        } else if($.mobile.activePage.attr('id') == page.PROTOCOLS_EDIT) {
            console.log('onbackHW PROTOCOLS_EDIT');
            protocol.onBack();

        } else {
            history.back();
        }
    },

    onPauseApp : function() {
        if (secStorage.instance != null && secStorage.instance != util.UNDEF){
            secStorage.instance.removePass();
            secStorage.instance = util.UNDEF;
        }
    },

    onResumeApp : function() {
        setTimeout(function(){

            $( "#unlock_hedline" ).html('Unlock app');
            $( "#submit_pin" ).html('Unlock');
            $('#enterpin_pin').val('');
            $.mobile.changePage($('#' + page.ENTERPIN), util.backTransOpt);
        }, 0);
    },
    onDeniedAccess : function () {
        util.toast('You must enter passphrase first.');
        app.onResumeApp();
    }
};

app.initialize();

/** based on: http://www.sitepoint.com/basic-jquery-form-validation-tutorial/ */
(function($,W,D) {
    var JQUERY4U = {};

    JQUERY4U.UTIL =
    {
        setupFormValidation: function()
        {
            $('#enterpin_form').validate({
                rules: {
                    enterpin_pin: {
                        required: true,
                        minlength: 6
                    }
                },
                messages: {
                    enterpin_pin: {
                        required: "Please enter your passphrase.",
                        minlength: $.validator.format("At least {0} characters required!")
                    }
                },
                submitHandler: function(form) {
                    secStorage.submitPass($('#enterpin_pin').val());

                    settings.ws.load();

                    if(settings.ws.storageObject) {
                        if(settings.ws.storageObject.url) {
                            restConn.init(settings.ws.storageObject.url);
                            restConn.setApiKey(settings.ws.storageObject.apikey);
                        } else {
                            util.toast('Web Service URL not set. Go to settings.');
                        }
                    }
                }
            });
            $("#submit_pin").click(function(){
                $("#enterpin_form").submit();
                return false;
            });
        }
    };

    //when the dom has loaded setup form validation rules
    $(D).ready(function($) {

        JQUERY4U.UTIL.setupFormValidation();
    });
})(jQuery, window, document);




