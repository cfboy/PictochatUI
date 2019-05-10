angular.module('PictochatUI').controller('LoginController', ['$http', '$log', '$scope', '$location', '$routeParams',
    function ($http, $log, $scope, $location, $routeParams) {

        var thisCtrl = this;
        var mem = sessionStorage;

        this.checkLogin = function (username, password) {
            var data = {};
            data.username = username;
            data.password = password;

            // Now create the url with the route to talk with the rest API
            var reqURL = "http://localhost:5000/Pictochat/users/login";
            console.log("reqURL: " + reqURL);

            // configuration headers for HTTP request
            var config = {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                    //'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'

                }
            };
            $http.post(reqURL, data, config).then(
                // Success function
                function (response) {
                    console.log("data: " + JSON.stringify(response.data));
                    mem.setItem('username', response.data.User['username']);
                    mem.setItem('user_id', response.data.User['user_id']);
                    $location.path('/home');

                    // tira un mensaje en un alert
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

        this.register = function (firstname, lastname, phone, email, password, username) {
            var reqURL = "http://localhost:5000/SocialMessagingApp/register";
            var data = {
                'firstname': firstname,
                'lastname': lastname,
                'phone': phone,
                'email': email,
                'password': password,
                'username': username
            };
            // Now issue the http request to the rest API
            $http.post(reqURL, data).then(
                // Success function
                function (response) {
                    var user = response.data.User;
                    mem.setItem('username', user['Username']);
                    mem.setItem('uid', user['UserId']);
                    $location.path('/chatMenu')
                },
                function (response) {
                    // This is the error function
                    // If we get here, some error occurred.
                    // Verify which was the cause and show an alert.
                    alert("Invalid username. Try another.");

                });

            $log.error("Users Loaded: ", JSON.stringify());
        };
    }]);