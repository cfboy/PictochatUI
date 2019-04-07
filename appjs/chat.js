/**
 * Created by cfboy on 4/6/19.
 */
angular.module('PictochatUI').controller('ChatController', ['$http', '$log', '$scope', '$rootScope', '$location', '$routeParams',
    function ($http, $log, $scope, $rootScope, $location, $routeParams) {
        var thisCtrl = this;
        var chatDetails = {};
        this.messageList = [];
        this.usersInChat = [];

        this.counter = 2;
        this.newText = "";
        this.msgCounter = 2;
        this.msgNewText = "";

        $rootScope.prueba = "";

        this.loadChats = function () {
            chatId = $routeParams.cid;
            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/Pictochat/chat/" + chatId;
            console.log("reqURL: " + reqURL);
            // Now issue the http request to the rest API
            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("data: " + JSON.stringify(response.data));
                    // assing the part details to the variable in the controller
                    thisCtrl.chatDetails = response.data.Chat;
                    console.log("La prueba: " + $rootScope.prueba);
                }, //Error function
                function (response) {
                    // This is the error function
                    // If we get here, some error occurred.
                    // Verify which was the cause and show an alert.
                    var status = response.status;
                    //console.log("Error: " + reqURL);
                    //alert("Cristo");
                    if (status == 0) {
                        alert("No hay conexion a Internet");
                    } else if (status == 401) {
                        alert("Su sesion expiro. Conectese de nuevo.");
                    } else if (status == 403) {
                        alert("No esta autorizado a usar el sistema.");
                    } else if (status == 404) {
                        alert("No se encontro la informacion solicitada.");
                    } else {
                        alert("Error interno del sistema.");
                    }
                }
            );
            // Get the messages from the server through the rest api

            if (chatId === '1') {
                thisCtrl.messageList.push({
                    "id": 1, "text": "Hola Mi Amigo", "author": "Bob",
                    "like": 4, "nolike": 1
                });

                this.usersInChat.push({
                    "id": 1, "name": "Roberto", "lastName": "Torres", "isAdmin": false
                });
                this.usersInChat.push({
                    "id": 2, "name": "Cristian", "lastName": "De Jesus", "isAdmin": true
                });

            } else if (chatId === '2') {
                thisCtrl.messageList.push({
                    "id": 2, "text": "Hello World", "author": "Joe",
                    "like": 11, "nolike": 12
                });
                this.usersInChat.push({
                    "id": 3, "name": "Jose", "lastName": "Nieves", "isAdmin": false
                });
                this.usersInChat.push({
                    "id": 4, "name": "Renier", "lastName": "Loquito", "isAdmin": true
                });
            }
            $log.debug("Message Loaded: ", JSON.stringify(thisCtrl.messageList));

        };

        this.postMsg = function () {
            var msg = thisCtrl.msgNewText;
            // Need to figure out who I am
            var author = "Me";
            var nextId = thisCtrl.msgCounter++;
            thisCtrl.messageList.unshift({"id": nextId, "text": msg, "author": author, "like": 0, "nolike": 0});
            thisCtrl.msgNewText = "";
        };

        this.loadChats();

        this.loadUserInfo = function (uid) {
            $location.url('/user/' + uid);
        };

        this.usersReactions = function (pid) {
            $location.url('/reactions/post/' + pid);
        };

    }]);

