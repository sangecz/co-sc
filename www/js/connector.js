/**
 * Created by sange on 11/24/14.
 */

var connector = {

    auth : function (){

        var val = "*" + secStorage.getPassphraseHash() + "*";
        var formdata = { passphrase : val  };

        $.ajax({
            type       : "POST",
            data       : formdata,
            //url        : "https://editor:editor@sange-icinga.hukot.net/co-sc/check_pass.php",
            url        : "https://editor:editor@10.0.0.38/co-sc/check_pass.php",
            crossDomain: true,
            beforeSend : function() {$.mobile.loading('show')},
            complete   : function() {$.mobile.loading('hide')},
            dataType   : 'json',
            success    : function(response) {
                alert(JSON.stringify(response));
            },
            error      : function(response) {
                alert('Connection problem! ' + JSON.stringify(response));
            }
        });

    },

    isNetworkAvailable: function() {
        var networkState = navigator.connection.type;
        if(networkState != Connection.NONE) {
            alert('Network is not available');
        }
    }

};