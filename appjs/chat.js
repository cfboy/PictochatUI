// /**
//  * Created by cfboy on 4/6/19.
//  */
// angular.module('PictochatUI').controller('ChatController', ['$http', '$log', '$scope', '$rootScope', '$location', '$routeParams',
//     function ($http, $log, $scope, $rootScope, $location, $routeParams) {
//         var thisCtrl = this;
//         var chatDetails = {};
//         this.messageList = [];
//         this.usersInChat = [];
//
//         this.counter = 2;
//         this.newText = "";
//         this.msgCounter = 2;
//         this.msgNewText = "";
//
//         $rootScope.prueba = "";
//
//         this.loadPosts = function () {
//             chatId = $routeParams.cid;
//             // Now create the url with the route to talk with the rest API
//             var reqURL = "http://localhost:5000/Pictochat/chat/" + chatId + "/posts";
//             console.log("reqURL: " + reqURL);
//             // Now issue the http request to the rest API
//             $http.get(reqURL).then(
//                 // Success function
//                 function (response) {
//                     console.log("data: " + JSON.stringify(response.data));
//                     // assing the part details to the variable in the controller
//                     thisCtrl.chatDetails = response.data.Chat;
//                     console.log("La prueba: " + $rootScope.prueba);
//                 }, //Error function
//                 function (response) {
//                     // This is the error function
//                     // If we get here, some error occurred.
//                     // Verify which was the cause and show an alert.
//                     var status = response.status;
//                     //console.log("Error: " + reqURL);
//                     if (status == 0) {
//                         alert("No hay conexion a Internet");
//                     } else if (status == 401) {
//                         alert("Su sesion expiro. Conectese de nuevo.");
//                     } else if (status == 403) {
//                         alert("No esta autorizado a usar el sistema.");
//                     } else if (status == 404) {
//                         alert("No se encontro la informacion solicitada.");
//                     } else {
//                         alert("Error interno del sistema.");
//                     }
//                 }
//             );
//             // Get the messages from the server through the rest api
//
//             if (chatId === '1') {
//                 thisCtrl.messageList.push({
//                     "id": 1, "text": "Hola Mi Amigo", "author": "Bob",
//                     "like": 4, "nolike": 1
//                 });
//
//                 this.usersInChat.push({
//                     "id": 1, "name": "Roberto", "lastName": "Torres", "isAdmin": false
//                 });
//                 this.usersInChat.push({
//                     "id": 2, "name": "Cristian", "lastName": "De Jesus", "isAdmin": true
//                 });
//
//             } else if (chatId === '2') {
//                 thisCtrl.messageList.push({
//                     "id": 2, "text": "Hello World", "author": "Joe",
//                     "like": 11, "nolike": 12
//                 });
//                 this.usersInChat.push({
//                     "id": 3, "name": "Jose", "lastName": "Nieves", "isAdmin": false
//                 });
//                 this.usersInChat.push({
//                     "id": 4, "name": "Renier", "lastName": "Loquito", "isAdmin": true
//                 });
//             }
//             $log.debug("Message Loaded: ", JSON.stringify(thisCtrl.messageList));
//
//         };
//
//         this.postMsg = function () {
//             var msg = thisCtrl.msgNewText;
//             // Need to figure out who I am
//             var author = "Me";
//             var nextId = thisCtrl.msgCounter++;
//             thisCtrl.messageList.unshift({"id": nextId, "text": msg, "author": author, "like": 0, "nolike": 0});
//             thisCtrl.msgNewText = "";
//         };
//
//         this.loadPosts();
//
//         this.loadUserInfo = function (uid) {
//             $location.url('/user/' + uid);
//         };
//
//         this.usersReactions = function (pid) {
//             $location.url('/reactions/post/' + pid);
//         };
//
//     }]);
//

angular.module('PictochatUI').controller('ChatController', ['$http', '$log', '$scope', '$location', '$routeParams',
    function ($http, $log, $scope, $location, $routeParams) {

        var mem = sessionStorage;
        //mem.setItem('uid', 3);
        //mem.setItem('cid', 1);
        //mem.setItem('chatname', 'nena');
        //mem.setItem('username', 'kruiz');


        var thisCtrl = this;

        this.msgHW = [];
        this.messageList = [];
        this.newText = "";
        this.cid = mem.getItem('cid');
        this.uid = mem.getItem('uid');
        this.username = mem.getItem('username');
        this.chatname = mem.getItem('chatname');

        this.usersInChat = [];
        this.counter = 2;

        this.loadPosts = function () {

            thisCtrl.loadMessageDB().then(function (response) {
                //TODO: validate response data
                thisCtrl.msgHW = response.data.MessagesFromChat;

                var n = thisCtrl.msgHW.length;
                for (var i = n - 1; i >= 0; i--) {
                    mr = thisCtrl.msgHW[i];
                    //TODO: implement replys
                    if (mr != null)
                        if (mr.ReplyId === 0)
                            thisCtrl.messageList.push({
                                "mid": mr.MessageID,
                                "text": mr.Text,
                                "author": mr.Username,
                                "like": mr.Likes,
                                "nolike": mr.Dislikes,
                                "minfo": mr,
                                "reply": mr.Reply
                            });
                        else
                            thisCtrl.messageList.push({
                                "mid": mr.MessageID,
                                "text": "Reply:" + mr.Text,
                                "author": mr.Username,
                                "like": mr.Likes,
                                "nolike": mr.Dislikes,
                                "minfo": mr,
                                "reply": mr.Reply
                            });

                }

            }, function (error) {
                var status = error.status;

                if (status === 0) {
                    alert("No hay conexion a Internet");
                } else if (status === 401) {
                    alert("Su sesion expiro. Conectese de nuevo.");
                } else if (status === 403) {
                    alert("No esta autorizado a usar el sistema.");
                } else if (status === 404) {
                    alert("No se encontro la informacion solicitada.");
                } else {
                    //alert("Error interno del sistema.");
                }
            });

            //This pushes are for testing purpose.
            this.messageList.push({
                "id": 1, "text": "Hola Mi Amigo", "author": "Bob",
                "like": 4, "nolike": 1
            });

            this.usersInChat.push({
                "id": 1, "name": "Roberto", "lastName": "Torres", "isAdmin": false
            });
            this.usersInChat.push({
                "id": 2, "name": "Cristian", "lastName": "De Jesus", "isAdmin": true
            });
        };

        this.loadMessageDB = function () {
            //TODO: validate url
            var url = "http://localhost:5000/Pictochat/chat/" + thisCtrl.cid + "/posts";
            return $http.get(url)
        };

        this.postMsg = function () {
            var msg = thisCtrl.newText;
            if (msg === "")
                return;
            // Need to figure out who I am
            //EEHW
            // data = {'cid': thisCtrl.cid, 'uid': thisCtrl.uid, 'text': msg,  'reply': null};
            // $http({
            //     url: 'http://localhost:5000/SocialMessagingApp/message/post',
            //     method: "PUT",
            //     headers: { 'Content-Type': 'application/json' },
            //     data: JSON.stringify(data)
            // }).then(function(response){
            //     var m = response.data.mid;
            //     thisCtrl.messageList.unshift({"mid": m, "text": msg, "author": thisCtrl.username, "like": 0, "nolike": 0, "reply": null, "minfo": {'Likedby': null, 'Dislikedby': null}});
            // }).catch(function(error){
            //     console.log("este es el error" + error);
            // });
            var author = "Me";
            var nextId = thisCtrl.counter++;
            thisCtrl.messageList.unshift({
                "id": nextId,
                "text": msg,
                "author": author,
                "like": 0,
                "nolike": 0,
                "postDate": "12/04/2019",
                "postReply": "Reply Test"
            });
            thisCtrl.newText = "";
        };
        //*************************************

        //TODO: implement likes and dislikes

        // this.loadDislikes = function (m) {
        //     if (m.minfo.Dislikedby == null)
        //         alert("No dislikes yet :)");
        //     else {
        //         var list = "User that disliked the message: \n";
        //         var ref = m.minfo.Dislikedby;
        //         for (var i = 0; i < m.minfo.Dislikedby.length; i++)
        //             list += m.minfo.Dislikedby[i] + " \n";
        //         alert(list);
        //     }
        // };

        // this.loadLikes = function (m) {
        //     if (m.minfo.Likedby == null)
        //         alert("No likes yet :(");
        //     else {
        //         var list = "User that liked the message: \n";
        //         var ref = m.minfo.Likedby;
        //         for (var i = 0; i < m.minfo.Likedby.length; i++)
        //             list += m.minfo.Likedby[i] + " \n";
        //         alert(list);
        //     }
        //
        // };

        //TODO: implement

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
        //*************************************

        this.loadPosts();


        this.loadUserInfo = function (uid) {
            $location.url('/user/' + uid);
        };

        //Search hashtags
        this.usersReactions = function (pid) {
            $location.url('/reactions/post/' + pid);
        };
    }]);

