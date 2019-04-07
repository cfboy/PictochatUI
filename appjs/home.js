/**
 * Created by cfboy on 4/6/19.
 */
angular.module('PictochatUI').controller('HomeController', ['$http', '$log', '$scope', '$rootScope', '$location',
    function ($http, $log, $scope, $rootScope, $location) {
        var thisCtrl = this;

        this.chatList = [];
        this.counter = 2;

        $rootScope.prueba = "";
        this.myChats = function () {
            // Get the list of chats from the servers via REST API

            // First set up the url for the route
            //TODO: add correct url
            // var url = "http://localhost:5000/Pictochat/home";

            // Now set up the $http object
            // It has two function call backs, one for success and one for error
            // $http.get(url).then(// success call back
            //     function (response) {
            //         // The is the sucecss function!
            //         // Copy the list of parts in the data variable
            //         // into the list of parts in the controller.
            //
            //         console.log("response: " + JSON.stringify(response));
            //
            //         thisCtrl.chatList = response.data.Chats;
            //         $rootScope.prueba = "Probando";
            //     }, // error callback
            //     function (response) {
            //         // This is the error function
            //         // If we get here, some error occurred.
            //         // Verify which was the cause and show an alert.
            //         console.log("Err response: " + JSON.stringify(response));
            //
            //         var status = response.status;
            //         if (status === 0) {
            //             alert("No hay conexion a Internet");
            //         } else if (status === 401) {
            //             alert("Su sesion expiro. Conectese de nuevo.");
            //         } else if (status === 403) {
            //             alert("No esta autorizado a usar el sistema.");
            //         } else if (status === 404) {
            //             alert("No se encontro la informacion solicitada.");
            //         } else {
            //             alert("Error interno del sistema.");
            //         }
            //     });


            thisCtrl.chatList.push({
                "id": 1, "chat_name": "Chat 1", "chat_admin": "CFboy"
            });
            thisCtrl.chatList.push({
                "id": 2, "chat_name": "Chat 2", "chat_admin": "Renier"
            });


            $log.debug("Chats Loaded: ", JSON.stringify(thisCtrl.chatList));

        };
        this.myChats();

        this.loadChats = function (pid) {
            $location.url('/chat/' + pid);
        };
        this.addGroup = function (pid) {
            $location.url('/createChat/');
        };


    }]);

