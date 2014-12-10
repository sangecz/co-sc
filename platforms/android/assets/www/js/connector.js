/**
 * Created by sange on 11/24/14.
 */


RestConnector = function() {

    var authOpts = {
        apiKey : null
    };

    this.runScript = function(url, id) {
        $.mobile.loading('show');

        var client = new $.RestClient(url, authOpts);
        client.add('scripts');

        if(util.isOnline()) {
            var req = client.scripts.read(id);

            req.done(function (data) {
                if (data.ws.error == false) {
                    script.showResult(data);
                } else {
                    util.toast('Error: ' + data.ws.message);
                }
                $.mobile.loading('hide');
                client = null;
            });

            req.fail(function(x, y, y){
                restConn.failHandler(client);
            });
        }
    };

    this.readScripts = function (url) {
        $.mobile.loading('show');

        var client = new $.RestClient(url, authOpts);
        client.add('scripts');

        if(util.isOnline()) {
            var req = client.scripts.read();

            req.done(function (data) {
                if (data.ws.error == false) {
                    script.refreshItems(data.data.scripts);
                } else {
                    util.toast('Error: ' + data.ws.message);
                }
                $.mobile.loading('hide');
                client = null;
            });

            req.fail(function(x, y, y){
                restConn.failHandler(client);
            });
        }
    };

    this.auth = function(url, username, password) {

        $.mobile.loading('show');

        var client = new $.RestClient(url);
        client.add('login');

        if(util.isOnline()) {
            var req = client.login.create({
                email: username,
                password: password
            });

            req.done(function (data) {
                if (data.ws.error == false) {
                    // stays saved until first restart, must be loaded
                    authOpts.apiKey = data.data.apiKey;
                    if (authOpts.apiKey != null && authOpts.apiKey != '') {
                        //alert('Logged in!: ' + authOpts.apiKey);
                        settings.ws.save(authOpts.apiKey, url, username, password);
                    }
                } else {
                    util.toast('Error: ' + data.ws.message);
                }
                $.mobile.loading('hide');
                client = null;

            });

            req.fail(function(x, y, y){
                restConn.failHandler(client);
            });
        }
    };

    this.register = function(url, username, password, name) {

        $.mobile.loading('show');

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
                    util.toast('Error: ' + data.ws.message);
                }
                $.mobile.loading('hide');
                client = null;
            });

            req.fail(function(x, y, y){
                restConn.failHandler(client);
            });
        }
    };

    this.setApiKey = function (apikey) {
       authOpts.apiKey = apikey;
    };

    this.failHandler = function (client) {
        util.toast('Error: Maybe wrong URL?');
        $.mobile.loading('hide');
        client = null;
    };
};

var restConn = new RestConnector();