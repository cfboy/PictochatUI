/**
 * Created by cfboy on 4/6/19.
 */
angular.module('PictochatUI').controller('NewGroupController', ['$http', '$log', '$scope', '$location', '$routeParams',
    function ($http, $log, $scope, $location, $routeParams) {
        var mem = sessionStorage;

        var thisCtrl = this;
        var name = "";
        // Participants
        this.systemUsers = [];
        this.chatName = "";
        this.usersSelected = [];
        this.chat_id = '';
        this.user = mem.getItem('user_id');

        this.loadUsers = function () {
            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/Pictochat/users/all";
            console.log("reqURL: " + reqURL);
            // Now issue the http request to the rest API
            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("data: " + JSON.stringify(response.data));
                    // assing the part details to the variable in the controller
                    thisCtrl.systemUsers = response.data.Users;
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
        };

        this.createChat = function () {
            //TODO: Create Route
            // alert("chat_name: " + this.chatName);
            // Build the data object
            var data = {};
            data.chat_name = this.chatName;
            //TODO: remove user_id
            data.admin = this.user;

            var reqURLNewChat = "http://localhost:5000/Pictochat/chats/new";
            console.log("reqURL: " + reqURLNewChat);

            // configuration headers for HTTP request
            var config = {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            };

            $http.post(reqURLNewChat, data, config).then(
                // Success function
                function (response) {
                    console.log("data: " + JSON.stringify(response.data));
                    //TODO Validate data
                    this.chat_id = response.data.Chat.chat_id;
                    thisCtrl.addParticipants(this.chat_id);
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
                    $location.path('/home');

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
        this.loadUsers();
    }]);