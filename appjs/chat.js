/**
 * Created by cfboy on 4/6/19.
 */
angular.module('PictochatUI').controller('ChatController', ['$http', '$log', '$scope', '$rootScope', '$location', 'Upload', '$routeParams',
    function ($http, $log, $scope, $rootScope, Upload, $location, $routeParams) {
        var mem = sessionStorage;

        var thisCtrl = this;
        this.postList = [];
        this.usersInChat = [];
        this.counter = 2;
        this.newText = "";
        this.replyText = "";
        this.user = mem.getItem('user_id');

        $rootScope.prueba = "";

        $scope.uploadPic = function (file) {
            file.upload = Upload.upload({
                url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                data: {username: $scope.username, file: file},
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                // Math.min is to fix IE which reports 200% sometimes
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        };
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

            $log.debug("Chat Loaded: ", JSON.stringify(thisCtrl.chatDetails));


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
            var nextId = thisCtrl.counter++;
            thisCtrl.postList.unshift({
                "chatId": 1,
                "createdById": 1,
                "dislikes": 44,
                "likes": 44,
                "mediaId": 1,
                "mediaLocation": "/static/img-1-playa.png",
                "postDate": "Thu, 28 Mar 2019 14:30:12 GMT",
                "postId": nextId,
                "postMsg": msg,
                "replies": [{
                    "reply_date": "Thu, 28 Mar 2019 14:31:20 GMT",
                    "reply_id": 1,
                    "reply_msg": "Test Reply",
                    "reply_username": "Test "
                }],
                "username": "tester"
            });
            alert(thisCtrl.postList);
            console.log("Posts List: " + thisCtrl.postList);

            thisCtrl.newText = "";
        };

        this.loadChat();

        this.loadUserInfo = function (uid) {
            $location.url('/user/' + uid);
        };

        this.usersReactions = function (pid) {
            $location.url('/post/reactions/' + pid);
        };

        //insert like on post
        this.likeAdd = function (post) {
            var user;
            if (post.likedBy != null) {
                for (var i = 0; i < post.likedBy.length; i++) {
                    user = post.likedBy[i].userid;
                    if (this.user == user) {
                        return
                    }
                }
            }
            // Build the data object
            var data = {};
            data.post_id = post['postId'];
            data.react_type = 1;

            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/Pictochat/post/like";
            console.log("reqURL: " + reqURL);

            // configuration headers for HTTP request
            var config = {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                    //'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'

                }
            };
            $http.post(reqURL, data, config).then(
                // Success function
                function (response) {
                    console.log("data: " + JSON.stringify(response.data));
                    // tira un mensaje en un alert
                    alert("post Liked with id: " + response.data.Post.post_id);
                    //TODO recibir el username
                    // if (post.likedBy != null) {
                    //     post.likedBy.push(this.user, response.data.Post.user_id);
                    // } else
                    //     post.likedBy = [this.username, response.data.Post.user_id];
                    post.likes++;
                }, //Error function
                function (response) {
                    // This is the error function
                    // If we get here, some error occurred.
                    // Verify which was the cause and show an alert.
                    var status = response.status;
                    //console.log("Error: " + reqURL);
                    //alert("Cristo");
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

            $http({
                url: 'http://localhost:5000/Pictochat/post/like',
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                data: JSON.stringify(data)
            }).then(function () {
                // if (post.likedBy != null) {
                //     post.likedBy.push(this.user);
                // } else
                //     post.likedBy = [this.username];
                post.likes++;
            });
        };
        //insert dislike on post
        this.dislikeAdd = function (post) {
            var user;
            if (post.dilikedBy != null) {
                for (var i = 0; i < post.dislikedBy.length; i++) {
                    user = post.dislikedBy[i].userid;
                    if (this.user == user) {
                        return
                    }
                }
            }
            var data = {'user_id': thisCtrl.uid, 'post_id': post['post_id']};
            // alert("user_id: " + this.user);
            //TODO: Connect with db
            // $http({
            //     url: 'http://localhost:5000/Pictochat/post/like/insert',
            //     method: "PUT",
            //     headers: {'Content-Type': 'application/json'},
            //     data: JSON.stringify(data)
            // }).then(function () {
            post.dislikes++;
            // });
        };
        //For load all users likes m post.
        this.loadLikes = function (m) {
            if (m.likedBy == null)
                alert("No likes yet :(");
            else {
                var list = "User that liked the message: \n";
                var ref = m.likedBy;
                for (var i = 0; i < m.likedBy.length; i++)
                    list += m.likedBy[i].username + " \n";
                alert(list);
            }

        };
        //For load all users dislikes m post.
        this.loadDislikes = function (m) {
            if (m.dislikedBy == null)
                alert("No dislikes yet :)");
            else {
                var list = "User that disliked the message: \n";
                var ref = m.dislikedBy;
                for (var i = 0; i < m.dislikedBy.length; i++)
                    list += m.dislikedBy[i].username + " \n";
                alert(list);
            }
        };


        //TODO: implement

        this.replymsg = function (m) {

            var msg = thisCtrl.replyText;
            if (msg === "")
                return;
            var data = {'cid': thisCtrl.cid, 'uid': thisCtrl.uid, 'text': msg, 'reply': m['mid']};
            // $http({
            //     url: 'http://localhost:5000/SocialMessagingApp/message/post',
            //     method: "PUT",
            //     headers: {'Content-Type': 'application/json'},
            //     data: JSON.stringify(data)
            // }).then(function (response) {
            // var mid = response.data.mid;
            m.replies.unshift({
                "reply_date": 'Thu, 28 Mar 2019 14:31:20 GMT',
                "reply_id": 2,
                "reply_msg": msg,
                "reply_username": thisCtrl.username
            });
            // }).catch(function (error) {
            //     console.log("este es el error");
            // });
            thisCtrl.replyText = "";

        };
    }]);