/**
 * Created by sange on 11/24/14.
 */


RestConnector = function() {

    var authOpts = {
        apiKey : null
    };

    //var client = new $.RestClient(url, authOpts);

    this.handleRequest = function (req, callback) {

        req.done(function (data) {
            if (data.ws.error == false) {
                callback();
            } else {
                util.toast('Error: ' + data.ws.message);
            }
            $.mobile.loading('hide');
            client = null;
        });

        req.fail(function(x, y, z){
            restConn.failHandler(client, x, y, z);
        });
    };

    this.deleteScript = function(url, scriptId) {
        $.mobile.loading('show');

        var client = new $.RestClient(url, authOpts);
        client.add('scripts');

        if(util.isOnline()) {
            var req = client.scripts.del(scriptId);

            // testing.
            this.handleRequest(req, function() {
                script.onDeleted(scriptId);
            });

            //req.done(function (data) {
            //    if (data.ws.error == false) {
            //        script.onDeleted(scriptId);
            //    } else {
            //        util.toast('Error: ' + data.ws.message);
            //    }
            //    $.mobile.loading('hide');
            //    client = null;
            //});
            //
            //req.fail(function(x, y, z){
            //    restConn.failHandler(client, x, y, z);
            //});
        }
    };

    this.updateScript = function(url, updatedScript, scriptId) {
        $.mobile.loading('show');

        var client = new $.RestClient(url, authOpts);
        client.add('scripts');

        if(util.isOnline()) {
            var req = client.scripts.update(scriptId, { script : JSON.stringify(updatedScript)});
            req.done(function (data) {
                if (data.ws.error == false) {
                    script.onUpdated(updatedScript);
                } else {
                    util.toast('Error: ' + data.ws.message);
                }
                $.mobile.loading('hide');
                client = null;
            });

            req.fail(function(x, y, z){
                restConn.failHandler(client, x, y, z);
            });
        }
    };

    this.createScript = function(url, newScript) {
        $.mobile.loading('show');

        var client = new $.RestClient(url, authOpts);
        client.add('scripts');

        if(util.isOnline()) {
            var req = client.scripts.create({ script : JSON.stringify(newScript)});

            req.done(function (data) {
                if (data.ws.error == false) {
                    script.onCreated(newScript);
                } else {
                    util.toast('Error: ' + data.ws.message);
                }
                $.mobile.loading('hide');
                client = null;
            });

            req.fail(function(x, y, z){
                restConn.failHandler(client, x, y, z);
            });
        }
    };

    this.runScript = function(url, scriptId) {
        $.mobile.loading('show');

        var client = new $.RestClient(url, authOpts);
        client.add('scripts');

        if(util.isOnline()) {
            var req = client.scripts.read(scriptId);

            req.done(function (data) {
                if (data.ws.error == false) {
                    script.showResult(data);
                } else {
                    util.toast('Error: ' + data.ws.message);
                }
                $.mobile.loading('hide');
                client = null;
            });

            req.fail(function(x, y, z){
                restConn.failHandler(client, x, y, z);
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

            req.fail(function(x, y, z){
                restConn.failHandler(client, x, y, z);
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
                    settings.ws.onAuth(data.data.apiKey, url, username, password);
                } else {
                    util.toast('Error: ' + data.ws.message);
                }
                $.mobile.loading('hide');
                client = null;

            });

            req.fail(function(x, y, z){
                restConn.failHandler(client, x, y, z);
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
                    settings.ws.onRegistered();
                } else {
                    util.toast('Error: ' + data.ws.message);
                }
                $.mobile.loading('hide');
                client = null;
            });

            req.fail(function(x, y, z){
                restConn.failHandler(client, x, y, z);
            });
        }
    };

    this.setApiKey = function (apikey) {
       authOpts.apiKey = apikey;
    };

    this.failHandler = function (client, x, y, z) {
        util.toastLong('Error: ' + JSON.parse(x.responseText).ws.message);
        $.mobile.loading('hide');
        client = null;
    };
};

var restConn = new RestConnector();