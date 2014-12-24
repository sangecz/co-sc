/**
 * Created by sange on 11/24/14.
 */
testConn = {
    testMonitoringURL : function () {
        if(util.isOnline()) {
            var url = $('#' + settings.overview.URL_ID).val();
            var username = $('#' + settings.overview.USERNAME_ID).val();
            var password = $('#' + settings.overview.PASSWORD_ID).val();

            var urlStr =  overview.getHttpBasicAuthUrl(username, password, url);

            var jqxhr = $.get( urlStr, function() {
                alert( "success" );
                settings.overview.save();
            })
                .fail(function() {
                    if(jqxhr.status == 404) {
                        util.toastLong("Error: URL not found.");
                    } else if (jqxhr.status == 401) {
                        util.toastLong("Error: Invalid credentials.");
                    } else {
                        util.toastLong("Error: Something went wrong.");
                    }
                });
                //.always(function() {
                //    alert( "finished" );
                //});
        }
    }
};

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
        if(util.isOnline()) {
            $.mobile.loading('show');
            var req = restConn.client.scripts.del(scriptId);

            restConn.handleRequest(req, function() {
                script.onDeleted(scriptId);
            });
        }
    },

    deleteProtocol : function(protocolId) {
        if(util.isOnline()) {
            $.mobile.loading('show');
            var req = restConn.client.protocols.del(protocolId);

            restConn.handleRequest(req, function() {
                protocol.onDeleted(protocolId);
            });
        }
    },

    updateScript : function(updatedScript, scriptId) {
        if(util.isOnline()) {
            $.mobile.loading('show');
            var req = restConn.client.scripts.update(scriptId, {
                script : JSON.stringify(updatedScript)
            });

            restConn.handleRequest(req, function() {
                script.onUpdated(updatedScript);
            });
        }
    },

    updateProtocol : function(updatedProtocol, protocolId) {
        var prot = {
            protocol : JSON.stringify(updatedProtocol)
        };

        if(util.isOnline()) {
            $.mobile.loading('show');
            var req = restConn.client.protocols.update(protocolId, prot);

            restConn.handleRequest(req, function() {
                protocol.onUpdated(updatedProtocol);
            });
        }
    },

    createScript : function(newScript) {
        if(util.isOnline()) {
            $.mobile.loading('show');
            var req = restConn.client.scripts.create({
                script : JSON.stringify(newScript)
            });

            restConn.handleRequest(req, function() {
                script.onCreated(newScript);
            });
        }
    },

    createProtocol : function(newProtocol) {
        var prot = {
            protocol : JSON.stringify(newProtocol)
        };

        if(util.isOnline()) {
            $.mobile.loading('show');
            var req = restConn.client.protocols.create(prot);

            restConn.handleRequest(req, function() {
                protocol.onCreated(newProtocol);
            });
        }
    },

    runScript : function(scriptId) {
        if(util.isOnline()) {
            $.mobile.loading('show');
            var req = restConn.client.scripts.read(scriptId);

            req.done(function (data) {
                if (data.ws.error == false) {
                    script.showResult(data);
                } else {
                    util.toast('Error: ' + data.ws.message);
                    console.log('Error: ' + data.ws.message);
                }
                $.mobile.loading('hide');
            });

            req.fail(function(x, y, z){
                util.toastLong('Error: ' + JSON.parse(x.responseText).ws.message);
                console.log('Error: ' + JSON.parse(x.responseText).ws.message);
                $.mobile.loading('hide');
            });
        }
    },

    readScripts : function () {
        if(util.isOnline()) {
            $.mobile.loading('show');
            var req = restConn.client.scripts.read();

            console.log('readScripts');

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
        if(util.isOnline()) {
            $.mobile.loading('show');

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
        if(util.isOnline()) {
            $.mobile.loading('show');

            var req = restConn.client.login.create({
                email: username,
                password: password
            });

            req.done(function (data) {
                if (data.ws.error == false) {
                    restConn.authOpts.apiKey = data.data.apiKey;
                    // stays saved until first restart, must be loaded
                    restConn.init(restConn.url);
                    settings.ws.onAuth(restConn.authOpts.apiKey, restConn.url, username, password);
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
        if(util.isOnline()) {
            $.mobile.loading('show');

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
    },


};

