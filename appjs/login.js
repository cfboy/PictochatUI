angular.module('PictochatUI').controller('LoginController', ['$http', '$log', '$scope', '$location', '$routeParams',
    function ($http, $log, $scope, $location, $routeParams) {

        var thisCtrl = this;
        var mem = sessionStorage;

        this.checkLogin = function (username, password) {
            var data = {'username': username, 'password': password};

            var url = "http://localhost:5000/Pictochat/users/username/" + username;

            // Now set up the $http object
            // It has two function call backs, one for success and one for error
            $http.get(url).then(// success call back
                function (response) {
                    // The is the sucess function!
                    this.user = response.data.User;
                    // alert(this.user.user_id);
                    mem.setItem('username', user['Username']);
                    mem.setItem('uid', this.user.user_id);
                    $location.path('/home');
                }, // error callback
                function (response) {
                    alert("Username and password do not match. Try again.");

                });
            $log.error("Users Loaded: ", JSON.stringify());
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