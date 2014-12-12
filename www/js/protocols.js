/**
 * Created by sange on 11/21/14.
 */


var protocol = {

    addToggle : false,
    fromScripts : false,
    createNewSelected : false,
    protocolIdArray : [],

    onBack : function () {

        if(protocol.fromScripts) {
            protocol.fromScripts = false;
            history.back();
        } else {
            $.mobile.changePage($('#' + page.PROTOCOLS), util.backTransOpt);
        }
    },

    openView : function(){
        settings.ws.load();

        if(restConn && restConn.isAuthenticated()) {
            protocol.updateList();
            $.mobile.changePage($('#' + page.PROTOCOLS), util.transOpt);

        } else {
            util.toast('You must log in first. Go to settings');
        }

        $('#protocol_back_button').on('click', function(){
            protocol.onBack();
        });

        $('#protocol_update_button').on('click', function(){
            protocol.updateList();
        });

        $('#protocol_delete_button').on('click', function(){
            protocol.del();
        });

        $('#protocol_add_button').on('click', function(){
            protocol.add();
        });
    },

    updateList: function (){
        restConn.readProtocols();
    },

    refreshItems: function(array){
        // first empty listview and array
        protocol.protocolIdArray = [];
        $('#protocols_list').empty();
        if(array.length != 0) {
            $('#protocols_list').append();
        } else {
            $('#protocols_list').append("<li>No protocols</li>");
        }

        for(var i = 0; i < array.length; i++){
            var currentProtocol = array[i];
            // add new one
            if(typeof protocol.protocolIdArray[currentProtocol.id] == util.UNDEF) {
                // extract ids
                protocol.protocolIdArray[currentProtocol.id] = currentProtocol;

                $('#protocols_list').append(
                    '<li class="p_item" id="protocol-' +
                    currentProtocol.id
                    + '"><a class="edit_item onclick="protocol.edit(' +
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

        // trigger only when scripts edit page presented
        if($.mobile.activePage.attr('id') == page.SCRIPTS_EDIT && protocol.protocolIdArray.length > 0) {
            script.prepareProtocolSelect();

            if(protocol.createNewSelected) {
                protocol.createNewSelected = false;
                var protocolSelect = $('#script_edit_protocol');
                var lastProtocol = array[array.length - 1];
                protocolSelect.val("protocol-id-" + lastProtocol.id).selectmenu('refresh');
            }
         }

        $('.p_item').click(function() {
            protocol.edit($(this).attr("id").replace('protocol-', ''));
        });

        this.refreshList();
    },

    refreshList: function () {
        $('#protocols_list').listview('refresh');
    },

    edit: function(protocolId){
        if(event.handled !== true) {
            $('#page_protocols_edit_header h1').html("Edit Protocol");
            protocol.addToggle = false;

            var curProtocol = protocol.protocolIdArray[protocolId];
            $('#hidden_protocol_id').html(curProtocol.id);

            $('#protocol_edit_name').val(curProtocol.name);
            $('#protocol_edit_desc').val(curProtocol.description);
            $('#protocol_edit_type').selectmenu();
            $('#protocol_edit_type').val(curProtocol.type).selectmenu('refresh');
            $('#protocol_edit_login').val(curProtocol.login);
            $('#protocol_edit_password').val(curProtocol.passwd);
            $('#protocol_edit_port').val(curProtocol.port);
            $('#protocol_edit_role').selectmenu();
            $('#protocol_edit_role').val(curProtocol.ps_role_id).selectmenu('refresh');

            $('#protocol_edit_footer').show();

            $.mobile.changePage( "#" + page.PROTOCOLS_EDIT, util.transOpt );
            event.handled = true;
        }
    },

    add : function() {
        $('#page_protocols_edit_header h1').html("Add Protocol");
        protocol.addToggle = true;

        $('#protocol_edit_name').val('');
        $('#protocol_edit_desc').val('');
        $('#protocol_edit_type').selectmenu();
        $('#protocol_edit_type').val('ssh').selectmenu('refresh');
        $('#protocol_edit_login').val('');
        $('#protocol_edit_password').val('');
        $('#protocol_edit_port').val(22);
        $('#protocol_edit_role').selectmenu();
        $('#protocol_edit_role').val(2).selectmenu('refresh');

        $('#protocol_edit_footer').hide();

        $('label.error').hide();
        $.mobile.changePage( "#" + page.PROTOCOLS_EDIT, util.transOpt );
    },

    del: function() {
        var protocolId = $('#hidden_protocol_id').html();
        restConn.deleteProtocol(protocolId);

        $.mobile.changePage( "#" + page.PROTOCOLS, util.backTransOpt );
    },

    save: function() {
        var prot = {};
        prot.name = $('#protocol_edit_name').val();
        prot.description = $('#protocol_edit_desc').val();
        prot.type = $('#protocol_edit_type').val();
        prot.ps_role_id = $('#protocol_edit_role').val();

        if(prot.type == "ssh") {
            prot.sshAttr = {};
            prot.sshAttr.port = $('#protocol_edit_port').val();
            prot.sshAttr.auth = {};
            prot.sshAttr.auth.login = $('#protocol_edit_login').val();
            prot.sshAttr.auth.passwd = $('#protocol_edit_password').val();

            if(protocol.addToggle) {
                // adding
                restConn.createProtocol(prot);
            } else {
                // editing
                var protocolId = $('#hidden_protocol_id').html();
                restConn.updateProtocol(prot, protocolId);
            }
        } else {
            util.toast('Error: Unsupported protocol type.');
        }

        this.onBack();
    },

    onCreated : function(newProtocol) {

        this.protocolIdArray[newProtocol.id] = newProtocol;

        util.toast('Protocol created');

        $('#protocols_list').prepend(
            '<li class="p_item" id="protocol-' +
            newProtocol.id
            + '"><a class="edit_item" onclick="protocol.edit(' +
            newProtocol.id
            + ');">' +
            newProtocol.name
            + '</a></li>'
        );
        this.updateList();

    },

    onUpdated : function(updatedProtocol) {
        util.toast('Protocol updated');

        this.protocolIdArray[updatedProtocol.id] = updatedProtocol;
        $('#protocol-' + updatedProtocol.id).html($('#protocol_edit_name').val());

        this.updateList();
    },

    onDeleted : function (protocolId) {
        util.toast('Protocol deleted');
        $('#protocols_list #' + protocolId).parent().remove();
        this.updateList();
    }
};

(function($,W,D) {
    var JQUERY4U = {};

    JQUERY4U.UTIL =    {
        setupFormValidation: function()     {

            $.validator.messages.required = '';

            $('#protocol_edit_form').validate({
                rules: {
                    protocol_edit_name: "required",
                    protocol_edit_login: "required",
                    protocol_edit_password: "required",
                    protocol_edit_port: {
                        digits: true
                    }
                },
                messages: {
                    protocol_edit_name: "Please enter name.",
                    protocol_edit_login: "Please enter SSH login.",
                    protocol_edit_password: "Please enter SSH password.",
                    protocol_edit_port: "Please enter a port number",
                    protocol_edit_port: {

                    }
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