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

        this.loadPosts = function () {
            var chatId = $routeParams.cid;
            // Now create the url with the route to talk with the rest API
            var reqURL = "http://127.0.0.1:5000/Pictochat/post/messages/" + chatId;
            console.log("reqURL: " + reqURL);
            // Now issue the http request to the rest API
            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("data: " + JSON.stringify(response.data));
                    // assing the part details to the variable in the controller
                    thisCtrl.postList = response.data.PostMessages;
                    console.log("La prueba: " + $rootScope.prueba);
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
            reqURL = "http://127.0.0.1:5000/Pictochat/users/chat/" + chatId;
            console.log("reqURL: " + reqURL);
            // Now issue the http request to the rest API
            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("data: " + JSON.stringify(response.data));
                    // assing the part details to the variable in the controller
                    thisCtrl.usersInChat = response.data.Users;
                    console.log("La prueba: " + $rootScope.prueba);
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

        this.loadPosts();

        this.loadUserInfo = function (uid) {
            $location.url('/user/' + uid);
        };

        this.usersReactions = function (pid) {
            $location.url('/post/reactions/' + pid);
        };

          //TODO: implement
//
        this.likeadd = function (t) {
            var user;
            if (t.minfo.Likedby != null) {
                for (var i = 0; i < t.minfo.Likedby.length; i++) {
                    user = t.minfo.Likedby[i];
                    if (user === thisCtrl.username) {
                        return
                    }
                }
            }
            var data = {'uid': thisCtrl.uid, 'mid': t['mid']};
            $http({
                //TODO: validate url
                url: 'http://localhost:5000/Pictochat/post/like',
                method: "PUT",
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify(data)
            }).then(function () {
                if (t.minfo.Likedby != null) {
                    t.minfo.Likedby.push(thisCtrl.username);
                } else
                    t.minfo.Likedby = [thisCtrl.username];
                t.like++;
            });
        };

        this.dislikeadd = function (t) {
            var user;
            if (t.minfo.Dislikedby != null) {
                for (var i = 0; i < t.minfo.Dislikedby.length; i++) {
                    user = t.minfo.Dislikedby[i];
                    if (user === thisCtrl.username) {
                        return
                    }
                }
            }
            var data = {'uid': thisCtrl.uid, 'mid': t['mid']};
            $http({
                url: 'http://localhost:5000/SocialMessagingApp/message/dislike/insert',
                method: "PUT",
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify(data)
            }).then(function () {
                if (t.minfo.Dislikedby != null) {
                    t.minfo.Dislikedby.push(thisCtrl.username);
                } else
                    t.minfo.Dislikedby = [thisCtrl.username];
                t.nolike++;
            });
        };

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
                thisCtrl.loadPosts();
            }
        };

        this.search = function () {
            $location.path('/search');
        };
//         //*************************************

    }]);