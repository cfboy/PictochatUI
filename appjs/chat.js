/**
 * Created by cfboy on 4/6/19.
 */
angular.module('PictochatUI').controller('ChatController', ['$http', '$log', '$scope', '$location', '$rootScope', 'Upload', '$routeParams',
    function ($http, $log, $scope, $location, $rootScope, Upload, $routeParams) {
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


        //This function load all information of Chat.
        this.loadChat = function () {
            var chatId = $routeParams.cid;
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
                    thisCtrl.loadPosts();
                }, //Error function
                function (response) {
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
        };

        this.loadPosts = function () {
            var chatId = $routeParams.cid;
            // Now create the url with the route to talk with the rest API
            var reqURL = "http://127.0.0.1:5000/Pictochat/chat/" + chatId + "/posts";

            console.log("reqURL: " + reqURL);
            // Now issue the http request to the rest API
            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("data: " + JSON.stringify(response.data));
                    // assing the part details to the variable in the controller
                    thisCtrl.postList = response.data.PostsInChat;
                    console.log("Posts List: " + thisCtrl.postList);
                    thisCtrl.loadUsers();
                }, //Error function
                function (response) {
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
        };

        this.loadUsers = function () {
            var chatId = $routeParams.cid;
            //Find users in chat.
            var reqURL = "http://127.0.0.1:5000/Pictochat/chat/" + chatId + "/users";

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

            $log.debug("Users Loaded: ", JSON.stringify(thisCtrl.usersInChat));
        };


        $scope.uploadPic = function (file) {
            file.upload = Upload.upload({
                withCredentials: true,
                url: 'http://localhost:5000/Pictochat/post/new',
                data: {user_id: thisCtrl.user, chat_id: $routeParams.cid, post_msg: $scope.message, file: file},
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                    thisCtrl.postList.push(response.data.Post)
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                // Math.min is to fix IE which reports 200% sometimes
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        };

        //Load chat components
        this.loadChat();

        //insert like on post
        this.likeAdd = function (post) {
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
                withCredentials: true,
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
                    post.dislikes = response.data.React.totalDislikes;
                    post.likes = response.data.React.totalLikes;
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
                withCredentials: true,
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
                    post.dislikes = response.data.React.totalDislikes;
                    post.likes = response.data.React.totalLikes;
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

        this.loadLikes = function (post) {
            var post_id = post['postId'];
            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/Pictochat/post/" + post_id + "/likes";
            console.log("reqURL: " + reqURL);

            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("Users liked Post: " + JSON.stringify(response.data));
                    var list = "User that liked the post: \n";
                    for (var i = 0; i < response.data.UsersLikedPost.length; i++)
                        list += response.data.UsersLikedPost[i]["username"] + " \n";
                    alert(list);

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

        this.loadDislikes = function (post) {
            var post_id = post['postId'];
            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/Pictochat/post/" + post_id + "/dislikes";
            console.log("reqURL: " + reqURL);

            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("Users Disliked Post: " + JSON.stringify(response.data));
                    var list = "User that disliked the post: \n";
                    for (var i = 0; i < response.data.UsersDislikedPost.length; i++)
                        list += response.data.UsersDislikedPost[i]["username"] + " \n";
                    alert(list);

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

        this.replyPost = function (m) {
            var msg = thisCtrl.replyText;
            if (msg === "")
                return;
            // Build the data object
            var data = {};
            data.post_id = m['postId'];
            data.reply_msg = msg;
            //TODO: remove user_id
            data.user_id = this.user;

            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/Pictochat/post/reply";
            console.log("reqURL: " + reqURL);

            // configuration headers for HTTP request
            var config = {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            };
            $http.post(reqURL, data, config).then(
                // Success function
                function (response) {
                    console.log("data: " + JSON.stringify(response.data));
                    // tira un mensaje en un alert
                    console.log("Reply to post " + response.data.Reply.post_id + " Added");
                    m.replies.push(response.data.Reply);
                    thisCtrl.replyText = "";
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

        this.showChats = function () {
            $location.path('/home');
        };
    }]);