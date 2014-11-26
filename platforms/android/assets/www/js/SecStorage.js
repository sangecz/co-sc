/**
 * Created by sange on 11/24/14.
 */

var secStorage = {
    HASHED_PIN_KEY: 'hashed_pin'
};

SecStorage = function (pass) {

    var _pass = CryptoJS.SHA512(pass);
    var _passSet = true;

    //this.saveToStorage = function (json, key) {
    //    if (typeof _passSet != util.UNDEF && _passSet == true) {
    //        var encrypted = CryptoJS.TripleDES.encrypt(JSON.stringify(json), _pass);
    //        util.storage.setItem(key, encrypted);
    //    } else {
    //        alert('PIN is not set');
    //    }
    //};
    //
    //this.loadFromStorage = function (key) {
    //    var encrypted = util.storage.getItem(key);
    //
    //    if (typeof _passSet != util.UNDEF && _passSet == true) {
    //        var decrypted = CryptoJS.TripleDES.decrypt(encrypted, _pass);
    //        return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
    //    } else {
    //        alert('PIN is not set');
    //    }
    //};

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

    this.getPassphraseHash = function () {
        return _pass;
    };

    this.setPassphrase = function (pass) {
        _pass = CryptoJS.SHA512(pass);
    }
}
