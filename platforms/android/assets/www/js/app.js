"use strict";

/**
 * @author Petr Marek
 * Licence Apache 2.0, see below link
 * @link http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * Pages object - constant strings with page names.
 * @type {{INDEX: string, ENTERPIN: string, OVERVIEW: string, PROTOCOLS: string, PROTOCOLS_EDIT: string, SCRIPTS: string, SCRIPTS_EDIT: string, SETTINGS: string}}
 */
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

/**
 * App object - initializes application and listeners, sets
 *
 * @type {{initialize: Function, bindEvents: Function, onDeviceReady: Function, receivedEvent: Function, onBackKeyDown: Function, onPauseApp: Function, onResumeApp: Function, initEnterPinPage: Function, onDeniedAccess: Function}}
 */
var app = {

    /**
     * Initializes application - binds events-listeners.
     */
    initialize: function() {
        this.bindEvents();

    },

    /**
     * Bind Event Listeners.
     */
    bindEvents: function() {
        document.addEventListener('deviceready', app.onDeviceReady);
    },

    /**
     * Callback for "deviceready" event.
     */
    onDeviceReady: function() {
        app.receivedEvent();
    },

    /**
     *  Called when device is ready. Adds another callbacks to listeners:
     *  onPause, onResume, onBackKeyDown
     */
    receivedEvent: function() {

        document.addEventListener("pause", this.onPauseApp);
        document.addEventListener("resume", this.onResumeApp);
        document.addEventListener("backbutton", this.onBackKeyDown);

        $("#enterpin").trigger("pagecreate");

        app.initEnterPinPage();

    },


    /**
     * Callback handles onBack key down event, It returns to an appropriate page or exits app.
     */
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

    /**
     * Callback handles onPause event, when user exits the app - it forgets entered passphrase.
     */
    onPauseApp : function() {
        if (secStorage.instance != null && secStorage.instance != util.UNDEF){
            secStorage.instance.removePass();
            secStorage.instance = util.UNDEF;
        }
    },

    /**
     * Callback handles onResume event, when user returns to the app - it requires passphrase.
     */
    onResumeApp : function() {
        setTimeout(function(){
            app.initEnterPinPage();
            $.mobile.changePage($('#' + page.ENTERPIN), util.backTransOpt);
        }, 0);
    },

    /**
     * Init Enter pin page - headline and button texts, etc.
     */
    initEnterPinPage: function(){
        var headline = '';
        var btn = '';
        if(util.storage.getItem(secStorage.HASHED_PASS_KEY) == null) {
            headline = 'Enter new passphrase';
            btn = 'Enter';
        } else {
            headline = 'Unlock app';
            btn = 'Unlock';
        }

        $( "#unlock_hedline" ).html(headline);
        $( "#submit_pin" ).html(btn);
        $('#enterpin_pin').val('');
    },

    /**
     * Function handles a situation when it seams that user did not provide passphrase.
     */
    onDeniedAccess : function () {
        util.toast('You must enter passphrase first.');
        app.onResumeApp();
    }
};

app.initialize();

/**
 * Enter pin page form validation.
 *
 * Based on tut below.
 * @link http://www.sitepoint.com/basic-jquery-form-validation-tutorial/
 */
(function($,W,D) {
    var JQUERY4U = {};

    JQUERY4U.UTIL =
    {
        /**
         * Validation defines two sections: rules and messages.
         * Both belongs to form input name.
         */
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

                /**
                 * Submits form. It submits pass checks and loads saved WS props. Then
                 * it sets REST connector, if WS props. are available.
                 *
                 * @param form
                 */
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

            /**
             * Registers onClick event to "enter pin" button to submit the form.
             */
            $("#submit_pin").click(function(){
                $("#enterpin_form").submit();
                return false;
            });
        }
    };

    $(D).ready(function($) {

        JQUERY4U.UTIL.setupFormValidation();
    });
})(jQuery, window, document);




