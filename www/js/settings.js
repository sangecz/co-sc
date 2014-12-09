/**
 * Created by sange on 11/23/14.
 */

var settings = {

    info: {
        setDeviceUUID: function(){
            $('#info_uuid').val(device.uuid);
            alert(device.uuid);
        }
    },

    overview : {

        URL_ID : "overview_url",
        USERNAME_ID : "overview_username",
        PASSWORD_ID : "overview_password",
        IFRAME_ID : "overview_frame",

        STORAGE_KEY : "overview",

        storageObject : {
            url : '',
            password : '',
            username : ''
        },

        save : function (){
            this.storageObject = {};
            this.storageObject.url = $('#' + this.URL_ID).val();
            this.storageObject.username = $('#' + this.USERNAME_ID).val();
            this.storageObject.password = $('#' + this.PASSWORD_ID).val();

            // icinga classic
            // TODO ICINGA WEB 2
            var prefix = "";
            if(/^http:\/\//.test(this.storageObject.url)) {
                prefix = "//";
            }
            if(/^https:\/\//.test(this.storageObject.url)) {
                prefix = "//";
            }

            overview.url = this.storageObject.url;

            secStorage.instance.saveToStorage(this.storageObject, this.STORAGE_KEY);
        },

        load : function (){
            this.storageObject = secStorage.instance.loadFromStorage(this.STORAGE_KEY);

            if (this.storageObject == null){
                $('#' + this.URL_ID).val('');
                $('#' + this.USERNAME_ID).val('');
                $('#' + this.PASSWORD_ID).val('');
            } else if(this.storageObject != null && typeof this.storageObject.url != util.UNDEF && typeof this.storageObject.username != util.UNDEF
                && typeof this.storageObject.password != util.UNDEF) {

                $('#' + this.URL_ID).val(this.storageObject.url);
                $('#' + this.USERNAME_ID).val(this.storageObject.username);
                $('#' + this.PASSWORD_ID).val(this.storageObject.password);

                overview.url = this.storageObject.url;
            }
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
            url : '',
            password : '',
            apikey : '',
            username : ''
        },

        save : function(apiKey, url, username, password){
            this.storageObject = {};
            this.storageObject.url = url;
            this.storageObject.username = username;
            this.storageObject.password = password;
            this.storageObject.apikey = apiKey;
            secStorage.instance.saveToStorage(this.storageObject, this.STORAGE_KEY);
        },

        load : function(){
            this.storageObject = secStorage.instance.loadFromStorage(this.STORAGE_KEY);

            if (this.storageObject == null){
               this.clearValues();
            } else if(this.storageObject != null && typeof this.storageObject.url != util.UNDEF && typeof this.storageObject.username != util.UNDEF
                && typeof this.storageObject.password != util.UNDEF) {

                $('#' + this.URL_ID).val(this.storageObject.url);
                $('#' + this.USERNAME_ID).val(this.storageObject.username);
                $('#' + this.PASSWORD_ID).val(this.storageObject.password);

            }
        },

        del : function (){
            this.clearValues();

            util.storage.removeItem(settings.ws.STORAGE_KEY);
        },

        handleSubmit : function() {
            var url = $('#' + settings.ws.URL_ID).val();
            var username = $('#' + settings.ws.USERNAME_ID).val();
            var name = $('#' + settings.ws.NAME_ID).val();
            var password = $('#' + settings.ws.PASSWORD_ID).val();

            if($('#ws_register').is(':checked')){
                // register
                restConn.register(url, username, password, name);
            } else {
                // login
                restConn.auth(url, username, password);
            }
        },

        clearValues : function(){
            $('#' + this.URL_ID).val('');
            $('#' + this.USERNAME_ID).val('');
            $('#' + this.NAME_ID).val('');
            $('#' + this.PASSWORD_ID).val('');
        }

    },

    save : function() {
        //$.mobile.changePage($('#' + page.INDEX), util.backTransOpt);
    },

    load : function() {
        $.mobile.changePage($('#' + page.SETTINGS), util.transOpt);

        this.overview.load();
        this.ws.load();
    }



};

$('#ws_register').on('click', function(){
    if($(this).is(':checked')){
        $("#hidden_name").show();
        $("#submit_settings_ws").html('Register');
    } else {
        $("#hidden_name").hide();
        $("#submit_settings_ws").html('Login & Save');
    }
});

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

            $('#settings_ws_form').validate({
                rules: {
                    ws_url: {
                        required: true,
                        url: true
                    },
                    ws_username: "required",
                    ws_password: "required"
                },
                messages: {
                    ws_url: {
                        required: "Please enter valid URL.",
                        url: "Not a valid URL."
                    },
                    ws_username: "Please enter your email.",
                    ws_password: "Please enter your password."
                },
                submitHandler: function(form) {
                    settings.ws.handleSubmit();
                }
            });
            $("#submit_settings_ws").click(function(){
                $("#settings_ws_form").submit();
                return false;
            });
///////////////////////////////////////////////////
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
                    secStorage.submitPass();

                }
            });
            $("#submit_pin").click(function(){
                $("#enterpin_form").submit();
                return false;
            });
            $("#forget_pin").click(function(){
                secStorage.forgetPass();
                return false;
            });
        }
    };

    //when the dom has loaded setup form validation rules
    $(D).ready(function($) {

        JQUERY4U.UTIL.setupFormValidation();
    });
})(jQuery, window, document);