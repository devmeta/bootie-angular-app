angular.module('api', [])

.factory('ApiService', function ($http, toaster, urls) {

    var serviceBase = urls.BASE_API;
    var obj = {};
    
    obj.toast = function (data) {
        toaster.pop(data.status, "", data.message, 10000, 'trustedHtml');
    }
    obj.get = function (q) {
        return $http.get(serviceBase + q, { cache : get_cache(q) }).then(function (results) {
            return results.data;
        });
    };
    obj.post = function (q, object) {
        return $http.post(serviceBase + q, object).then(function (results) {
            return results.data;
        });
    };
    obj.put = function (q, object) {
        return $http.put(serviceBase + q, object).then(function (results) {
            return results.data;
        });
    };
    obj.delete = function (q) {
        return $http.delete(serviceBase + q).then(function (results) {
            return results.data;
        });
    };

    return obj;
})


.factory('SocketService', function (toaster, urls) {

    var obj = {};
    var socket = null;

    obj.connect = function (data) {
        if ("WebSocket" in window)
        {
           console.log("WebSocket is supported by your Browser!");
           
           // Let us open a web socket
           socket = new WebSocket(urls.BASE_SOCKET);
           socket.onopen = data.open;
           socket.onmessage = data.message;
           socket.onclose = data.close;
           socket.onerror = function(err){ console.log(err) };
        }
        else
        {
           // The browser doesn't support WebSocket
           console.log("WebSocket NOT supported by your Browser!");
        }

        return socket;
    }
    obj.destroy = function () {
        if(socket) {
            socket.onopen = function () {};
            socket.onmessage = function () {};
            socket.onerror = function () {};
            socket.onclose = function(event) {
              var code = event.code;
              var reason = event.reason;
              var wasClean = event.wasClean;
              console.log("Socket close: " + code + " " + reason + " wasClean");
              // handle close event
            };            
            socket.close();
        }
    };

    return obj;
});

function get_cache(q){
    var parts = q.split('/');
    var segment = parts[1];
    var privatePages = ['admin','account','credential'];
    var restrictedPage = privatePages.indexOf(segment) == -1;
    //console.log("cache: " + restrictedPage);

    return restrictedPage;
}
