/**
 * Created by sange on 11/21/14.
 */


var script = {

    addToggle : false,

    scriptIdArray : [],

    onBack : function () {
        $.mobile.changePage($('#' + page.SCRIPTS), util.backTransOpt);
    },

    openView : function(){

        settings.ws.load();

        if (util.isOnline()) {
            if (restConn && restConn.isAuthenticated()) {
                script.updateList();
                $(document).on('pagebeforeshow', '#' + page.SCRIPTS, function() {
                    script.bindOnClicks();
                });
                $.mobile.changePage($('#' + page.SCRIPTS), util.transOpt);

            } else {
                util.toast('You must log in first. Go to settings');
            }
        }
    },

    updateList: function (){
        restConn.readScripts();
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

        console.log('refreshItems');

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
        $('#scripts_list').listview().listview('refresh');
    },



    edit: function(scriptId){
        $('#page_scripts_edit_header h1').html("Edit Script");
        this.addToggle = false;

        var curScript = script.scriptIdArray[scriptId];
        $('#script_edit_name').val(curScript.name);
        $('#script_edit_desc').val(curScript.description);
        $('#script_edit_content').val(curScript.content);
        $('#script_edit_ip').val(curScript.address);
        $('#hidden_script_id').html(curScript.id);

        script.prepareProtocolSelect();

        $('#script_edit_role').selectmenu().val(curScript.ps_role_id).selectmenu('refresh');
        $('#script_edit_footer').show();

        $.mobile.changePage( "#" + page.SCRIPTS_EDIT, util.transOpt );

    },

    add: function() {
        $('#page_scripts_edit_header h1').html("Add Script");
        this.addToggle = true;

        $('#script_edit_name').val("");
        $('#script_edit_desc').val("");
        $('#script_edit_ip').val("");
        $('#script_edit_content').val("#!/bin/bash");
        $('#script_edit_role').selectmenu().val(2).selectmenu('refresh');

        $('#script_edit_footer').hide();

        console.log('add');
        script.prepareProtocolSelect();

        $('label.error').hide();
        $.mobile.changePage( "#" + page.SCRIPTS_EDIT, util.transOpt );
    },

    prepareProtocolSelect : function () {
        var protocolSelect = $('#script_edit_protocol');
        protocolSelect.empty();
        protocolSelect.selectmenu();
        protocolSelect.append('<option value="default" selected="selected">Select protocol...</option>');
        protocolSelect.append('<option value="create_new">Create new protocol...</option>');

        if(protocol.protocolIdArray.length <= 0) {
            console.log('protocol.updateList');
            protocol.updateList();
        } else {
            console.log('filling select');
            protocol.protocolIdArray.forEach(function printBr(protocol, protocolId, array) {
                var id = "protocol-id-" + protocolId;
                var opt = '<option value="' + id + '">' + protocol.name + '</option>';
                protocolSelect.append(opt);
            });


            var curScriptId = $('#hidden_script_id').html();
            var curScript = script.scriptIdArray[curScriptId];
            if(this.addToggle || curScript.protocol_id == null) {
                console.log('default');
                protocolSelect.val('default').selectmenu('refresh');
            } else {
                console.log('ideckem');
                protocolSelect.val("protocol-id-" + curScript.protocol_id).selectmenu('refresh');
            }
        }
    },


    protocolSelected : function () {
        var selectId = '#script_edit_protocol';
        if($(selectId + ' option:selected').val() == "create_new") {
            $(selectId).selectmenu().val('default').selectmenu('refresh');
            protocol.fromScripts = true;
            protocol.createNewSelected = true;
            protocol.add();
        }
    },

    del: function() {
        var scriptId = $('#hidden_script_id').html();
        restConn.deleteScript(scriptId);

        $.mobile.changePage( "#" + page.SCRIPTS, util.backTransOpt );
    },

    save: function() {
        var script = {};
        script.name = $('#script_edit_name').val();
        script.description = $('#script_edit_desc').val();
        script.content = $('#script_edit_content').val();
        script.address = $('#script_edit_ip').val();
        script.protocol_id = $('#script_edit_protocol').val().replace("protocol-id-", "");
        script.ps_role_id = $('#script_edit_role').val();

        if(this.addToggle) {
            // adding
            restConn.createScript(script);
        } else {
            // editing
            var scriptId = $('#hidden_script_id').html();
            restConn.updateScript(script, scriptId);
        }
        $.mobile.changePage( "#" + page.SCRIPTS, util.backTransOpt );
    },

    runScript: function(scriptId) {
        restConn.runScript(scriptId);

    },

    showResult : function (data) {

        //$( "#dialog_script_result_m").html(data.ws.message);
        $( "#dialog_script_result_o").html(data.data.scriptOutput);
        $( "#dialog_script_result_e").html(data.data.exitCode);
        $( "#dialog_script_result" ).css('overflow-y', 'scroll');
        $( "#dialog_script_result" ).css('width', '90% !important');
        $( "#dialog_script_result" ).css('height', '90% !important');
        $( "#dialog_script_result" ).popup( "open" );

        $(document).off('click', '#dialog_script_result_close_button').on('click', '#dialog_script_result_close_button', function (e) {
            $( "#dialog_script_result" ).popup( "close" );
        });

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
        this.updateList();
    },

    onUpdated : function(updatedScript) {
        util.toast('Script updated');

        this.scriptIdArray[updatedScript.id] = updatedScript;
        $('#script-' + updatedScript.id).html($('#script_edit_name').val());

        this.updateList();
    },

    onDeleted : function (scriptId) {
        util.toast('Script deleted');
        $('#scripts_list #' + scriptId).parent().remove();
        this.updateList();
    },

    bindOnClicks : function () {
        $(document).off('click', '#script_back_button').on('click', '#script_back_button', function (e) {
            script.onBack();
        });

        $(document).off('click', '#protocol_back_button').on('click', '#protocol_back_button', function (e) {
            protocol.onBack();
        });

        $(document).off('click', '#script_update_button').on('click', '#script_update_button', function (e) {
            script.updateList();
        });

        $(document).off('click', '#script_delete_button').on('click', '#script_delete_button', function (e) {
            script.del();
        });

        $(document).off('click', '#script_add_button').on('click', '#script_add_button', function (e) {
            script.add();
        });
    }

};

(function($,W,D) {
    var JQUERY4U = {};

    JQUERY4U.UTIL =
    {
        setupFormValidation: function()
        {
            $.validator.addMethod("valueNotEquals", function(value, element, arg){
                return (value != "default" && value != "create_new");
            }, "");

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
                        valueNotEquals: ""
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
                    script.save();
                }
            });
        }
    };

    //when the dom has loaded setup form validation rules
    $(D).ready(function($) {
        JQUERY4U.UTIL.setupFormValidation();
    });
})(jQuery, window, document);