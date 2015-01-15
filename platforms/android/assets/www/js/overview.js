/**
 * Module: overview, it corresponds with app section: Monitoring
 *
 * @type {{url: null, username: null, password: null, openOverview: Function, getHttpBasicAuthUrl: Function}}
 */
var overview = {

    url : null,
    username : null,
    password : null,

    /**
     * Loads overview props. when set, then opens InAppBrowser window
     * with provided URL and credentials.
     */
    openOverview : function () {

        settings.overview.load();

        if (util.isOnline()) {
            if (this.url != null && this.username != null && this.password != null) {
                var url = this.getHttpBasicAuthUrl(this.username, this.password, this.url);
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

    /**
     * Creates HTTP basic auth URL.
     *
     * @param username
     * @param password
     * @param url
     * @returns string url
     */
    getHttpBasicAuthUrl : function(username, password, url){
        var prefix = "";
        if(/^http:\/\//.test(url)) {
            prefix = "http://";
        }
        if(/^https:\/\//.test(url)) {
            prefix = "https://";
        }

        var urlWOutPrefix = url.replace(prefix, '');

        var resUrl = prefix + username + ':' + password + '@' + urlWOutPrefix;
        return resUrl;
    }



};