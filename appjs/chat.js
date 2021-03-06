/**
 * Created by cfboy on 4/6/19.
 */
angular.module('PictochatUI').controller('ChatController', ['$http', '$log', '$scope', '$location', '$rootScope', 'Upload', '$route', '$routeParams', '$timeout',
    function ($http, $log, $scope, $location, $rootScope, Upload, $route, $routeParams, $timeout) {
        var mem = sessionStorage;
        var thisCtrl = this;
        // this.chatDetails;
        //List of Posts in Chat
        this.postList = [];
        //List of Users in Chat
        this.usersInChat = [];
        //Var for text of new post
        this.newText = "";
        //Var for text of post reply
        // this.replyText = "";
        //TODO: Implement Session
        this.user = mem.getItem('user_id');

        this.usersSelected = [];

        this.userContactsToAdd = [];

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

        //Method for posts
        $scope.uploadPic = function (file) {
            file.upload = Upload.upload({
                withCredentials: true,
                url: 'http://localhost:5000/Pictochat/post/new',
                data: {user_id: thisCtrl.user, chat_id: $routeParams.cid, post_msg: $scope.message, file: file},
            });

            file.upload.then(function (response) {

                $timeout(function () {
                    file.result = response.data;
                    //TODO: implement push and remove relod.
                    // thisCtrl.postList.push(response.data.Post);
                    // $scope.file = "";
                    // $scope.message = "";
                    $route.reload()
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
                    M.toast({html: 'Post Liked!'})

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
                    M.toast({html: 'Post Disliked!'})

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
        //Show users liked a post
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
        //Show users disliked a post
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
        //Reply
        this.replyPost = function (m, replyTxt, inputId) {
            var msg = replyTxt;
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
                    $("#" + inputId).val('');
                    M.toast({html: 'Post Replied!'})

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
        //Back to Home
        this.showChats = function () {
            $location.path('/home');
        };

        this.loadUsersToAdd = function () {
            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/Pictochat/user/" + this.user + "/contacts";
            console.log("reqURL: " + reqURL);
            // Now issue the http request to the rest API
            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("data: " + JSON.stringify(response.data));
                    // assing the part details to the variable in the controller
                    thisCtrl.userContactsToAdd = response.data.UserContacts;
                    M.toast({html: 'Contacts To Add Loaded!'})

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
                        alert("No tiene usuarios en su lista de contactos.");
                    } else {
                        alert("Error interno del sistema.");
                    }
                }
            );
        };

        this.showModal = (function () {
            thisCtrl.loadUsersToAdd();
            // $("#myModal").modal('show');
        });
        this.closeModal = (function () {
        });

        this.addParticipants = function (chatId) {
            // alert("Add Participants");
            var data = {};
            data.chat_id = chatId;
            // alert("Participants:" + this.usersSelected);

            data.participants = [];
            for (var i = 0; i < this.usersSelected.length; i++) {
                data.participants.unshift(this.usersSelected[i]['user_id']);
            }

            var reqURL = "http://localhost:5000/Pictochat/chat/addparticipants";
            console.log("reqURL: " + reqURL);
            $('#close-modal').click();

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
                    //TODO Validate data
                    $route.reload();

                    M.toast({html: 'New user added to this Chat!'})

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

    }]);
function openMenu() {
    $('.action_menu').toggle();
}
