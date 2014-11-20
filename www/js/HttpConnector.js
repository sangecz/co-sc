/**
 * Created by sange on 11/18/14.
 */

var label = document.getElementById('conn-state');


function checkConnection() {
    var networkState = navigator.connection.type;

    // true if connected
    if(networkState != Connection.NONE) {
        label.innerHTML = "Connected";
    } else {
        label.innerHTML = "NOT Connected";
    }
}

document.addEventListener("deviceready", checkConnection, false);

function testHTTP(){
    $('#resp').text('ssssss');

    var httpReq = new plugin.HttpRequest();

    httpReq.post("http://10.0.0.38/co-sc_ws/check.php",
        //"http://10.0.0.38/co-sc_ws/list_dir.php",
        {
            //json: '{ "host" : "10.0.0.38", "protocol" : {"type" : "ssh",' +
            //    '"sshAttr": { "auth": { "login": "sange", "passwd": "sange"}' +
            //'} },' +
            //'"cmd": {  "path": "/bin" } }'
        },
        function(err, data) {
            alert(JSON.stringify(data) + "<fff>" + err);
        }
    );
}

function resizeOverviewFrame(id){
    var newheight;
    var newwidth;

    if(document.getElementById){
        newheight=document.getElementById(id).contentWindow.document .body.scrollHeight;
        newwidth=document.getElementById(id).contentWindow.document .body.scrollWidth;
    }

    document.getElementById(id).height= (newheight) + "px";
    //document.getElementById(id).width= (newwidth) + "px";

}