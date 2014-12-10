/**
 * Created by sange on 11/24/14.
 */


RestConnector = function() {
    var apiKey = util.UNDEF;

    this.auth = function(url, username, password) {

        var client = new $.RestClient(url);
        client.add('login');

        if(util.isOnline()) {
            var req = client.login.create({
                email: username,
                password: password
            });

            req.done(function (data) {
                if (data.ws.error == false) {
                    apiKey = data.data.apiKey;
                    if (apiKey != null && apiKey != '') {
                        alert('Logged in!: ' + apiKey);
                        settings.ws.save(restConn.getApiKey(), url, username, password);
                    }
                } else {
                    alert('Error: ' + data.ws.message);
                }
            });

            req.fail(function (xhr, result, statusText) {
                alert('Error: Maybe wrong URL?');
            });
        } else {
            util.toast('Offline. Could not proceed.');
        }
    };

    this.register = function(url, username, password, name) {

        var client = new $.RestClient(url);
        client.add('register');

        if(util.isOnline()) {
            var req = client.register.create({
                email: username,
                password: password,
                name: name
            });

            req.done(function (data) {
                if (data.ws.error == false) {
                    alert('Successfully registered.');
                    $("#ws_hidden_name").hide();
                    $("#submit_settings_ws").html('Login & Save');
                    if ($('#ws_register').is(":checked")) {
                        $('#ws_register').prop('checked', false).checkboxradio('refresh');
                    }
                } else {
                    alert('Error: ' + data.ws.message);
                }
            });

            req.fail(function (xhr, result, statusText) {
                alert('Error: Maybe wrong URL?');
            });
        } else {
            util.toast('Offline. Could not proceed.');
        }
    };

    this.getApiKey = function(){
        return apiKey;
    };

    this.setApiKey = function(ak){
        apiKey = ak;
    };
};

var restConn = new RestConnector();