/**
 * Created by manuel on 5/23/18.
 */
angular.module('PictochatUI').controller('NewGroupController', ['$http', '$log', '$scope', '$location', '$routeParams',
    function ($http, $log, $scope, $location, $routeParams) {
        // This variable lets you access this controller
        // from within the callbacks of the $http object

        var thisCtrl = this;

        // fields for a group chat
        // group name
        var name = "";
        // Participants
        var participants = [];


        this.saveGroup = function () {
            // Build the data object
            var data = {};
            data.name = this.name;
            data.participants = this.participants;


            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/Pictochat/chat";
            console.log("reqURL: " + reqURL);

            // configuration headers for HTTP request
            var config = {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                    //'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'

                }
            }
            // Now issue the http request to the rest API

            // $http.post(reqURL, data, config).then(
            //     // Success function
            //     function (response) {
            //         console.log("data: " + JSON.stringify(response.data));
            //         // tira un mensaje en un alert
            //         alert("New part added with id: " + response.data.Part.pid);
            //         $location.url('/parts');
            //     }, //Error function
            //     function (response) {
            //         // This is the error function
            //         // If we get here, some error occurred.
            //         // Verify which was the cause and show an alert.
            //         var status = response.status;
            //         //console.log("Error: " + reqURL);
            //         //alert("Cristo");
            //         if (status == 0) {
            //             alert("No hay conexion a Internet");
            //         } else if (status == 401) {
            //             alert("Su sesion expiro. Conectese de nuevo.");
            //         } else if (status == 403) {
            //             alert("No esta autorizado a usar el sistema.");
            //         } else if (status == 404) {
            //             alert("No se encontro la informacion solicitada.");
            //         } else {
            //             alert("Error interno del sistema.");
            //         }
            //     }
            // );
        };

    }]);