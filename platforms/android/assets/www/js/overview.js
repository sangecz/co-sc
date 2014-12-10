var overview = {

    url : util.UNDEF,
    username : util.UNDEF,
    password : util.UNDEF,

    openOverview : function () {

        settings.overview.load();

        if (util.isOnline()) {
            if (this.url != util.UNDEF && this.username != util.UNDEF && this.password != util.UNDEF) {
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