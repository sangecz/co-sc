var overview = {

    url : null,
    username : null,
    password : null,

    openOverview : function () {

        settings.overview.load();

        if (util.isOnline()) {
            if (this.url != null && this.username != null && this.password != null) {
                var url = this.getHttpBasicAuthUrl();
                window.open(url, '_blank', 'location=no');
            } else {
                util.toast('Monitoring properties not set. Go to Settings first.');
            }
        } else {
            util.toast('Offline. Could not proceed.');
        }
    },

    getHttpBasicAuthUrl : function(){
        var prefix = "";
        if(/^http:\/\//.test(this.url)) {
            prefix = "http://";
        }
        if(/^https:\/\//.test(this.url)) {
            prefix = "https//";
        }

        var urlWOutPrefix = this.url.replace(prefix, '');

        var resUrl = prefix + this.username + ':' + this.password + '@' + urlWOutPrefix;
        return resUrl;
    }



};