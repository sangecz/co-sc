/**
 * Created by sange on 11/21/14.
 */


var script = {

    listObject: {
        itemID : null,
        add: false
    },

    refreshItems: function(response){
        for(var i = 0; i < response.length; i++){
            var r = response[i];
            $('#scripts_list').append(
                '<li class="item">' +
                '<a class="edit_item" ' +
                'id="' + r + '" ' +
                'onclick="script.edit(this);">' +
                r + '</a><a onclick="script.runScript();"></a></li>');
        }

        this.refreshList();
    },

    refreshList: function () {
        $('#scripts_list').listview('refresh');
    },

    edit: function(elem){
        if(event.handled !== true) {
            script.listObject.itemID = elem.innerHTML;
            script.listObject.add = false;
            $.mobile.changePage( "#" + page.SCRIPTS_EDIT, util.transOpt );
            event.handled = true;
        }
    },

    updateList: function (){
        // TODO ws
        //jQuery.ajax({
        //    type       : "POST",
        //    url        : "http://sange-icinga.hukot.net/list.php",
        //    crossDomain: true,
        //    beforeSend : function() {$.mobile.loading('show')},
        //    complete   : function() {$.mobile.loading('hide')},
        //    dataType   : 'json',
        //    success    : function(response) {
        //        script.refreshItems(response);
        //    },
        //    error      : function() {
        //        alert('Connection problem!');
        //    }
        //});
        script.refreshItems(['one', 'two', 'three']);
    },

    add: function() {
        script.listObject.add = true;
        $.mobile.changePage( "#" + page.SCRIPTS_EDIT, util.transOpt );
    },

    del: function() {
        // TODO ws
        var name = $('#script_edit_name').val();
        $('#scripts_list #' + name).parent().remove();
        this.refreshList();
        $.mobile.changePage( "#" + page.SCRIPTS, util.backTransOpt );
    },

    save: function() {
        // TODO ws
        var scriptName = $('#script_edit_name').val();
        $('#scripts_list').prepend(
            '<li class="item">' +
            '<a class="edit_item" ' +
            'id="' + scriptName + '" ' +
            'onclick="script.edit(this);">' +
            scriptName + '</a><a onclick="util.toast(\'run\');"></a></li>');
        $.mobile.changePage( "#" + page.SCRIPTS, util.backTransOpt );
    },

    runScript: function() {
        // TODO
    }
};

$(document).on('pagebeforeshow', '#' + page.SCRIPTS, function(){
    script.refreshList();
});

$(document).on('pagebeforeshow', '#' + page.SCRIPTS_EDIT, function(){
    if(script.listObject.add) {
        $('#page_scripts_edit_header h1').html("Add script");
        $('#script_edit_name').textinput('enable');
        $('#script_edit_name').val("");
        $('#script_edit_desc').val("");
        $('#script_edit_ip').val("");
        $('#script_edit_name-error').show();
        $('#script_edit_footer').hide();
    } else {
        $('#page_scripts_edit_header h1').html("Edit Script");
        $('#script_edit_name').textinput('disable');
        $('#script_edit_name').val(script.listObject.itemID);
        $('#script_edit_name-error').hide();
        $('#script_edit_footer').show();
        script.listObject.itemID = null;
    }
});

(function($,W,D) {
    var JQUERY4U = {};

    JQUERY4U.UTIL =
    {
        setupFormValidation: function()
        {

            $('#script_edit_form').validate({
                rules: {
                    script_edit_name: {
                        required: true
                    },
                    script_edit_ip: "required",
                    editor: "required"
                },
                messages: {
                    script_edit_name: "Please enter name.",
                    script_edit_ip: "Please enter IP address.",
                    editor: "Please enter content."
                },
                submitHandler: function(form) {
                    var scriptName = $("#script_edit_name").val();
                    if( $('#' + scriptName).length == 0) {
                        $('#script_edit_name_error').hide();
                        $('#script_edit_name_error').html("");
                        script.save();
                    } else {
                        $('#script_edit_name_error').html("Name already exists.");
                        $('#script_edit_name_error').show();
                    }

                }
            });
        }
    };

    //when the dom has loaded setup form validation rules
    $(D).ready(function($) {
        JQUERY4U.UTIL.setupFormValidation();
    });
})(jQuery, window, document);