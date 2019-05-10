/**
 * Created by cfboy on 4/6/19.
 */
angular.module('PictochatUI').controller('ChatController', ['$http', '$log', '$scope', '$rootScope', '$location', 'Upload', '$routeParams',
    function ($http, $log, $scope, $rootScope, Upload, $location, $routeParams) {
        var mem = sessionStorage;
        var thisCtrl = this;

        //List of Posts in Chat
        this.postList = [];
        //List of Users in Chat
        this.usersInChat = [];
        //Var for text of new post
        this.newText = "";
        //Var for text of post reply
        this.replyText = "";
        //TODO: Implement Session
        this.user = mem.getItem('user_id');

        $rootScope.prueba = "";

        //TODO: Implement media upload
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
        //This function load all information of Chat.
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
                    var status = response.status;
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

        //This function Insert new Post
        this.postMsg = function () {
            var msg = thisCtrl.newText;

            // Build the data object
            var data = {};
            data.chat_id = this.chatDetails.chatId;
            data.post_msg = this.newText;
            //TODO: remove user_id
            data.user_id = this.user;

            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/Pictochat/post/new";
            console.log("reqURL: " + reqURL);

            // configuration headers for HTTP request
            var config = {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            };
            $http.post(reqURL, data, config).then(
                // Success function
                function (response) {
                    console.log("data: " + JSON.stringify(response.data));
                    // tira un mensaje en un alert
                    console.log("Post " + response.data.React.post_id + " Added");
                    //TODO: Falta el dictionary completo de Post
                    thisCtrl.postList.unshift(response.data.Post);
                    thisCtrl.newText = "";
                }, //Error function
                function (response) {

                    var status = response.status;

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
        };
        //Load chat components
        this.loadChat();
        //This function redirect to load user information (NO SE USA)
        this.loadUserInfo = function (uid) {
            $location.url('/user/' + uid);
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
            //TODO: remove user_id
            data.user_id = this.user;

            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/Pictochat/post/react";
            console.log("reqURL: " + reqURL);

            // configuration headers for HTTP request
            var config = {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            };
            $http.post(reqURL, data, config).then(
                // Success function
                function (response) {
                    console.log("data: " + JSON.stringify(response.data));
                    // tira un mensaje en un alert
                    console.log("Post " + response.data.React.post_id + " Liked");
                    //TODO recibir el username para actualizar lista
                    // if (post.likedBy != null) {
                    //     post.likedBy.push(response.data.React.user_id, response.data.React.username);
                    // } else
                    //     post.likedBy = [response.data.React.user_id, response.data.React.username];
                    post.likes++;
                }, //Error function
                function (response) {

                    var status = response.status;

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
        };
        //insert dislike on post
        this.dislikeAdd = function (post) {
            var user;
            if (post.dislikedBy != null) {
                for (var i = 0; i < post.dislikedBy.length; i++) {
                    user = post.dislikedBy[i].userid;
                    if (this.user == user) {
                        return
                    }
                }
            }
            // Build the data object
            var data = {};
            data.post_id = post['postId'];
            data.react_type = -1;
            //TODO: remove user_id
            data.user_id = this.user;

            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/Pictochat/post/react";
            console.log("reqURL: " + reqURL);

            // configuration headers for HTTP request
            var config = {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            };
            $http.post(reqURL, data, config).then(
                // Success function
                function (response) {
                    console.log("data: " + JSON.stringify(response.data));
                    // tira un mensaje en un alert
                    console.log("Post " + response.data.React.post_id + " Disliked");

                    //TODO recibir el username para actualizar lista
                    // if (post.likedBy != null) {
                    //     post.likedBy.push(response.data.React.user_id, response.data.React.username);
                    // } else
                    //     post.likedBy = [response.data.React.user_id, response.data.React.username];
                    post.dislikes++;
                }, //Error function
                function (response) {

                    var status = response.status;

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
        };
        //load all users liked m post.
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
        //load all users disliked m post.
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
        //TODO: implement reply function
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