/**
 * Created by cfboy on 4/6/19.
 */
angular.module('PictochatUI').controller('UserController', ['$http', '$log', '$scope', '$rootScope', '$location', '$routeParams',
    function ($http, $log, $scope, $rootScope, $location, $routeParams) {
        // This variable lets you access this controller
        // from within the callbacks of the $http object

        var thisCtrl = this;

        // This variable hold the information on the part
        // as read from the REST API

        this.loadUserInfo = function () {
            // using the $routerParams object
            var userId = $routeParams.uid;

            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/Pictochat/users/" + userId;
            console.log("reqURL: " + reqURL);
            // Now issue the http request to the rest API
            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("data: " + JSON.stringify(response.data));
                    thisCtrl.userDetails = response.data.UserInfo;
                }, //Error function
                function (response) {
                    // This is the error function
                    // If we get here, some error occurred.
                    // Verify which was the cause and show an alert.
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

        this.loadUserInfo();
 }]);