/**
 * Created by cfboy on 4/6/19.
 */
angular.module('PictochatUI').controller('HomeController', ['$http', '$log', '$scope', '$location', '$rootScope', '$route', '$routeParams',
    function ($http, $log, $scope, $location, $rootScope, $route, $routeParams) {
        var thisCtrl = this;

        var mem = sessionStorage;
        this.chatList = [];
        this.chatHW = [];
        this.user_id = mem.getItem('user_id');
        this.username = mem.getItem('username');
        this.nchatname = "";

        this.loadHome = function () {
            // First set up the url for the route
            // alert(this.uid);
            var url = "http://localhost:5000/Pictochat/chats/" + this.user_id;

            // Now set up the $http object
            // It has two function call backs, one for success and one for error
            $http.get(url).then(// success call back
                function (response) {
                    // The is the sucess function!
                    thisCtrl.chatList = response.data.Chats;
                }, // error callback
                function (response) {
                    // This is the error function
                    // If we get here, some error occurred.
                    // Verify which was the cause and show an alert.
                    console.log("Err response: " + JSON.stringify(response));

                    var status = response.status;
                    if (status === 0) {
                        alert("No hay conexion a Internet");
                    } else if (status === 401) {
                        alert("Su sesion expiro. Conectese de nuevo.");
                    } else if (status === 403) {
                        alert("No esta autorizado a usar el sistema.");
                    } else if (status === 404) {
                        // alert("No se encontro la informacion solicitada.");
                    } else {
                        alert("Error interno del sistema.");
                    }
                });

            $log.debug("Chats Loaded: ", JSON.stringify(thisCtrl.chatList));
        };

        this.loadChat = function (cid) {
            $location.url('/chat/' + cid);
        };


        this.loadDashboard = function () {
            $location.url('/dashboard');
        };

        this.addGroup = function () {
            $location.url('/createChat');
        };

        this.contactList = function (userId) {
            $location.path('/user/' + userId + '/contacts')
        };

        this.logout = function () {
            mem.setItem('username', '');
            mem.setItem('user_id', '');
            $location.path('/login')
        };

        this.loadHome();
    }]);
