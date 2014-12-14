var overview = {

    url : null,
    username : null,
    password : null,

    openOverview : function () {

        settings.overview.load();

        if (util.isOnline()) {
            if (this.url != null && this.username != null && this.password != null) {
                var url = this.getHttpBasicAuthUrl();
                console.log(url);
                var ref = window.open(url, '_blank', 'location=no');
                //ref.addEventListener('loadstart', function(event) { alert('start: ' + event.url); });
                //ref.addEventListener('loadstart', function(event) { alert('start: ' + event.url); });
                //ref.addEventListener('loadstop', function(event) { alert('stop: ' + event.url); });
                //ref.addEventListener('loaderror', function(event) { alert('error: ' + event.message); });
                //ref.addEventListener('exit', function(event) { alert(event.type); });
            } else {
                util.toast('Monitoring properties not set. Go to Settings first.');
            }
        }
    },

    getHttpBasicAuthUrl : function(){
        var prefix = "";
        if(/^http:\/\//.test(this.url)) {
            prefix = "http://";
        }
        if(/^https:\/\//.test(this.url)) {
            prefix = "https://";
        }

        var urlWOutPrefix = this.url.replace(prefix, '');

        var resUrl = prefix + this.username + ':' + this.password + '@' + urlWOutPrefix;
        return resUrl;
    }



};