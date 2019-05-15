(function () {

    var app = angular.module('PictochatUI', ['ngRoute', 'ngFileUpload', 'ui.select', 'ngSanitize']);

    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'pages/login.html',
            controller: 'LoginController',
            controllerAs: 'loginCtrl'
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
        }).when('/createChat', {
            templateUrl: 'pages/newgroup.html',
            controller: 'NewGroupController',
            controllerAs: 'newGroupCtrl'
        }).when('/post/reactions/:pid', {
            templateUrl: 'pages/usersReactions.html',
            controller: 'ReactionController',
            controllerAs: 'reactionCrtl'
        }).when('/user/:uid/contacts/', {
            templateUrl: 'pages/contacts.html',
            controller: 'ContactsController',
            controllerAs: 'contactCtrl'
        }).when('/dashboard',{
            templateUrl: 'pages/dashboard.html',
            controller: 'DashboardController',
            controllerAs : 'dashCtrl'
        }).otherwise({
            redirectTo: '/login'
        });
    }]);
})();
