/**
 * Created by cfboy on 4/6/19.
 */
angular.module('PictochatUI').controller('NewGroupController', ['$http', '$log', '$scope', '$location', '$routeParams',
    function ($http, $log, $scope, $location, $routeParams) {

        var thisCtrl = this;
        var name = "";
        // Participants
        this.participants = [];

         this.loadUsers = function () {
            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/Pictochat/users";
            console.log("reqURL: " + reqURL);
            // Now issue the http request to the rest API
            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("data: " + JSON.stringify(response.data));
                    // assing the part details to the variable in the controller
                    thisCtrl.participants = response.data.Users;
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
        this.saveGroup = function () {
            // Build the data object
            var data = {};
            data.name = this.name;
            data.participants = this.participants;

            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/Pictochat/chat";
            console.log("reqURL: " + reqURL);
            $location.url('/home');

            // configuration headers for HTTP request
            var config = {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                    //'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
                }
            };
            // Now issue the http request to the rest API

            $http.post(reqURL, data, config).then(
                // Success function
                function (response) {
                    console.log("data: " + JSON.stringify(response.data));
                    // tira un mensaje en un alert
                    alert("New Group Chat added with id: " + response.data.Chat.cid);
                    $location.url('/home');
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
        };

        this.showChats = function () {
            $location.path('/home');
        };
        this.loadUsers();
    }]);