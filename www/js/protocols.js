/**
 * Created by sange on 11/21/14.
 */


var protocol = {

    addToggle : false,

    protocolIdArray : [],

    openView : function(){
        settings.ws.load();

        if(restConn && restConn.isAuthenticated()) {
            protocol.updateList();
            $.mobile.changePage($('#' + page.SCRIPTS), util.transOpt);

        } else {
            util.toast('You must log in first. Go to settings');
        }
    },

    updateList: function (){
        restConn.readScripts();
    },

    refreshItems: function(array){

        // first empty listview and array
        this.protocolIdArray = [];
        $('#protocols_list').empty();
        if(array.length != 0) {
            $('#protocols_list').append();
        } else {
            $('#protocols_list').append("<li>No protocols</li>");
        }

        for(var i = 0; i < array.length; i++){
            var currentScript = array[i];

            // add new one
            if(typeof this.protocolIdArray[currentScript.id] == util.UNDEF) {
                // extract ids
                this.protocolIdArray[currentScript.id] = currentScript;

                $('#protocols_list').append(
                    '<li class="item"><a class="edit_item" id="protocol-' +
                    currentScript.id
                    + '" onclick="protocol.edit(' +
                    currentScript.id
                    + ');">' +
                    currentScript.name
                    + '</a><a onclick="protocol.runScript(' +
                    currentScript.id
                    + ');"></a></li>'
                );
            } else {
                // update name
                $('#protocol-' + currentScript.id).html(currentScript.name);
            }
        }

        this.refreshList();
    },

    refreshList: function () {
        $('#protocols_list').listview('refresh');
    },



    edit: function(protocolId){
        if(event.handled !== true) {
            $('#page_protocols_edit_header h1').html("Edit Script");
            this.addToggle = false;

            var curScript = protocol.protocolIdArray[protocolId];
            $('#protocol_edit_name').val(curScript.name);
            $('#protocol_edit_desc').val(curScript.description);
            $('#protocol_edit_content').val(curScript.content);
            $('#protocol_edit_ip').val(curScript.address);
            $('#hidden_protocol_id').html(curScript.id);
            // TODO az budou protokoly
            $('#protocol_edit_protocol').selectmenu();
            $('#protocol_edit_protocol').val(curScript.protocol_id).selectmenu('refresh');
            $('#protocol_edit_role').selectmenu();
            $('#protocol_edit_role').val(curScript.ps_role_id).selectmenu('refresh');
            $('#protocol_edit_footer').show();

            $.mobile.changePage( "#" + page.SCRIPTS_EDIT, util.transOpt );
            event.handled = true;
        }
    },

    add: function() {
        $('#page_protocols_edit_header h1').html("Add Script");
        this.addToggle = true;

        $('#protocol_edit_name').val("");
        $('#protocol_edit_desc').val("");
        $('#protocol_edit_ip').val("");
        $('#protocol_edit_content').val("");
        $('#protocol_edit_footer').hide();

        $('#protocol_edit_protocol').selectmenu();
        $('#protocol_edit_protocol').val('default').selectmenu('refresh');

        $('label.error').hide();
        $.mobile.changePage( "#" + page.SCRIPTS_EDIT, util.transOpt );
    },

    del: function() {
        var protocolId = $('#hidden_protocol_id').html();
        restConn.deleteScript(protocolId);

        $.mobile.changePage( "#" + page.SCRIPTS, util.backTransOpt );
    },

    save: function() {
        if(this.addToggle) {
            // adding
            var newScript = {};
            newScript.name = $('#protocol_edit_name').val();
            newScript.description = $('#protocol_edit_desc').val();
            newScript.content = $('#protocol_edit_content').val();
            newScript.address = $('#protocol_edit_ip').val();
            newScript.protocol_id = $('#protocol_edit_protocol').val();
            newScript.ps_role_id = $('#protocol_edit_role').val();

            restConn.createScript(newScript);
        } else {
            // editing
            var protocolId = $('#hidden_protocol_id').html();
            var curScript = protocol.protocolIdArray[protocolId];

            curScript.name = $('#protocol_edit_name').val();
            curScript.description = $('#protocol_edit_desc').val();
            curScript.content = $('#protocol_edit_content').val();
            curScript.address = $('#protocol_edit_ip').val();
            curScript.protocol_id = $('#protocol_edit_protocol').val();
            curScript.ps_role_id = $('#protocol_edit_role').val();

            restConn.updateScript(curScript, protocolId);
        }
        $.mobile.changePage( "#" + page.SCRIPTS, util.backTransOpt );
    },

    runScript: function(protocolId) {
        restConn.runScript(protocolId);

    },

    showResult : function (data) {
        //alert(JSON.stringify(data));

        //$( "#dialog_protocol_result_m").html(data.ws.message);
        $( "#dialog_protocol_result_o").html(data.data.protocolOutput);
        $( "#dialog_protocol_result_e").html(data.data.exitCode);
        $( "#dialog_protocol_result" ).css('overflow-y', 'scroll');
        $( "#dialog_protocol_result" ).popup( "open" );
    },

    onCreated : function(newScript) {
        this.protocolIdArray[newScript.id] = newScript;

        util.toast('Script created');

        $('#protocols_list').prepend(
            '<li class="item"><a class="edit_item" id="protocol-' +
            newScript.id
            + '" onclick="protocol.edit(' +
            newScript.id
            + ');">' +
            newScript.name
            + '</a><a onclick="protocol.runScript(' +
            newScript.id
            + ');"></a></li>'
        );
        this.updateList();
    },

    onUpdated : function(updatedScript) {
        util.toast('Script updated');

        this.protocolIdArray[updatedScript.id] = updatedScript;
        $('#protocol-' + updatedScript.id).html($('#protocol_edit_name').val());

        this.updateList();
    },

    onDeleted : function (protocolId) {
        util.toast('Script deleted');
        $('#protocols_list #' + protocolId).parent().remove();
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

            $('#protocol_edit_form').validate({
                rules: {
                    protocol_edit_name: "required",
                    protocol_edit_ip: "required",
                    protocol_edit_content: {
                        required: true,
                        hashbang: ""

                    },
                    protocol_edit_protocol: {
                        valueNotEquals: "default"
                    }
                },
                messages: {
                    protocol_edit_name: "Please enter name.",
                    protocol_edit_ip: "Please enter IP address.",
                    protocol_edit_content: {
                        required: "Please enter content.",
                        hashbang: "Script must start with hashbang"
                    },
                    protocol_edit_protocol: { valueNotEquals: "Please select a protocol!" }
                },
                submitHandler: function(form) {
                    protocol.save();
                }
            });
        }
    };

    //when the dom has loaded setup form validation rules
    $(D).ready(function($) {
        JQUERY4U.UTIL.setupFormValidation();
    });
})(jQuery, window, document);