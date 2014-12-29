/**
 * @author Petr Marek
 * Licence Apache 2.0, see below link
 * @link http://www.apache.org/licenses/LICENSE-2.0
 */

/**
 * secStorage object is a secure wrapper for localStorage. It encrypts provided JSON
 * object with provided passphrase. When passphrase is forgotten,
 * newone could be created, but all data saved with old passphrase will be deleted.
 *
 * @type {{HASHED_PASS_KEY: string, instance: (util.UNDEF|*), isInstanceSet: Function, forgetPass: Function, submitPass: Function, setForgetPassProp: Function}}
 */
var secStorage = {
    HASHED_PASS_KEY: 'hashed_pass',
    instance : util.UNDEF,

    /**
     * Checks if the instance is set.
     * @returns {*|boolean}
     */
    isInstanceSet : function() {
        return (this.instance && this.instance != util.UNDEF);
    },

    /**
     * Forgets passphrase and deletes all encrypted data. It prompts the user
     * to enter new passphrase.
     */
    forgetPass : function() {

        util.storage.removeItem(secStorage.HASHED_PASS_KEY);

        settings.overview.del();
        settings.ws.del();

        if(secStorage.isInstanceSet()){
            this.instance.removePass();
        }

        this.setForgetPassProp();

        util.toast('Passphrase has been deleted. Please, enter new one.');
    },

    /**
     * Submits passphrase - initiates secStorage wrapper.
     * @param pin
     */
    submitPass : function(pin) {
        this.instance = new SecStorage(pin);
    },

    /**
     * Helper method when passphrase is forgotten - sets UI components.
     */
    setForgetPassProp: function(){
        $('#enterpin_pin').val('');
        $( "#dialog_unlock_forget" ).popup( "close" );
        $( "#unlock_hedline" ).html('Enter new passphrase');
        $( "#unlock_hedline" ).css('width', '10em');
        $( "#submit_pin" ).html('Enter');
    }


};

/**
 * Secure storage - localStorage wrapper.
 * It creates new password or checks the old one, depends
 * if passphrase hash is present in localStorage.
 *
 * @param pass
 * @constructor SecStorage
 */
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

    /**
     * Encrypts stringified JSON object and saves it with corresponding key.
     *
     * @param json object to be encrypted and stored
     * @param key
     * @returns {boolean}
     */
    this.saveToStorage = function (json, key) {
        if (typeof _passSet != util.UNDEF && _passSet == true) {
            var encrypted = CryptoJS.TripleDES.encrypt(JSON.stringify(json), _pass);
            util.storage.setItem(key, encrypted);
            return true
        }
        return false
    };

    /**
     * Loads encrypted stringified JSON object with corresponding key.
     * Then it decrypts the object with provided passphrase and returns plain JSON object.
     *
     * @param key
     * @returns json object - decrypted
     */
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


};
