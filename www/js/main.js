/**
 * Created by sange on 11/18/14.
 */

var INDEX = "index";
var OVERVIEW_URL_ID = "overview_url";
var OVERVIEW_USERNAME_ID = "overview_username";
var OVERVIEW_PASSWORD_ID = "overview_password";

var backTransOpt = {
    transition: 'slide',
    reverse: true
};

function checkConnection() {


    var networkState = navigator.connection.type;

    // true if connected
    //if(networkState != Connection.NONE) {
    //    label.innerHTML = "Connected";
    //} else {
    //    label.innerHTML = "NOT Connected";
    //}
}

document.addEventListener("deviceready", checkConnection, false);

document.addEventListener("backbutton", onBackKeyDown, false);

if ( typeof String.prototype.startsWith != 'function' ) {
    String.prototype.startsWith = function( str ) {
        return this.substring( 0, str.length ) === str;
    }
}

function validateURL(textval) {
    var urlregex = new RegExp(
        "^(http:\/\/www.|https:\/\/www|http:\/\/|https:\/\/){1}([0-9A-Za-z]+\.)");
    return urlregex.test(textval);
}

(function($,W,D)
{
    var JQUERY4U = {};

    JQUERY4U.UTIL =
    {
        setupFormValidation: function()
        {
            //form validation rules
            $("#overview_form").validate({
                rules: {
                    // simple rule, converted to {required:true}
                    overview_url: {
                        required: true,
                        url: true
                    },
                    overview_username: "required",
                    // compound rule
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
                    saveOverview();
                }
            });
        }
    }

    //when the dom has loaded setup form validation rules
    $(D).ready(function($) {
        JQUERY4U.UTIL.setupFormValidation();
    });

})(jQuery, window, document);

function saveOverview(){

    var url = $('#' + OVERVIEW_URL_ID).val();
    var username = $('#' + OVERVIEW_USERNAME_ID).val();
    var password = $('#' + OVERVIEW_PASSWORD_ID).val();

    // icinga classic
    var prefix = "";
    if(url.startsWith("http://")) {
        prefix = "http://";
    }
    if(url.startsWith("https://")) {
        prefix = "https://";
    }

    //var suffix = url.replace(prefix, "");
    //var newSrc = prefix + username + ":" + password + "@" + suffix;

    $('#overview_frame').attr('src', url);

    window.localStorage.setItem(OVERVIEW_URL_ID, url);
    window.localStorage.setItem(OVERVIEW_USERNAME_ID, username);
    window.localStorage.setItem(OVERVIEW_PASSWORD_ID, password);

    backOverview();
}

function backOverview(){
    $.mobile.changePage($('#page_overview'), backTransOpt);
}

function loadOverview(){
    $('#' + OVERVIEW_URL_ID).val(window.localStorage.getItem(OVERVIEW_URL_ID));
    $('#' + OVERVIEW_USERNAME_ID).val(window.localStorage.getItem(OVERVIEW_USERNAME_ID));
    $('#' + OVERVIEW_PASSWORD_ID).val(window.localStorage.getItem(OVERVIEW_PASSWORD_ID));

    $('#overview_frame').attr('src', $('#' + OVERVIEW_URL_ID).val());
    alert($('#' + OVERVIEW_PASSWORD_ID).val());
}


function onBackKeyDown() {

    if($.mobile.activePage.attr('id') == INDEX) {
        navigator.app.exitApp();
    } else if($.mobile.activePage.attr('id') == "page_overview_settings") {
        $.mobile.changePage($('#page_overview'), backTransOpt);
    } else if($.mobile.activePage.attr('id') == "page_overview") {
        $.mobile.changePage($('#index'), backTransOpt);
    } else {
        history.back();
    }
}

function testHTTP(){
    $('#resp').text('ssssss');

    var httpReq = new plugin.HttpRequest();

    httpReq.post("http://10.0.0.38/co-sc_ws/check.php",
        //"http://10.0.0.38/co-sc_ws/list_dir.php",
        {
            //json: '{ "host" : "10.0.0.38", "protocol" : {"type" : "ssh",' +
            //    '"sshAttr": { "auth": { "login": "sange", "passwd": "sange"}' +
            //'} },' +
            //'"cmd": {  "path": "/bin" } }'
        },
        function(err, data) {
            alert(JSON.stringify(data) + "<fff>" + err);
        }
    );
}

function resizeOverviewFrame(id){
    var newheight;
    var newwidth;

    if(document.getElementById){
        newheight=document.getElementById(id).contentWindow.document .body.scrollHeight;
        newwidth=document.getElementById(id).contentWindow.document .body.scrollWidth;
    }

    document.getElementById(id).height= (newheight) + "px";
    //document.getElementById(id).width= (newwidth) + "px";

}
