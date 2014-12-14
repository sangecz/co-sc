/**
 * Created by sange on 11/23/14.
 */

var settings = {

    overview : {

        URL_ID : "overview_url",
        USERNAME_ID : "overview_username",
        PASSWORD_ID : "overview_password",

        STORAGE_KEY : "overview",

        storageObject : {
            url : null,
            password : null,
            username : null
        },

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

        del : function () {
            this.clearValues();
            util.storage.removeItem(settings.overview.STORAGE_KEY);
            this.storageObject = {};
            this.storageObject.url = null;
            this.storageObject.username = null;
            this.storageObject.password = null;
        },

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

        clearValues : function(){
            $('#' + this.URL_ID).val('');
            $('#' + this.USERNAME_ID).val('');
            $('#' + this.PASSWORD_ID).val('');
        }

    },

    ws : {

        URL_ID : "ws_url",
        USERNAME_ID : "ws_username",
        PASSWORD_ID : "ws_password",
        APIKEY_ID : "ws_apikey",
        NAME_ID : "ws_name",

        STORAGE_KEY : "ws",

        storageObject : {
            url : null,
            password : null,
            apikey : null,
            username : null
        },

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

        del : function () {
            this.clearValues();
            util.storage.removeItem(settings.ws.STORAGE_KEY);
            this.storageObject = {};
            this.storageObject.url = null;
            this.storageObject.username = null;
            this.storageObject.password = null;
            this.storageObject.apikey = null;
        },

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

        clearValues : function() {
            $('#' + this.URL_ID).val('');
            $('#' + this.USERNAME_ID).val('');
            $('#' + this.NAME_ID).val('');
            $('#' + this.PASSWORD_ID).val('');
        },

        onRegistered : function () {
            util.toast('Successfully registered.');
            $("#ws_hidden_name").hide();
            $("#submit_settings_ws").html('Login & Save');
            if ($('#ws_register').is(":checked")) {
                $('#ws_register').checkboxradio().prop('checked', false).checkboxradio('refresh');
            }
        },

        onAuth : function (apiKey, url, username, password) {
            // stays saved until first restart, must be loaded
            if (apiKey != null && apiKey != '') {
                settings.ws.save(apiKey, url, username, password);
            }
        }

    },

    del : function() {
        this.overview.del();
        this.ws.del();
        restConn.setApiKey(util.UNDEF);

        $( "#dialog_delete_settings" ).popup( "close" );
    },

    save : function() {
        //$.mobile.changePage($('#' + page.INDEX), util.backTransOpt);
    },

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

// enable registration
$('#ws_register').on('click', function() {
    if($(this).is(':checked')){
        $("#ws_hidden_name").show();
        $("#submit_settings_ws").html('Register');
    } else {
        $("#ws_hidden_name").hide();
        $("#submit_settings_ws").html('Login & Save');
    }
});

// handle navbar in settings
$('#settings_navbtn_1').on('click', function() {
    $("#settings_content_1").show();
    $("#settings_content_2").hide();
    $(this).addClass('ui-btn-active');
    $('#settings_navbtn_2').removeClass('ui-btn-active');
});

$('#settings_navbtn_2').on('click', function() {
    $("#settings_content_2").show();
    $("#settings_content_1").hide();
    $(this).addClass('ui-btn-active');
    $('#settings_navbtn_1').removeClass('ui-btn-active');
});

$('checkbox').buttonMarkup({mini: true});
$('button').buttonMarkup({mini: true});
$('#index button').buttonMarkup({mini: false});
$('input').addClass('ui-mini');
$('textarea').addClass('ui-mini');

/** based on: http://www.sitepoint.com/basic-jquery-form-validation-tutorial/ */
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
                        settings.overview.save();
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

    //when the dom has loaded setup form validation rules
    $(D).ready(function($) {

        JQUERY4U.UTIL.setupFormValidation();
    });
})(jQuery, window, document);