cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.badrit.MacAddress/www/MacAddress.js",
        "id": "com.badrit.MacAddress.MacAddress",
        "clobbers": [
            "window.MacAddress"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.inappbrowser/www/inappbrowser.js",
        "id": "org.apache.cordova.inappbrowser.inappbrowser",
        "clobbers": [
            "window.open"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.badrit.MacAddress": "0.1.0",
    "org.apache.cordova.device": "0.2.12",
    "org.apache.cordova.inappbrowser": "0.5.3"
}
// BOTTOM OF METADATA
});