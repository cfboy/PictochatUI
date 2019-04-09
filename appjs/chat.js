/**
 * Created by cfboy on 4/6/19.
 */
angular.module('PictochatUI').controller('ChatController', ['$http', '$log', '$scope', '$rootScope', '$location', '$routeParams',
    function ($http, $log, $scope, $rootScope, $location, $routeParams) {
        var thisCtrl = this;
        this.postList = [];
        this.usersInChat = [];
        this.counter = 2;
        this.newText = "";

        $rootScope.prueba = "";

        this.loadChat = function () {
            var chatId = $routeParams.cid;
            // alert(chatId);
             var reqURL = "http://127.0.0.1:5000/Pictochat/chat/" + chatId;
            console.log("reqURL: " + reqURL);
            // Now issue the http request to the rest API
            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("data: " + JSON.stringify(response.data));
                    // assing the part details to the variable in the controller
                    thisCtrl.chatDetails = response.data.Chat;
                    console.log("Posts List: " + thisCtrl.chatDetails);
                }, //Error function
                function (response) {
                    // This is the error function
                    // If we get here, some error occurred.
                    // Verify which was the cause and show an alert.
                    var status = response.status;
                    //console.log("Error: " + reqURL);
                    if (status === 0) {
                        alert("No hay conexion a Internet");
                    } else if (status === 401) {
                        alert("Su sesion expiro. Conectese de nuevo.");
                    } else if (status === 403) {
                        alert("No esta autorizado a usar el sistema.");
                    } else if (status === 404) {
                        alert("No se encontro la informacion solicitada.");
                    } else {
                        alert("Error interno del sistema.");
                    }
                }
            );
            // Get the messages from the server through the rest api

            $log.debug("Posts Loaded: ", JSON.stringify(thisCtrl.chatDetails));


            // Now create the url with the route to talk with the rest API
            reqURL = "http://127.0.0.1:5000/Pictochat/chat/" + chatId + "/posts";
            console.log("reqURL: " + reqURL);
            // Now issue the http request to the rest API
            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("data: " + JSON.stringify(response.data));
                    // assing the part details to the variable in the controller
                    thisCtrl.postList = response.data.PostsInChat;
                    console.log("Posts List: " + thisCtrl.postList);
                }, //Error function
                function (response) {
                    // This is the error function
                    // If we get here, some error occurred.
                    // Verify which was the cause and show an alert.
                    var status = response.status;
                    //console.log("Error: " + reqURL);
                    if (status === 0) {
                        alert("No hay conexion a Internet");
                    } else if (status === 401) {
                        alert("Su sesion expiro. Conectese de nuevo.");
                    } else if (status === 403) {
                        alert("No esta autorizado a usar el sistema.");
                    } else if (status === 404) {
                        alert("No se encontro la informacion solicitada.");
                    } else {
                        alert("Error interno del sistema.");
                    }
                }
            );
            // Get the messages from the server through the rest api

            $log.debug("Posts Loaded: ", JSON.stringify(thisCtrl.postList));
            //Find users in chat.
            reqURL = "http://127.0.0.1:5000/Pictochat/chat/" + chatId + "/users";
            console.log("reqURL: " + reqURL);
            // Now issue the http request to the rest API
            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("data: " + JSON.stringify(response.data));
                    // assing the part details to the variable in the controller
                    thisCtrl.usersInChat = response.data.Users;
                }, //Error function
                function (response) {
                    // This is the error function
                    // If we get here, some error occurred.
                    // Verify which was the cause and show an alert.
                    var status = response.status;
                    //console.log("Error: " + reqURL);
                    if (status === 0) {
                        alert("No hay conexion a Internet");
                    } else if (status === 401) {
                        alert("Su sesion expiro. Conectese de nuevo.");
                    } else if (status === 403) {
                        alert("No esta autorizado a usar el sistema.");
                    } else if (status === 404) {
                        alert("No se encontro la informacion solicitada.");
                    } else {
                        alert("Error interno del sistema.");
                    }
                }
            );
            // Get the messages from the server through the rest api

            $log.debug("Users Loaded: ", JSON.stringify(thisCtrl.usersInChat));
        };

        this.postMsg = function () {
            var msg = thisCtrl.newText;
            // Need to figure out who I am
            var author = "Me";
            var nextId = thisCtrl.counter++;
            thisCtrl.postList.unshift({"post_id": nextId, "post_msg": msg, "user_id": author, "like": 0, "nolike": 0});
            thisCtrl.newText = "";
        };

        this.loadChat();

        this.loadUserInfo = function (uid) {
            $location.url('/user/' + uid);
        };

        this.usersReactions = function (pid) {
            $location.url('/post/reactions/' + pid);
        };

        //TODO: implement

        this.replymsg = function (m) {
            var msg = thisCtrl.newText;
            if (msg === "")
                return;
            // Need to figure out who I am
            //EEHW
            var data = {'cid': thisCtrl.cid, 'uid': thisCtrl.uid, 'text': msg, 'reply': m['mid']};
            $http({
                url: 'http://localhost:5000/SocialMessagingApp/message/post',
                method: "PUT",
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify(data)
            }).then(function (response) {
                var mid = response.data.mid;
                thisCtrl.messageList.unshift({
                    "mid": mid,
                    "text": "Reply:" + msg,
                    "author": thisCtrl.username,
                    "like": 0,
                    "nolike": 0,
                    "reply": m.text,
                    "minfo": {'Likedby': null, 'Dislikedby': null}
                });
            }).catch(function (error) {
                console.log("este es el error");
            });
            thisCtrl.newText = "";

        };

        this.refresh = function () {
            var n = thisCtrl.messageList.length;
            //$log.error
            //console.log
            for (var i = n; i >= 0; i--) {
                var t = thisCtrl.messageList.pop();
                thisCtrl.loadChat();
            }
        };

        this.search = function () {
            $location.path('/search');
        };
//         //*************************************

    }]);