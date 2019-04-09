/**
 * Created by cfboy on 4/6/19.
 */
angular.module('PictochatUI').controller('ReactionController', ['$http', '$log', '$scope', '$rootScope', '$location', '$routeParams',
    function ($http, $log, $scope, $rootScope, $location, $routeParams) {
        // This variable lets you access this controller
        // from within the callbacks of the $http object

        var thisCtrl = this;

        this.userReactedList = [];

        // This variable hold the information on the part
        // as read from the REST API

        this.usersReactions = function () {

            // Get the target part id from the parameter in the url
            // using the $routerParams object
            var pId = $routeParams.pid;

            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/Pictochat/post/" + pId + "/reactions";
            console.log("reqURL: " + reqURL);
            // Now issue the http request to the rest API
            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("data: " + JSON.stringify(response.data));
                    // assing the part details to the variable in the controller
                    // thisCtrl.userDetails = response.data.Part;
                    console.log("La prueba: " + $rootScope.prueba);
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

            thisCtrl.userReactedList.push({
                "id": 1, "name": "Roberto", "lastName": "Torres", "reactionType": "Like", "reactionDate" : "2019-04-01"
            });
            thisCtrl.userReactedList.push({
                "id": 2, "name": "Cristian", "lastName": "De Jesus", "reactionType": "Dislike", "reactionDate" : "2019-04-01"
            });
            thisCtrl.userReactedList.push({
                "id": 3, "name": "Jose", "lastName": "Nieves", "reactionType": "DisLike", "reactionDate" : "2019-04-01"
            });
            thisCtrl.userReactedList.push({
                "id": 4, "name": "Renier", "lastName": "Loquito", "reactionType": "Like", "reactionDate" : "2019-04-01"
            });
        };


        this.usersReactions();
    }]);