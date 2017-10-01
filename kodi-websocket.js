var ws = new WebSocket('ws://groot.cbr:9090/jsonrpc');
ws.onopen = function (event) {
    send_message("Player.GetActivePlayers");
    }

ws.onmessage = function (event) {
    var j = JSON.parse(event.data);

    if (j.id) // response
        {
        // console.log(j)
        switch(j.id) {
            case "Player.GetActivePlayers":
                if (j.result && typeof j.result == 'object') {
                    var r = j.result[0];
                    if (r && r.type == 'video') {
                            send_message("Player.GetItem", { 
                                    "properties": ["file", "streamdetails", "thumbnail", "title", "art", "artist"], 
                                    "playerid": r.playerid,
                                    });
                    }
                } else {
                    document.getElementById("video-name").innerHTML = "Nothing playing right now";
                }
                break;
            case "Player.GetItem":
                //alert(event.data);
                var r = j.result.item;
                document.getElementById("video-name").innerHTML = r.label;
                console.log(r.artist)
                if (r.artist.length) {
                    document.getElementById("video-artist").innerHTML = r.artist.join();    
                }
                else {
                    document.getElementById("video-artist").innerHTML = "";    
                }
                encoded_image_uri = encodeURIComponent(r.thumbnail)
                document.getElementById("video-file").innerHTML = '<img src="http://groot.cbr:8080/image/' + encoded_image_uri + '"/>' ;
                var v = r.streamdetails.video[0];
                //document.getElementById("video-details").innerHTML = v.width + 'x' + v.height + ', ' + v.duration + 's';
                break;
            default:
                //alert(event.data);
            }
        }
    else // notification
        {
        // console.log(j)
        switch(j.method) {
            case "Player.OnPlay":
                send_message("Player.GetActivePlayers");
                break;
            case "Player.OnStop":
                document.getElementById("video-name").innerHTML = "Nothing playing right now";
                document.getElementById("video-file").innerHTML = "";
                document.getElementById("video-artist").innerHTML = "";
                //document.getElementById("video-details").innerHTML = "";
                break;
            default:
                //alert(event.data);
            }
        }
    }

function send_message(method, params) {
    var msg = {
        "jsonrpc": "2.0", 
        "method": method, 
        "id": method
    };
    if (params) {
        msg.params = params;
    }
    ws.send(JSON.stringify(msg));
}