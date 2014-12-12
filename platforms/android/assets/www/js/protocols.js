/**
 * Created by sange on 11/21/14.
 */


var protocol = {

    addToggle : false,

    protocolIdArray : [],

    openView : function(){
        if (secStorage.isInstanceSet()) {

            if(restConn.isAuthenticated()) {
                settings.ws.load();
                $.mobile.changePage($('#' + page.PROTOCOLS), util.transOpt);
                protocol.updateList();
            } else {
                util.toast('You must log in first. Go to settings');
            }
        } else {
            util.toast('You must enter passphrase first.');
            app.onResumeApp();
        }

    },

    updateList: function (){
        if(settings.ws.storageObject != null){
            restConn.readProtocols(settings.ws.storageObject.url);
        }
    },

    refreshItems: function(array){

        // first, empty listview and array
        this.protocolIdArray = [];
        $('#protocols_list').empty();
        if(array.length != 0) {
            $('#protocols_list').append();
        } else {
            $('#protocols_list').append("<li>No protocols</li>");
        }

        for(var i = 0; i < array.length; i++){
            var currentProtocol = array[i];

            // add new one
            if(typeof this.protocolIdArray[currentProtocol.id] == util.UNDEF) {
                // extract ids
                this.protocolIdArray[currentProtocol.id] = currentProtocol;

                $('#protocols_list').append(
                    '<li class="item"><a class="edit_item" id="protocol-' +
                    currentProtocol.id
                    + '" onclick="protocol.edit(' +
                    currentProtocol.id
                    + ');">' +
                    currentProtocol.name
                    + '</a></li>'
                );
            } else {
                // update name
                $('#protocol-' + currentProtocol.id).html(currentProtocol.name);
            }
        }

        this.refreshList();
    },

    refreshList: function () {
        $('#protocols_list').listview('refresh');
    },

    edit: function(protocolId){
        if(event.handled !== true) {
            $('#page_protocols_edit_header h1').html("Edit Protocol");
            this.addToggle = false;

            var curProtocol = protocol.protocolIdArray[protocolId];
            $('#protocol_edit_name').val(curProtocol.name);
            $('#protocol_edit_desc').val(curProtocol.description);
            $('#protocol_edit_content').val(curProtocol.content);
            $('#protocol_edit_ip').val(curProtocol.address);
            $('#hidden_protocol_id').html(curProtocol.id);
            // TODO az budou protokoly
            $('#protocol_edit_protocol').selectmenu();
            $('#protocol_edit_protocol').val(curProtocol.protocol_id).selectmenu('refresh');
            $('#protocol_edit_role').selectmenu();
            $('#protocol_edit_role').val(curProtocol.ps_role_id).selectmenu('refresh');
            $('#protocol_edit_footer').show();

            $.mobile.changePage( "#" + page.SCRIPTS_EDIT, util.transOpt );
            event.handled = true;
        }
    },

    add: function() {
        $('#page_protocols_edit_header h1').html("Add Protocol");
        this.addToggle = true;

        $('#protocol_edit_name').val("");
        $('#protocol_edit_desc').val("");
        $('#protocol_edit_ip').val("");
        $('#protocol_edit_content').val("");
        $('#protocol_edit_footer').hide();

        $('label.error').hide();
        $.mobile.changePage( "#" + page.SCRIPTS_EDIT, util.transOpt );
    },

    del: function() {
        // TODO ws
        var protocolId = $('#hidden_protocol_id').html();
        if(settings.ws.storageObject != null){
            restConn.deleteProtocol(settings.ws.storageObject.url, protocolId);
        }

        $.mobile.changePage( "#" + page.SCRIPTS, util.backTransOpt );
    },

    save: function() {
        if(this.addToggle) {
            // adding
            var newProtocol = {};
            newProtocol.name = $('#protocol_edit_name').val();
            newProtocol.description = $('#protocol_edit_desc').val();
            newProtocol.content = $('#protocol_edit_content').val();
            newProtocol.address = $('#protocol_edit_ip').val();
            newProtocol.protocol_id = $('#protocol_edit_protocol').val();
            newProtocol.ps_role_id = $('#protocol_edit_role').val();

            if(settings.ws.storageObject != null){
                restConn.createProtocol(settings.ws.storageObject.url, newProtocol);
            }
        } else {
            // editing
            var protocolId = $('#hidden_protocol_id').html();
            var curProtocol = protocol.protocolIdArray[protocolId];

            curProtocol.name = $('#protocol_edit_name').val();
            curProtocol.description = $('#protocol_edit_desc').val();
            curProtocol.content = $('#protocol_edit_content').val();
            curProtocol.address = $('#protocol_edit_ip').val();
            curProtocol.protocol_id = $('#protocol_edit_protocol').val();
            curProtocol.ps_role_id = $('#protocol_edit_role').val();

            if(settings.ws.storageObject != null){
                restConn.updateProtocol(settings.ws.storageObject.url, curProtocol, protocolId);
            }
        }
        $.mobile.changePage( "#" + page.SCRIPTS, util.backTransOpt );
    },

    onCreated : function(newProtocol) {
        this.protocolIdArray[newProtocol.id] = newProtocol;

        util.toast('Protocol created');

        $('#protocols_list').prepend(
            '<li class="item"><a class="edit_item" id="protocol-' +
            newProtocol.id
            + '" onclick="protocol.edit(' +
            newProtocol.id
            + ');">' +
            newProtocol.name
            + '</a></li>'
        );
        this.refreshList();
    },

    onUpdated : function(updatedProtocol) {
        util.toast('Protocol updated');

        this.protocolIdArray[updatedProtocol.id] = updatedProtocol;
        $('#protocol-' + updatedProtocol.id).html($('#protocol_edit_name').val());
    },

    onDeleted : function (protocolId) {
        util.toast('Protocol deleted');
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
            //$.validator.addMethod("valueNotEquals", function(value, element, arg){
            //    return arg != value;
            //}, "default");
            //
            //$.validator.addMethod("hashbang", function(value, element, arg){
            //    return /^#!\/[a-zA-Z]+/.test(value);
            //}, "");

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
                        hashbang: "Protocol must start with hashbang"
                    },
                    protocol_edit_protocol: { valueNotEquals: "Please select a protocol!" }
                },
                submitHandler: function(form) {
                    var protocolName = $("#protocol_edit_name").val();
                    if( $('#' + protocolName).length == 0) {
                        $('#protocol_edit_name_error').hide();
                        $('#protocol_edit_name_error').html("");
                        protocol.save();
                    } else {
                        $('#protocol_edit_name_error').html("Name already exists.");
                        $('#protocol_edit_name_error').show();
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