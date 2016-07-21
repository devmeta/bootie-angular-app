var app = angular.module('App', ['ngRoute', 'ngAnimate', 'toaster']);

app.config(['$routeProvider',
  function ($routeProvider) {
	$routeProvider
	.when('/', {
			templateUrl: 'partials/main.html',
			controller: 'mainCtrl'
		})   
	.when('/blog', {
			templateUrl: 'partials/blog/index.html',
			controller: 'blogCtrl'
		})
	.when('/blog/:slug', {
			templateUrl: 'partials/movies/index.html',
			controller: 'blogEntryCtrl'
		})
	.when('/movie/add', {
			templateUrl: 'partials/movies/create.html',
			controller: 'movieAddCtrl'
		})
	.when('/movie/:id', {
			templateUrl: 'partials/movies/entry.html',
			controller: 'movieCtrl'
		})
	.when('/movie/edit/:id', {
			templateUrl: 'partials/movies/edit.html',
			controller: 'movieCtrl'
		})
    .when('/login', {
        	title: 'Login',
        	templateUrl: 'partials/login.html',
        	controller: 'authCtrl'
    	})
    .when('/logout', {
	        title: 'Logout',
	        templateUrl: 'partials/login.html',
	        controller: 'logoutCtrl'
    	})
    .when('/signup', {
	        title: 'Signup',
	        templateUrl: 'partials/signup.html',
	        controller: 'authCtrl'
    	})
    .when('/dashboard', {
	        title: 'Dashboard',
	        templateUrl: 'partials/dashboard.html',
	        controller: 'authCtrl'
    	})
	.otherwise({
			redirectTo: '/'
	});
  }])
    .run(function ($rootScope, $location, Data) {
        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            $rootScope.authenticated = false;
            Data.get('session').then(function (results) {
                if (results.uid) {
                    $rootScope.authenticated = true;
                    $rootScope.uid = results.uid;
                    $rootScope.name = results.name;
                    $rootScope.email = results.email;
                } else {
                    var nextUrl = next.$$route.originalPath;
                    if (nextUrl == '/signup' || nextUrl == '/login') {

                    } else {
                        $location.path("/login");
                    }
                }
            });
        });
    });
// Checks for nav click events and sets its elements active status
$(document).on('click','.navbar a,.nav a', function(){
	$(this).parent().parent().find('li').removeClass('active');
	$(this).parent().addClass('active');
});

$(function(){
	$('a').tooltip();
});