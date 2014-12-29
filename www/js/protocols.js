/**
 * @author Petr Marek
 * Licence Apache 2.0, see below link
 * @link http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * Module: protocols - corresponds with Protocols section in app.
 *
 * @type {{addToggle: boolean, fromScripts: boolean, createNewSelected: boolean, protocolIdArray: Array, onBack: Function, openView: Function, updateList: Function, refreshItems: Function, refreshList: Function, edit: Function, add: Function, del: Function, save: Function, onCreated: Function, onUpdated: Function, onDeleted: Function, bindOnClicks: Function}}
 */
var protocol = {

    /**
     * add or edit
     */
    addToggle : false,

    /**
     * how the user got here
     */
    fromScripts : false,

    /**
     * in script's add/edit page was selected create new protocol (or not)
     */
    createNewSelected : false,

    /**
     * local array of protocols
     */
    protocolIdArray : [],

    /**
     * Handles back button, whether to go to scripts edit page or protocols page
     */
    onBack : function () {
        if(protocol.fromScripts) {
            protocol.fromScripts = false;
            history.back();
        } else {
            $.mobile.changePage($('#' + page.PROTOCOLS), util.backTransOpt);
        }
    },

    /**
     * Loads props from secStorage and loads (updates) Protocols list.
     * If WS not set prompt to go to the settings.
     */
    openView : function(){
        settings.ws.load();

        if (util.isOnline()) {
            if (restConn && restConn.isAuthenticated()) {
                protocol.updateList();

                $(document).on('pagebeforeshow', '#' + page.PROTOCOLS, function() {
                    protocol.bindOnClicks();
                });
                $.mobile.changePage($('#' + page.PROTOCOLS), util.transOpt);

            } else {
                util.toast('You must log in first. Go to settings');
            }
        }
    },

    updateList: function (){
        restConn.readProtocols();
    },

    /**
     * Refreshes list of protocols - from DB.
     *
     * @param array protocols fetched from DB
     */
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
                // ordered desc by created_at
                var lastProtocol = array[0];
                console.log('createNewSelected');
                protocolSelect.selectmenu().val("protocol-id-" + lastProtocol.id).selectmenu('refresh');
            }
         }

        $('.p_item').click(function() {
            protocol.edit($(this).attr("id").replace('protocol-', ''));
        });

        this.refreshList();
    },

    /**
     * Refreshes list - UI component.
     */
    refreshList: function () {
        if($.mobile.activePage.attr('id') == page.PROTOCOLS) {
            $('#protocols_list').listview().listview('refresh');
        }
    },


    /**
     * Edit protocol was clicked - gather texts from input fields and try to save it.
     * @param protocolId
     */
    edit: function(protocolId){
        $('#page_protocols_edit_header h1').html("Edit Protocol");
        protocol.addToggle = false;

        var curProtocol = protocol.protocolIdArray[protocolId];
        $('#hidden_protocol_id').html(curProtocol.id);

        $('#protocol_edit_name').val(curProtocol.name);
        $('#protocol_edit_desc').val(curProtocol.description);
        $('#protocol_edit_type').selectmenu().val(curProtocol.type).selectmenu('refresh');
        $('#protocol_edit_login').val(curProtocol.sshAttr.auth.login);
        $('#protocol_edit_password').val(curProtocol.sshAttr.auth.passwd);
        $('#protocol_edit_port').val(curProtocol.sshAttr.port);
        $('#protocol_edit_role').selectmenu().val(curProtocol.ps_role_id).selectmenu('refresh');

        $('#protocol_edit_footer').show();

        $.mobile.changePage( "#" + page.PROTOCOLS_EDIT, util.transOpt );

    },

    /**
     * Add protocol was clicked - gather texts from input fields and try to save it.
     */
    add : function() {
        $('#page_protocols_edit_header h1').html("Add Protocol");
        protocol.addToggle = true;

        $('#protocol_edit_name').val('');
        $('#protocol_edit_desc').val('');
        $('#protocol_edit_type').selectmenu().val('ssh').selectmenu('refresh');
        $('#protocol_edit_login').val('');
        $('#protocol_edit_password').val('');
        $('#protocol_edit_port').val(22);
        $('#protocol_edit_role').selectmenu().val(2).selectmenu('refresh');

        $('#protocol_edit_footer').hide();

        $('label.error').hide();
        $.mobile.changePage("#" + page.PROTOCOLS_EDIT, util.transOpt);
    },

    /**
     * Delete protocol clicked and confirmed.
     */
    del: function() {

        var protocolId = $('#hidden_protocol_id').html();
        restConn.deleteProtocol(protocolId);

        $.mobile.changePage("#" + page.PROTOCOLS, util.backTransOpt);
    },

    /**
     * Save protocol clicked - determine if edit or add REST method should be used.
     */
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

        console.log('save');
        this.onBack();
    },

    /**
     * Callback when creating new protocol was successful.
     * Add protocol to the list and updateList to keep sync.
     * @param newProtocol
     */
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


    /**
     * Callback when protocol updated successfully, also update protocol-array.
     * UpdateList to keep sync.
     *
     * @param updatedProtocol
     */
    onUpdated : function(updatedProtocol) {
        util.toast('Protocol updated');

        this.protocolIdArray[updatedProtocol.id] = updatedProtocol;
        $('#protocol-' + updatedProtocol.id).html($('#protocol_edit_name').val());

        this.updateList();
    },

    /**
     * Callback when protocol deletion was successful. Update lists then to keep sync.
     * UpdateList to keep sync.
     *
     * @param protocolId
     */
    onDeleted : function (protocolId) {
        util.toast('Protocol deleted');
        $('#protocols_list #' + protocolId).parent().remove();
        this.updateList();

        // invalidate script.protocol_ids -- deselect
        script.scriptIdArray.forEach(function printBr(script, scriptId, array) {
            console.log('??'. script.protocol_id+''+ protocolId);
            if(script.protocol_id == protocolId) {
                script.protocol_id = null;
                console.log('invalidate');
            }
        });

    },

    /**
     * Binds onClick events: back, delete, add, refresh (updateList)
     */
    bindOnClicks : function () {
        $(document).off('click', '#protocol_back_button').on('click', '#protocol_back_button', function (e) {
            protocol.onBack();
        });

        $(document).off('click', '#protocol_update_button').on('click', '#protocol_update_button', function (e) {
            protocol.updateList();
        });

        $(document).off('click', '#protocol_delete_button').on('click', '#protocol_delete_button', function (e) {
            protocol.del();
        });

        $(document).off('click', '#protocol_add_button').on('click', '#protocol_add_button', function (e) {
            protocol.add();
        });
    }
};

/**
 * Protocols edit page form validation.
 * For more info, @see app.js.
 *
 * Based on tut below.
 * @link http://www.sitepoint.com/basic-jquery-form-validation-tutorial/
 */
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

    $(D).ready(function($) {
        JQUERY4U.UTIL.setupFormValidation();
    });
})(jQuery, window, document);