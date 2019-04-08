/**
 * Created by cfboy on 4/6/19.
 */
angular.module('PictochatUI').controller('HomeController', ['$http', '$log', '$scope', '$location', '$routeParams',
    function ($http, $log, $scope, $location, $routeParams) {
        var thisCtrl = this;

        var mem = sessionStorage;
        this.chatList = [];
        this.chatHW = [];
        this.uid = mem.getItem('uid');
        this.username = mem.getItem('username');
        this.nchatname = "";

        this.loadHome = function(){
            // Get the list of parts from the servers via REST API

            // First set up the url for the route
            var url = "http://localhost:5000/Pictochat/chats";

            // Now set up the $http object
            // It has two function call backs, one for success and one for error
            $http.get(url).then(// success call back
                function (response){
                // The is the sucess function!
                // Copy the list of parts in the data variable
                // into the list of parts in the controller.

                    console.log("response: " + JSON.stringify(response));

                    thisCtrl.chatList = response.data.Chat;
                    // $rootScope.prueba = "Probando";
            }, // error callback
            function (response){
                // This is the error function
                // If we get here, some error occurred.
                // Verify which was the cause and show an alert.
                console.log("Err response: " + JSON.stringify(response));

                var status = response.status;
                if (status === 0){
                    alert("No hay conexion a Internet");
                }
                else if (status === 401){
                    alert("Su sesion expiro. Conectese de nuevo.");
                }
                else if (status === 403){
                    alert("No esta autorizado a usar el sistema.");
                }
                else if (status === 404){
                    alert("No se encontro la informacion solicitada.");
                }
                else {
                    alert("Error interno del sistema.");
                }
            });

            $log.debug("Chats Loaded: ", JSON.stringify(thisCtrl.chatList));
        };

        this.loadHomeDB = function () {
            //TODO validate url
            var url = "http://localhost:5000/Pictochat/chat";
             return $http.get(url)
        };

        this.loadChat = function (chatId) {
            $location.url('/chat/' + chatId);
        };

        this.addGroup = function () {
            $location.url('/createChat');
        };

        this.contactList = function (userId) {
            $location.path('/user/contacts/' + userId)
        };

        this.loadHome();
    }]);