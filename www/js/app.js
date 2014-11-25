var page = {
    INDEX: "index",
    OVERVIEW: 'page_overview',
    PROTOCOLS: 'page_protocols',
    SCRIPTS: 'page_scripts',
    SCRIPTS_EDIT: 'page_scripts_edit',
    SETTINGS: 'page_settings',
    SCRIPTS_ADD: 'page_scripts_add'

};

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();

    },
    // Bind Event Listeners
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.addEventListener("backbutton", this.onBackKeyDown, false);
    },

    onDeviceReady: function() {
        app.receivedEvent('deviceready');
     // FIXME nedojde sem
    },

    receivedEvent: function(id) {

        $("#index").trigger("pagecreate"); /*This is like a page refresh in jquery*/

    },

    onBackKeyDown: function () {

        if($.mobile.activePage.attr('id') == page.INDEX) {
            navigator.app.exitApp();
        } else if($.mobile.activePage.attr('id') == page.OVERVIEW) {
            $.mobile.changePage($('#' + page.INDEX), util.backTransOpt);
        } else if($.mobile.activePage.attr('id') == page.SCRIPTS) {
            $.mobile.changePage($('#' + page.INDEX), util.backTransOpt);
        } else if($.mobile.activePage.attr('id') == page.SCRIPTS_EDIT) {
            $.mobile.changePage($('#' + page.SCRIPTS), util.backTransOpt);
        } else if($.mobile.activePage.attr('id') == page.SETTINGS) {
            $.mobile.changePage($('#' + page.INDEX), util.backTransOpt);
        }  else if($.mobile.activePage.attr('id') == page.SCRIPTS_ADD) {
                $.mobile.changePage($('#' + page.SCRIPTS), util.backTransOpt);
        } else {
            history.back();
        }
    }
};

app.initialize();

function testy(){

    secStorage = new SecStorage('tajne_heslo');

    //alert(secStorage.getPassphraseHash());
    //ss.saveToStorage({first : 1, second : 2 }, 'klic_k_datum');
    //var ret = ss.loadFromStorage('klic_k_datum');


    //$('#info_uuid').val(secCryptoJS.SHA512("tajne_heslo"));


    //var encrypted = CryptoJS.TripleDES.encrypt("Message", "Secret Passphrase");
    //
    //var decrypted = CryptoJS.TripleDES.decrypt(encrypted, "Secret Passphrase");
    //
    //alert(decrypted.toString(CryptoJS.enc.Utf8));
}
