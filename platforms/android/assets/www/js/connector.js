/**
 * Created by sange on 11/24/14.
 */

var restConn =  {

    url : util.UNDEF,
    client : '',
    authOpts : {
        apiKey : util.UNDEF
    },

    init : function(url) {
        restConn.client = new $.RestClient(url, restConn.authOpts);
        restConn.client.add('register');
        restConn.client.add('login');
        restConn.client.add('scripts');
        restConn.client.add('protocols');
    },

    deleteScript : function(scriptId) {
        $.mobile.loading('show');

        if(util.isOnline()) {
            var req = restConn.client.scripts.del(scriptId);

            restConn.handleRequest(req, function() {
                script.onDeleted(scriptId);
            });
        }
    },

    deleteProtocol : function(protocolId) {
        $.mobile.loading('show');

        if(util.isOnline()) {
            var req = restConn.client.protocols.del(protocolId);

            restConn.handleRequest(req, function() {
                protocol.onDeleted(protocolId);
            });
        }
    },

    updateScript : function(updatedScript, scriptId) {
        $.mobile.loading('show');

        if(util.isOnline()) {
            var req = restConn.client.scripts.update(scriptId, {
                script : JSON.stringify(updatedScript)
            });

            restConn.handleRequest(req, function() {
                script.onUpdated(updatedScript);
            });
        }
    },

    updateProtocol : function(updatedProtocol, protocolId) {
        $.mobile.loading('show');
        var prot = {
            protocol : JSON.stringify(updatedProtocol)
        };

        if(util.isOnline()) {
            var req = restConn.client.protocols.update(protocolId, prot);

            restConn.handleRequest(req, function() {
                protocol.onUpdated(updatedProtocol);
            });
        }
    },

    createScript : function(newScript) {
        $.mobile.loading('show');

        if(util.isOnline()) {
            var req = restConn.client.scripts.create({
                script : JSON.stringify(newScript)
            });

            restConn.handleRequest(req, function() {
                script.onCreated(newScript);
            });
        }
    },

    createProtocol : function(newProtocol) {
        $.mobile.loading('show');
        var prot = {
            protocol : JSON.stringify(newProtocol)
        };

        if(util.isOnline()) {
            var req = restConn.client.protocols.create(prot);

            restConn.handleRequest(req, function() {
                protocol.onCreated(newProtocol);
            });
        }
    },

    runScript : function(scriptId) {
        $.mobile.loading('show');

        if(util.isOnline()) {
            var req = restConn.client.scripts.read(scriptId);

            req.done(function (data) {
                if (data.ws.error == false) {
                    script.showResult(data);
                } else {
                    util.toast('Error: ' + data.ws.message);
                }
                $.mobile.loading('hide');
            });

            req.fail(function(x, y, z){
                util.toastLong('Error: ' + JSON.parse(x.responseText).ws.message);
                $.mobile.loading('hide');
            });
        }
    },

    readScripts : function () {
        $.mobile.loading('show');

        if(util.isOnline()) {
            var req = restConn.client.scripts.read();

            req.done(function (data) {
                if (data.ws.error == false) {
                    script.refreshItems(data.data.scripts);
                } else {
                    util.toast('Error: ' + data.ws.message);
                }
                $.mobile.loading('hide');
            });

            req.fail(function(x, y, z){
                util.toastLong('Error: ' + JSON.parse(x.responseText).ws.message);
                $.mobile.loading('hide');
            });
        }
    },

    readProtocols : function () {
        $.mobile.loading('show');

        if(util.isOnline()) {
            var req = restConn.client.protocols.read();

            req.done(function (data) {
                if (data.ws.error == false) {
                    protocol.refreshItems(data.data.protocols);
                } else {
                    util.toast('Error: ' + data.ws.message);
                }
                $.mobile.loading('hide');
            });

            req.fail(function(x, y, z){
                util.toastLong('Error: ' + JSON.parse(x.responseText).ws.message);
                $.mobile.loading('hide');
            });
        }
    },

    auth : function(username, password) {

        $.mobile.loading('show');

        if(util.isOnline()) {
            var req = restConn.client.login.create({
                email: username,
                password: password
            });

            req.done(function (data) {
                if (data.ws.error == false) {
                    // stays saved until first restart, must be loaded
                    restConn.authOpts.apiKey = data.data.apiKey;
                    settings.ws.onAuth(data.data.apiKey, restConn.url, username, password);
                } else {
                    util.toast('Error: ' + data.ws.message);
                }
                $.mobile.loading('hide');
            });

            req.fail(function(x, y, z){
                util.toastLong('Error: ' + JSON.parse(x.responseText).ws.message);
                $.mobile.loading('hide');
            });
        }
    },

    register : function(username, password, name) {

        $.mobile.loading('show');

        if(util.isOnline()) {
            var req = restConn.client.register.create({
                email: username,
                password: password,
                name: name
            });

            restConn.handleRequest(req, function() {
                settings.ws.onRegistered();
            });
        }
    },

    setURL : function(urlIn) {
        restConn.url = urlIn;
    },

    setApiKey : function (apikey) {
        restConn.authOpts.apiKey = apikey;
    },

    isAuthenticated : function () {
        return (restConn.authOpts.apiKey != util.UNDEF)
    },

    handleRequest : function (req, callback) {

        req.done(function (data) {
            if (data.ws.error == false) {
                callback();
            } else {
                util.toast('Error: ' + data.ws.message);
            }
            $.mobile.loading('hide');
        });

        req.fail(function(x, y, z){
            util.toastLong('Error: ' + JSON.parse(x.responseText).ws.message);
            $.mobile.loading('hide');
        });
    }
};

