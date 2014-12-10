/**
 * Created by sange on 11/24/14.
 */

var secStorage = {
    HASHED_PASS_KEY: 'hashed_pass',
    instance : util.UNDEF,

    forgetPass : function() {

        util.storage.removeItem(secStorage.HASHED_PASS_KEY);
        util.storage.removeItem(settings.ws.STORAGE_KEY);
        util.storage.removeItem(settings.overview.STORAGE_KEY);

        if(this.instance != util.UNDEF){
            this.instance.removePass();
        }

        this.setForgetPassProp();

        util.toast('Passphrase has been deleted. Please, enter new one.');
    },

    submitPass : function() {
        this.instance = new SecStorage($('#enterpin_pin').val());
    },

    setForgetPassProp: function(){
        $('#enterpin_pin').val('');
        $( "#dialog_unlock_forget" ).popup( "close" );
        $( "#unlock_hedline" ).html('Enter new passphrase');
        $( "#unlock_hedline" ).css('width', '10em');
        $( "#submit_pin" ).html('Enter');
    }
};

SecStorage = function (pass) {

    var _passSet = false;
    var _pass;
    var hash = CryptoJS.SHA512(pass);
    var hashedPass = util.storage.getItem(secStorage.HASHED_PASS_KEY);

    if (typeof hashedPass != util.UNDEF && hashedPass != null) {
        // already exists-load
        if(hash == hashedPass) {
            _pass = pass;
            _passSet = true;
            $.mobile.changePage($('#' + page.INDEX), util.transOpt);
        } else {
            util.toast('Wrong passphrase.');
            $('#enterpin_pin').val('');
        }
    } else {
        // newly entered
        util.toast('New passphrase created.');
        util.storage.setItem(secStorage.HASHED_PASS_KEY, hash);
        _pass = pass;
        _passSet = true;
        $.mobile.changePage($('#' + page.INDEX), util.transOpt);
    }

    this.saveToStorage = function (json, key) {
        if (typeof _passSet != util.UNDEF && _passSet == true) {
            var encrypted = CryptoJS.TripleDES.encrypt(JSON.stringify(json), _pass);
            util.storage.setItem(key, encrypted);
            return true
        }
        return false
    };

    this.loadFromStorage = function (key) {
        var encrypted = util.storage.getItem(key);

        if (typeof _passSet != util.UNDEF && _passSet == true && encrypted != null) {
            var decrypted = CryptoJS.TripleDES.decrypt(encrypted, _pass);
            if(decrypted != null && decrypted != '') {
                return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
            } else {
                return null;
            }
        }
        return null;
    };

    this.removePass = function () {
        _pass = util.UNDEF;
        _passSet = false;
    };


}
