/**
 * Created by sange on 11/24/14.
 */

var secStorage = {
    HASHED_PASS_KEY: 'hashed_pass',
    instance : util.UNDEF,

    forgetPass : function() {
        $('#enterpin_pin').val('');
        util.storage.removeItem(secStorage.HASHED_PASS_KEY);
        if(this.instance != util.UNDEF){
            this.instance.removePass();
        }
        alert('Passphrase deleted, enter new one.');
    },

    submitPass : function() {
        this.instance = new SecStorage($('#enterpin_pin').val());
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
            $('#enterpin_pin').val('');
        }
    } else {
        // newly entered
        util.storage.setItem(secStorage.HASHED_PASS_KEY, hash);
        _pass = pass;
        _passSet = true;
        $.mobile.changePage($('#' + page.INDEX), util.transOpt);
    }

    this.saveToStorage = function (json, key) {
        if (typeof _passSet != util.UNDEF && _passSet == true) {
            var encrypted = CryptoJS.TripleDES.encrypt(JSON.stringify(json), _pass);
            util.storage.setItem(key, encrypted);
        }
    };

    this.loadFromStorage = function (key) {
        var encrypted = util.storage.getItem(key);

        if (typeof _passSet != util.UNDEF && _passSet == true && encrypted != null) {
            var decrypted = CryptoJS.TripleDES.decrypt(encrypted, _pass);
            return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
        }
        return null;
    };

    //this.isPassSet = function () {
    //    if (typeof _passSet != util.UNDEF && _passSet == true) {
    //        return true;
    //    }
    //    return false;
    //};
    //
    //this.unSetPass = function () {
    //    _passSet = false;
    //    _pass = util.UNDEF;
    //};
    //
    //this.setPass= function (pass) {
    //    _passSet = true;
    //    _pass = CryptoJS.SHA512(pass);
    //};

    this.removePass = function () {
        _pass = util.UNDEF;
        _passSet = false;
    };


}
