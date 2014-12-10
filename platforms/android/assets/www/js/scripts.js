/**
 * Created by sange on 11/21/14.
 */


var script = {

    listObject: {
        itemID : null,
        add: false
    },

    scriptIdArray : [],

    openView : function(){
        settings.ws.load();
        $.mobile.changePage($('#' + page.SCRIPTS), util.transOpt);

        script.updateList();
    },

    updateList: function (){
        if(settings.ws.storageObject != null){
            restConn.readScripts(settings.ws.storageObject.url);
        }
    },

    refreshItems: function(array){
        this.scriptIdArray = [];

        for(var i = 0; i < array.length; i++){
            var currentScript = array[i];
            // extract ids
            this.scriptIdArray[currentScript.id] = currentScript;

            $('#scripts_list').append(
                '<li class="item"><a class="edit_item" id="' +
                currentScript.id
                + '" onclick="script.edit(' +
                currentScript.id
                + ');">' +
                currentScript.name
                + '</a><a onclick="script.runScript(' +
                currentScript.id
                + ');"></a></li>'
            );
        }

        this.refreshList();
    },

    refreshList: function () {
        $('#scripts_list').listview('refresh');
    },



    edit: function(scriptId){
        if(event.handled !== true) {
            // TODO WS
            script.listObject.itemID = scriptId;
            script.listObject.add = false;
            $.mobile.changePage( "#" + page.SCRIPTS_EDIT, util.transOpt );
            event.handled = true;
        }
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
    }

};

$(document).on('pagebeforeshow', '#' + page.SCRIPTS, function(){
    script.refreshList();
});

$(document).on('pagebeforeshow', '#' + page.SCRIPTS_EDIT, function(){

    if(script.listObject.add) {
        $('#page_scripts_edit_header h1').html("Add script");
        $('#script_edit_name').val("");
        $('#script_edit_desc').val("");
        $('#script_edit_ip').val("");
        $('#script_edit_footer').hide();
    } else {
        $('#page_scripts_edit_header h1').html("Edit Script");

        var curScript = script.scriptIdArray[script.listObject.itemID];
        $('#script_edit_name').val(curScript.name);
        $('#script_edit_desc').val(curScript.description);
        $('#script_edit_content').val(curScript.content);
        $('#script_edit_ip').val(curScript.address);
        // TODO az budou protokoly
        $('#script_edit_protocol').val(script.protocol_id);
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
                    script_edit_content: "required"
                },
                messages: {
                    script_edit_name: "Please enter name.",
                    script_edit_ip: "Please enter IP address.",
                    script_edit_content: "Please enter content."
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