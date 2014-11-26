/**
 * Created by sange on 11/23/14.
 */
// TODO private storare
// TODO uuid

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

        STORAGE_KEY : "overview_key",

        storageOject : {
            url : '',
            password : '',
            username : ''
        },

        save : function (){
            this.storageOject.url = $('#' + this.URL_ID).val();
            this.storageOject.username = $('#' + this.USERNAME_ID).val();
            this.storageOject.password = $('#' + this.PASSWORD_ID).val();

            // icinga classic
            // TODO ICINGA WEB 2
            var prefix = "";
            if(/^http:\/\//.test(this.storageOject.url)) {
                prefix = "//";
            }
            if(/^https:\/\//.test(this.storageOject.url)) {
                prefix = "//";
            }

            //var suffix = url.replace(prefix, "");
            //var newSrc = prefix + username + ":" + password + "@" + suffix;

            $("#" + this.IFRAME_ID).attr('src', this.storageOject.url);
            $('#' + this.IFRAME_ID).attr('src', $('#' + this.IFRAME_ID).attr('src'));

            //secStorage.save(this.storageOject, this.STORAGE_KEY);
        },

        load : function (){
            //this.storageOject = secStorage.load(this.STORAGE_KEY);

            if (typeof this.storageOject.url != util.UNDEF && typeof this.storageOject.username != util.UNDEF
                && typeof this.storageOject.password != util.UNDEF) {

                $('#' + this.URL_ID).val(this.storageOject.url);
                $('#' + this.USERNAME_ID).val(this.storageOject.username);
                $('#' + this.PASSWORD_ID).val(this.storageOject.password);

                $("#" + this.IFRAME_ID).attr('src', this.storageOject.url);
                $('#' + this.IFRAME_ID).attr('src', $('#' + this.IFRAME_ID).attr('src'));
            }
        }
    },

    ws : {

        URL_ID : "ws_url",
        USERNAME_ID : "ws_username",
        PASSWORD_ID : "ws_password",

        STORAGE_KEY : "sp_key",

        storageOject : {
            url : '',
            password : '',
            username : ''
        },

        save : function(){
            this.storageOject.url = $('#' + this.URL_ID).val();
            this.storageOject.username = $('#' + this.USERNAME_ID).val();
            this.storageOject.password = $('#' + this.PASSWORD_ID).val();

            //secStorage.save(this.storageOject, this.STORAGE_KEY);
        },

        load : function(){
            //this.storageOject = secStorage.load(this.STORAGE_KEY);

            if (typeof this.storageOject.url != util.UNDEF && typeof this.storageOject.username != util.UNDEF
                && typeof this.storageOject.password != util.UNDEF) {

                $('#' + this.URL_ID).val(this.storageOject.url);
                $('#' + this.USERNAME_ID).val(this.storageOject.username);
                $('#' + this.PASSWORD_ID).val(this.storageOject.password);

            }
        }

    },

    save : function() {


        //$.mobile.changePage($('#' + page.INDEX), util.backTransOpt);
    },

    load : function() {
        this.overview.load();
        this.ws.load();

        util.toast('Loaded');
    }
};

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
                    util.toast('Overview saved');
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
                    ws_username: "Please enter your username.",
                    ws_password: "Please enter your password."
                },
                submitHandler: function(form) {
                    settings.ws.save();
                    connector.auth();
                    util.toast('WS saved');
                }
            });
            $("#submit_settings_ws").click(function(){
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