var app = angular.module('PictochatUI');

app.controller('ContactsController', ['$http', '$log', '$scope', '$timeout', '$location', '$routeParams', '$interval',
    function ($http, $log, $scope, $timeout, $location, $routeParams) {

        var mem = sessionStorage;
        var thisCtrl = this;
        this.uid = mem.getItem('user_id');
        this.contacts = [];
        this.usersSelected = [];
        this.systemUsers = [];
        thisCtrl.ctid = "";

        this.loadSystemUsers = function () {
            //TODO: need query return all users in the system except current_user (logged), and users on his contactList.
            var reqURL = "http://localhost:5000/Pictochat/users/all";
            console.log("reqURL: " + reqURL);
            // Now issue the http request to the rest API
            $http.get(reqURL).then(
                // Success function
                function (response) {
                    console.log("data: " + JSON.stringify(response.data));
                    // assing the part details to the variable in the controller
                    thisCtrl.systemUsers = response.data.Users;
                    thisCtrl.loadContacts();

                }, //Error function
                function (response) {

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

        this.loadContacts = function () {
            var reqURL = "http://localhost:5000/Pictochat/user/" + this.uid + "/contacts";
            console.log("reqURL: " + reqURL);
            // Now issue the http request to the rest API
            $http.get(reqURL).then(
                // Success function
                function (response) {
                    /*
                    * Stores the data received from python call. The jsonyfied data
                    */
                    thisCtrl.contacts = response.data.UserContacts;
                    console.log(thisCtrl.contacts);
                },
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

                    } else {

                    }
                });

            $log.debug("Contact list Loaded: ", JSON.stringify(thisCtrl.contacts));
        };


        this.addContacts = function () {
            // alert("Add Contacts");
            var data = {};
            data.user_id = this.uid;
            // alert("Participants:" + this.usersSelected);

            data.contacts = [];
            for (var i = 0; i < this.usersSelected.length; i++) {
                data.contacts.unshift(this.usersSelected[i]['user_id']);
            }

            var reqURL = "http://localhost:5000/Pictochat/user/" + this.uid + "/contacts";
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
                    console.log("New Contacts Added: " + thisCtrl.contacts);
                    thisCtrl.usersSelected = [];
                    thisCtrl.contacts = response.data.UserContacts;
                    thisCtrl.loadSystemUsers();

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

        this.loadSystemUsers();
    }]);