/**
 * Created by sange on 11/21/14.
 */


var script = {

    addToggle : false,

    scriptIdArray : [],

    openView : function(){
        if (secStorage.isInstanceSet()) {
            settings.ws.load();
            $.mobile.changePage($('#' + page.SCRIPTS), util.transOpt);
            script.updateList();
        } else {
            util.toast('You must enter passphrase first.');
            app.onResumeApp();
        }
    },

    updateList: function (){
        if(settings.ws.storageObject != null){
            restConn.readScripts(settings.ws.storageObject.url);
        }
    },

    refreshItems: function(array){

        // first empty listview and array
        this.scriptIdArray = [];
        $('#scripts_list').empty();
        if(array.length != 0) {
            $('#scripts_list').append();
        } else {
            $('#scripts_list').append("<li>No scripts</li>");
        }

        for(var i = 0; i < array.length; i++){
            var currentScript = array[i];

            // add new one
            if(typeof this.scriptIdArray[currentScript.id] == util.UNDEF) {
                // extract ids
                this.scriptIdArray[currentScript.id] = currentScript;

                $('#scripts_list').append(
                    '<li class="item"><a class="edit_item" id="script-' +
                    currentScript.id
                    + '" onclick="script.edit(' +
                    currentScript.id
                    + ');">' +
                    currentScript.name
                    + '</a><a onclick="script.runScript(' +
                    currentScript.id
                    + ');"></a></li>'
                );
            } else {
                // update name
                $('#script-' + currentScript.id).html(currentScript.name);
            }
        }

        this.refreshList();
    },

    refreshList: function () {
        $('#scripts_list').listview('refresh');
    },



    edit: function(scriptId){
        if(event.handled !== true) {
               $('#page_scripts_edit_header h1').html("Edit Script");
            this.addToggle = false;

            var curScript = script.scriptIdArray[scriptId];
            $('#script_edit_name').val(curScript.name);
            $('#script_edit_desc').val(curScript.description);
            $('#script_edit_content').val(curScript.content);
            $('#script_edit_ip').val(curScript.address);
            $('#hidden_script_id').html(curScript.id);
            // TODO az budou protokoly
            $('#script_edit_protocol').selectmenu();
            $('#script_edit_protocol').val(curScript.protocol_id).selectmenu('refresh');
            $('#script_edit_role').selectmenu();
            $('#script_edit_role').val(curScript.ps_role_id).selectmenu('refresh');
            $('#script_edit_footer').show();

            $.mobile.changePage( "#" + page.SCRIPTS_EDIT, util.transOpt );
            event.handled = true;
        }
    },

    add: function() {
        $('#page_scripts_edit_header h1').html("Add Script");
        this.addToggle = true;

        $('#script_edit_name').val("");
        $('#script_edit_desc').val("");
        $('#script_edit_ip').val("");
        $('#script_edit_content').val("");
        $('#script_edit_footer').hide();

        $('#script_edit_protocol').selectmenu();
        $('#script_edit_protocol').val('default').selectmenu('refresh');

        $('label.error').hide();
        $.mobile.changePage( "#" + page.SCRIPTS_EDIT, util.transOpt );
    },

    del: function() {
        var scriptId = $('#hidden_script_id').html();
        if(settings.ws.storageObject != null){
            restConn.deleteScript(settings.ws.storageObject.url, scriptId);
        }

        $.mobile.changePage( "#" + page.SCRIPTS, util.backTransOpt );
    },

    save: function() {
        if(this.addToggle) {
            // adding
            var newScript = {};
            newScript.name = $('#script_edit_name').val();
            newScript.description = $('#script_edit_desc').val();
            newScript.content = $('#script_edit_content').val();
            newScript.address = $('#script_edit_ip').val();
            newScript.protocol_id = $('#script_edit_protocol').val();
            newScript.ps_role_id = $('#script_edit_role').val();

            if(settings.ws.storageObject != null){
                restConn.createScript(settings.ws.storageObject.url, newScript);
            }
        } else {
            // editing
            var scriptId = $('#hidden_script_id').html();
            var curScript = script.scriptIdArray[scriptId];

            curScript.name = $('#script_edit_name').val();
            curScript.description = $('#script_edit_desc').val();
            curScript.content = $('#script_edit_content').val();
            curScript.address = $('#script_edit_ip').val();
            curScript.protocol_id = $('#script_edit_protocol').val();
            curScript.ps_role_id = $('#script_edit_role').val();

            if(settings.ws.storageObject != null){
                restConn.updateScript(settings.ws.storageObject.url, curScript, scriptId);
            }
        }
        $.mobile.changePage( "#" + page.SCRIPTS, util.backTransOpt );
    },

    runScript: function(scriptId) {
        if(settings.ws.storageObject != null){
            restConn.runScript(settings.ws.storageObject.url, scriptId);
        }
    },

    showResult : function (data) {
        //alert(JSON.stringify(data));

        //$( "#dialog_script_result_m").html(data.ws.message);
        $( "#dialog_script_result_o").html(data.data.scriptOutput);
        $( "#dialog_script_result_e").html(data.data.exitCode);
        $( "#dialog_script_result" ).css('overflow-y', 'scroll');
        $( "#dialog_script_result" ).popup( "open" );
    },

    onCreated : function(newScript) {
        this.scriptIdArray[newScript.id] = newScript;

        util.toast('Script created');

        $('#scripts_list').prepend(
            '<li class="item"><a class="edit_item" id="script-' +
            newScript.id
            + '" onclick="script.edit(' +
            newScript.id
            + ');">' +
            newScript.name
            + '</a><a onclick="script.runScript(' +
            newScript.id
            + ');"></a></li>'
        );
        this.refreshList();
    },

    onUpdated : function(updatedScript) {
        util.toast('Script updated');

        this.scriptIdArray[updatedScript.id] = updatedScript;
        $('#script-' + updatedScript.id).html($('#script_edit_name').val());
    },

    onDeleted : function (scriptId) {
        util.toast('Script deleted');
        $('#scripts_list #' + scriptId).parent().remove();
        this.updateList();
    }

};

(function($,W,D) {
    var JQUERY4U = {};

    JQUERY4U.UTIL =
    {
        setupFormValidation: function()
        {
            $.validator.addMethod("valueNotEquals", function(value, element, arg){
                return arg != value;
            }, "default");

            $.validator.addMethod("hashbang", function(value, element, arg){
                return /^#!\/[a-zA-Z]+/.test(value);
            }, "");

            $.validator.messages.required = '';

            $('#script_edit_form').validate({
                rules: {
                    script_edit_name: "required",
                    script_edit_ip: "required",
                    script_edit_content: {
                        required: true,
                        hashbang: ""

                    },
                    script_edit_protocol: {
                        valueNotEquals: "default"
                    }
                },
                messages: {
                    script_edit_name: "Please enter name.",
                    script_edit_ip: "Please enter IP address.",
                    script_edit_content: {
                        required: "Please enter content.",
                        hashbang: "Script must start with hashbang"
                    },
                    script_edit_protocol: { valueNotEquals: "Please select a protocol!" }
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