/**
 * Created by cfboy on 4/6/19.
 */
// angular.module('PictochatUI').controller('HomeController', ['$http', '$log', '$scope', '$rootScope', '$location', '$routeParams',
//     function ($http, $log, $scope, $rootScope, $location, $routeParams) {
//         var thisCtrl = this;
//
//         this.chatList = [];
//         this.counter = 2;
//
//         $rootScope.prueba = "";
//         this.loadChats = function () {
//             var userId = $routeParams.uid;
//
//             // Get the list of chats from the servers via REST API
//
//             // First set up the url for the route
//             // var url = "http://localhost:5000/Pictochat/chats";
//             var url = "http://localhost:5000/Pictochat/user/" + userId + "/chats";
//
//             // Now set up the $http object
//             // It has two function call backs, one for success and one for error
//             $http.get(url).then(// success call back
//                 function (response) {
//                     // The is the sucess function!
//                     // Copy the list of parts in the data variable
//                     // into the list of parts in the controller.
//
//                     console.log("response: " + JSON.stringify(response));
//
//                     thisCtrl.chatList = response.data.Chats;
//                     $rootScope.prueba = "Probando";
//                 }, // error callback
//                 function (response) {
//                     // This is the error function
//                     // If we get here, some error occurred.
//                     // Verify which was the cause and show an alert.
//                     console.log("Err response: " + JSON.stringify(response));
//
//                     var status = response.status;
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
//                 });
//
//             thisCtrl.chatList.push({
//                 "id": 1, "chat_name": "Chat 1", "chat_admin": "CFboy"
//             });
//             thisCtrl.chatList.push({
//                 "id": 2, "chat_name": "Chat 2", "chat_admin": "Renier"
//             });
//
//
//             $log.debug("Chats Loaded: ", JSON.stringify(thisCtrl.chatList));
//
//         };
//         this.loadChats();
//
//         this.loadPosts = function (chatId) {
//             $location.url('/chat/' + chatId);
//         };
//         this.addGroup = function (pid) {
//             $location.url('/createChat/');
//         };
//
//         this.contactList = function () {
//             $location.path('/contacts')
//         };
//
//
//     }]);


angular.module('PictochatUI').controller('HomeController', ['$http', '$log', '$scope', '$location', '$routeParams',
    function ($http, $log, $scope, $location, $routeParams) {
        var thisCtrl = this;

        var mem = sessionStorage;
        this.chatList = [];
        this.chatHW = [];
        this.uid = mem.getItem('uid');
        this.username = mem.getItem('username');
        this.nchatname = "";

        this.loadHome = function () {
            thisCtrl.loadHomeDB().then(function (response) {
                //TODO: verify name of response data
                thisCtrl.chatHW = response.data.Chats;
                var n = thisCtrl.chatHW.length;
                $log.error("Chats Loaded: ", JSON.stringify(thisCtrl.chatHW));


                for (var i = n; i >= 0; i--) {
                    var c = thisCtrl.chatHW[i];
                    if (c != null)
                        thisCtrl.chatList.push({"id": c.cid, "name": c.chatname});
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

        };

        this.loadHomeDB = function () {
            //TODO validate url
            var url = "http://localhost:5000/Pictochat/user/chat/" + thisCtrl.uid;
            return $http.get(url)
        };

        this.loadChat = function (chatId) {
            $location.url('/chat/' + chatId);
        };

        this.addGroup = function () {
            $location.url('/createChat');
        };

        this.contactList = function (userId) {
            $location.path('/user/' + userId + '/contacts')
        };

        // this.loadchat = function (m) {
        //     mem.setItem('chatname', m.name);
        //     mem.setItem('cid', m.id);
        //     $location.path('/chat');
        // };

        this.loadHome();
    }]);