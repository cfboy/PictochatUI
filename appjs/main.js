(function () {

    var app = angular.module('PictochatUI', ['ngRoute']);

    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'pages/login.html',
            controller: 'LoginController',
            controllerAs: 'logingCtrl'
        }).when('/home', {
            templateUrl: 'pages/home.html',
            controller: 'HomeController',
            controllerAs: 'homeCtrl'
        }).when('/user/:uid', {
            templateUrl: 'pages/user.html',
            controller: 'UserController',
            controllerAs: 'userCtrl'
        }).when('/chat/:cid', {
            templateUrl: 'pages/chat.html',
            controller: 'ChatController',
            controllerAs: 'chatCtrl'
        }).when('/parts', {
            templateUrl: 'pages/parts.html',
            controller: 'PartsController',
            controllerAs: 'partsCtrl'
        }).when('/partsdetails/:pid', {
            templateUrl: 'pages/partdetails.html',
            controller: 'PartsDetailController',
            controllerAs: 'partsDetailCtrl'
        }).when('/createChat', {
            templateUrl: 'pages/newgroup.html',
            controller: 'NewGroupController',
            controllerAs: 'newGroupCtrl'
        }).when('/reactions/post/:pid', {
            templateUrl: 'pages/usersReactions.html',
            controller: 'ReactionController',
            controllerAs: 'reactionCrtl'
        }).otherwise({
            redirectTo: '/home'
        });
    }]);
})();
