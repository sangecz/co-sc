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
        this.client = new $.RestClient(url, this.authOpts);
        this.client.add('register');
        this.client.add('login');
        this.client.add('scripts');
        this.client.add('protocols');
    },

    deleteScript : function(scriptId) {
        $.mobile.loading('show');

        if(util.isOnline()) {
            var req = this.client.scripts.del(scriptId);

            this.handleRequest(req, function() {
                script.onDeleted(scriptId);
            });
        }
    },

    updateScript : function(updatedScript, scriptId) {
        $.mobile.loading('show');

        if(util.isOnline()) {
            var req = this.client.scripts.update(scriptId, {
                script : JSON.stringify(updatedScript)
            });

            this.handleRequest(req, function() {
                script.onUpdated(updatedScript);
            });
        }
    },

    createScript : function(newScript) {
        $.mobile.loading('show');

        if(util.isOnline()) {
            var req = this.client.scripts.create({
                script : JSON.stringify(newScript)
            });

            this.handleRequest(req, function() {
                script.onCreated(newScript);
            });
        }
    },

    runScript : function(scriptId) {
        $.mobile.loading('show');

        if(util.isOnline()) {
            var req = this.client.scripts.read(scriptId);

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
            var req = this.client.scripts.read();

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

    auth : function(username, password) {

        $.mobile.loading('show');

        if(util.isOnline()) {
            var req = this.client.login.create({
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
            var req = this.client.register.create({
                email: username,
                password: password,
                name: name
            });

            this.handleRequest(req, function() {
                settings.ws.onRegistered();
            });
        }
    },

    setURL : function(urlIn) {
        this.url = urlIn;
    },

    setApiKey : function (apikey) {
       this.authOpts.apiKey = apikey;
    },

    isAuthenticated : function () {
        return (this.authOpts.apiKey != util.UNDEF)
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

