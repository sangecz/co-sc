/**
 * @author Petr Marek
 * Licence Apache 2.0, see below link
 * @link http://www.apache.org/licenses/LICENSE-2.0
 */


/**
 * Module: settings - corresponds wit app section Settings and it provides settings
 * for both Web Service and Monitoring tool instance. When Loading/Saving -
 * if there is no instance of secStorage, it's unauthorized access and the user will
 * be send to Enter pin (passphrase) page.
 *
 * @type {{overview: {URL_ID: string, USERNAME_ID: string, PASSWORD_ID: string, STORAGE_KEY: string, storageObject: {url: null, password: null, username: null}, save: Function, del: Function, load: Function, clearValues: Function}, ws: {URL_ID: string, USERNAME_ID: string, PASSWORD_ID: string, APIKEY_ID: string, NAME_ID: string, STORAGE_KEY: string, storageObject: {url: null, password: null, apikey: null, username: null}, save: Function, load: Function, del: Function, handleSubmit: Function, clearValues: Function, onRegistered: Function, onAuth: Function}, del: Function, save: Function, load: Function}}
 */
var settings = {

    /**
     * settings.overview object - handles monitoring tool instance
     * properties - URL and credentials.
     */
    overview : {

        URL_ID : "overview_url",
        USERNAME_ID : "overview_username",
        PASSWORD_ID : "overview_password",

        STORAGE_KEY : "overview",

        /**
         * JSON object to be stored
         */
        storageObject : {
            url : null,
            password : null,
            username : null
        },

        /**
         * Gathers strings from input forms and tries to save them in secStorage.
         */
        save : function () {
            this.storageObject = {};
            this.storageObject.url = $('#' + this.URL_ID).val();
            this.storageObject.username = $('#' + this.USERNAME_ID).val();
            this.storageObject.password = $('#' + this.PASSWORD_ID).val();

            if (secStorage.isInstanceSet()){
                if(secStorage.instance.saveToStorage(this.storageObject, this.STORAGE_KEY)) {
                    util.toast('Saved');
                }
            } else {
                app.onDeniedAccess();
            }
        },

        /**
         * Deletes stored object and dynamic object.
         */
        del : function () {
            this.clearValues();
            util.storage.removeItem(settings.overview.STORAGE_KEY);
            this.storageObject = {};
            this.storageObject.url = null;
            this.storageObject.username = null;
            this.storageObject.password = null;
        },

        /**
         * Tries to load properties to the form input fields and dynamic object.
         */
        load : function () {
            if (secStorage.isInstanceSet()) {
                this.storageObject = secStorage.instance.loadFromStorage(this.STORAGE_KEY);
                if (this.storageObject == null) {
                    this.clearValues();
                } else if (this.storageObject != null && this.storageObject.url != null
                    && this.storageObject.username != null && this.storageObject.password != null) {

                    $('#' + this.URL_ID).val(this.storageObject.url);
                    $('#' + this.USERNAME_ID).val(this.storageObject.username);
                    $('#' + this.PASSWORD_ID).val(this.storageObject.password);

                    overview.url = this.storageObject.url;
                    overview.username = this.storageObject.username;
                    overview.password = this.storageObject.password;
                }
            } else {
                app.onDeniedAccess();
            }

        },

        /**
         * Clears form input fileds.
         */
        clearValues : function(){
            $('#' + this.URL_ID).val('');
            $('#' + this.USERNAME_ID).val('');
            $('#' + this.PASSWORD_ID).val('');
        }

    },

    /**
     * settings.ws object - handles Web Service
     * properties - URL, credentials and apiKey.
     */
    ws : {

        URL_ID : "ws_url",
        USERNAME_ID : "ws_username",
        PASSWORD_ID : "ws_password",
        APIKEY_ID : "ws_apikey",
        NAME_ID : "ws_name",

        STORAGE_KEY : "ws",

        /**
         * JSON object to be stored
         */
        storageObject : {
            url : null,
            password : null,
            apikey : null,
            username : null
        },

        /**
         * Gathers strings from input forms and tries to save them in secStorage.
         */
        save : function(apiKey, url, username, password) {
            this.storageObject = {};
            this.storageObject.url = url;
            this.storageObject.username = username;
            this.storageObject.password = password;
            this.storageObject.apikey = apiKey;

            if (secStorage.isInstanceSet()) {
                if (secStorage.instance.saveToStorage(this.storageObject, this.STORAGE_KEY)) {
                    util.toast('Saved & Logged in');
                }
            } else {
                app.onDeniedAccess();
            }

        },

        /**
         * Tries to load properties to the form input fields and dynamic object.
         */
        load : function() {

            if (secStorage.isInstanceSet()) {
                this.storageObject = secStorage.instance.loadFromStorage(this.STORAGE_KEY);

                if (this.storageObject == null){
                   this.clearValues();
                } else if(this.storageObject != null && this.storageObject.url != null
                    && this.storageObject.username != null
                    && this.storageObject.apikey != null
                    && this.storageObject.password != null) {

                    $('#' + this.URL_ID).val(this.storageObject.url);
                    $('#' + this.USERNAME_ID).val(this.storageObject.username);
                    $('#' + this.PASSWORD_ID).val(this.storageObject.password);

                    restConn.setApiKey(this.storageObject.apikey);
                }
            } else {
                app.onDeniedAccess();
            }
        },

        /**
         * Deletes stored object and dynamic object.
         */
        del : function () {
            this.clearValues();
            util.storage.removeItem(settings.ws.STORAGE_KEY);
            this.storageObject = {};
            this.storageObject.url = null;
            this.storageObject.username = null;
            this.storageObject.password = null;
            this.storageObject.apikey = null;
        },

        /**
         * Handles submit - there are two situations - logging In or registering.
         * Method also initializes restConn.
         */
        handleSubmit : function() {
            var url = $('#' + settings.ws.URL_ID).val();
            var username = $('#' + settings.ws.USERNAME_ID).val();
            var name = $('#' + settings.ws.NAME_ID).val();
            var password = $('#' + settings.ws.PASSWORD_ID).val();

            if(restConn.client == '') {
                restConn.init(url);
            }
            restConn.setURL(url);

            if($('#ws_register').is(':checked')){
                // register
                restConn.register(username, password, name);
            } else {
                // login
                restConn.auth(username, password);
            }
        },

        /**
         * Clears form input fileds.
         */
        clearValues : function() {
            $('#' + this.URL_ID).val('');
            $('#' + this.USERNAME_ID).val('');
            $('#' + this.NAME_ID).val('');
            $('#' + this.PASSWORD_ID).val('');
        },

        /**
         * Callback when registration was successfully done.
         */
        onRegistered : function () {
            util.toast('Successfully registered.');
            $("#ws_hidden_name").hide();
            $("#submit_settings_ws").html('Login & Save');
            if ($('#ws_register').is(":checked")) {
                $('#ws_register').checkboxradio().prop('checked', false).checkboxradio('refresh');
            }
        },

        /**
         * Callback when the user is successfully logged In. It saves WS props.
         * These prop. stay saved until the first restart, must be loaded again though.
         *
         * @param apiKey
         * @param url
         * @param username
         * @param password
         */
        onAuth : function (apiKey, url, username, password) {
            if (apiKey != null && apiKey != '') {
                settings.ws.save(apiKey, url, username, password);
            }
        }

    },

    /**
     * Calls delete method on corresponding object. Invalidates restConn apiKey.
     */
    del : function() {
        this.overview.del();
        this.ws.del();
        restConn.setApiKey(util.UNDEF);

        $( "#dialog_delete_settings" ).popup( "close" );
    },

    save : function() {
        //$.mobile.changePage($('#' + page.INDEX), util.backTransOpt);
    },

    /**
     * Calls load methods of corresponding objects.
     * It also switches between WS and Monitoring settings sections
     * (bottom navigation bar).
     */
    load : function() {

        if (secStorage.isInstanceSet()) {
            $("#settings_content_1").show();
            $("#settings_content_2").hide();
            $('#settings_navbtn_1').addClass('ui-btn-active');
            $('#settings_navbtn_2').removeClass('ui-btn-active');

            $.mobile.changePage($('#' + page.SETTINGS), util.transOpt);
            this.overview.load();
            this.ws.load();
        } else {
            app.onDeniedAccess();
        }
    }

};

/**
 * Registration toggle handler.
 */
$('#ws_register').on('click', function() {
    if($(this).is(':checked')){
        $("#ws_hidden_name").show();
        $("#submit_settings_ws").html('Register');
    } else {
        $("#ws_hidden_name").hide();
        $("#submit_settings_ws").html('Login & Save');
    }
});

/**
 * handle navigation bar in settings.
 */
$('#settings_navbtn_1').on('click', function() {
    $("#settings_content_1").show();
    $("#settings_content_2").hide();
    $(this).addClass('ui-btn-active');
    $('#settings_navbtn_2').removeClass('ui-btn-active');
});

/**
 * handle navigation bar in settings.
 */
$('#settings_navbtn_2').on('click', function() {
    $("#settings_content_2").show();
    $("#settings_content_1").hide();
    $(this).addClass('ui-btn-active');
    $('#settings_navbtn_1').removeClass('ui-btn-active');
});

/**
 * Sets small role properties to most of UI components.
 */
$('checkbox').buttonMarkup({mini: true});
$('button').buttonMarkup({mini: true});
$('#index button').buttonMarkup({mini: false});
$('input').addClass('ui-mini');
$('textarea').addClass('ui-mini');

/**
 * Settings page form validation.
 * For more info, @see app.js.
 *
 * Based on tut below.
 * @link http://www.sitepoint.com/basic-jquery-form-validation-tutorial/
 */
(function($,W,D) {
    var JQUERY4U = {};

    JQUERY4U.UTIL =
    {
        setupFormValidation: function()
        {
            $('#settings_overview_form').validate({
                rules: {
                    overview_url: {
                        required: true,
                        url: true
                    },
                    overview_username: "required",
                    overview_password: "required"
                },
                messages: {
                    overview_url: {
                        required: "Please enter valid URL.",
                        url: "Not a valid URL."
                    },
                    overview_username: "Please enter your username.",
                    overview_password: "Please enter your password."
                },
                submitHandler: function(form) {
                    testConn.testMonitoringURL();
                }
            });
            $("#submit_settings_overview").click(function(){
                $("#settings_overview_form").submit();
                return false;
            });
        ///////////////////////////////////////////////////
            $('#settings_ws_form').validate({
                rules: {
                    ws_url: {
                        required: true,
                        url: true
                    },
                    ws_username: {
                        required: true,
                        email: true
                    },
                    ws_name: "required",
                    ws_password: "required"
                },
                messages: {
                    ws_url: {
                        required: "Please enter valid URL.",
                        url: "Not a valid URL."
                    },
                    ws_username: {
                        required: "Please enter your email.",
                        email: "Please enter a valid email."
                    },
                    ws_name: "Please enter your name.",
                    ws_password: "Please enter your password."
                },
                submitHandler: function(form) {
                    settings.ws.handleSubmit();
                }
            });
            $("#submit_settings_ws").click(function() {
                $("#settings_ws_form").submit();
                return false;
            });
        }
    };

    $(D).ready(function($) {

        JQUERY4U.UTIL.setupFormValidation();
    });
})(jQuery, window, document);