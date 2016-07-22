var app = angular.module('app', ['ngRoute', 'ngStorage', 'ngAnimate', 'readableTime', 'toaster', 'api', 'auth', 'interceptor', 'directives', 'controllers', 'summernote']);

app.config(['$routeProvider','$httpProvider','$locationProvider',

    function ($routeProvider,$httpProvider,$locationProvider) {

        $routeProvider.

            when('/signin', {
                title: 'Login',
                templateUrl: 'partials/signin.html',
                controller: 'auth'
            })
            .when('/support', {
                title: 'Soporte online',
                templateUrl: 'partials/support.html',
                controller: 'auth'
            })
            .when('/signup', {
                title: 'Signup',
                templateUrl: 'partials/signup.html',
                controller: 'auth'
            })
            .when('/packs', {
                title: 'Packs',
                templateUrl: 'partials/packs/index.html',
                controller: 'packs'
            })
            .when('/packs/:slug', {
                title: 'Packs',
                templateUrl: 'partials/packs/entry.html',
                controller: 'packs'
            })            
            .when('/credential', {
                title: 'Credenciales',
                templateUrl: 'partials/credential.html',
                controller: 'auth'
            })            
            .when('/admin/dash', {
                title: 'Escritorio',
                templateUrl: 'partials/panel/admin/dash.html',
                controller: 'data'
            })
            .when('/admin/users', {
                title: 'Cuentas',
                templateUrl: 'partials/panel/admin/users/index.html',
                controller: 'data'
            })
            .when('/admin/users/create', {
                title: 'Cuentas',
                templateUrl: 'partials/panel/admin/users/create.html',
                controller: 'create'
            })
            .when('/admin/users/:id', {
                title: 'Editar Cuenta',
                templateUrl: 'partials/panel/admin/users/edit.html',
                controller: 'data'
            })      
            .when('/admin/posts', {
                title: 'Cuentas',
                templateUrl: 'partials/panel/admin/posts/index.html',
                controller: 'data'
            })
            .when('/admin/posts/create', {
                title: 'Cuentas',
                templateUrl: 'partials/panel/admin/posts/create.html',
                controller: 'create'
            })
            .when('/admin/posts/:id', {
                title: 'Editar Cuenta',
                templateUrl: 'partials/panel/admin/posts/edit.html',
                controller: 'data'
            }) 
            .when('/admin/packs', {
                title: 'Cuentas',
                templateUrl: 'partials/panel/admin/packs/index.html',
                controller: 'data'
            })
            .when('/admin/packs/create', {
                title: 'Cuentas',
                templateUrl: 'partials/panel/admin/packs/create.html',
                controller: 'create'
            })
            .when('/admin/packs/:id', {
                title: 'Editar Cuenta',
                templateUrl: 'partials/panel/admin/packs/edit.html',
                controller: 'data'
            })                   
            .when('/404', {
                title: 'Project',
                templateUrl: 'partials/404.html',
                controller: 'auth'
            })
            .when('/expired', {
                title: 'Sesión expirada',
                templateUrl: 'partials/expired.html',
                controller: 'auth'
            })
            .when('/', {
                title: 'Project',
                templateUrl: 'partials/main.html',
                controller: 'landing'
            })            
            .when('/:slug', {
                title: '',
                templateUrl: 'partials/slug.html',
                controller: 'slug'
            })
            .otherwise({
                redirectTo: '/'
            });


        $httpProvider.interceptors.push('httpRequestInterceptor');
        $locationProvider.html5Mode(true);            
        //$httpProvider.defaults.cache = true;

  }])
    .run(function ($http, $localStorage, $rootScope, $interval, $window, $location, $filter, AuthService, SocketService, urls) {
        
        $rootScope.$on('$viewContentLoaded', function() {});

        $rootScope.$on("$routeChangeStart", function (event, next, current) {

            $rootScope.baseurl = urls.BASE;

            $rootScope.backtop = function(){
                $('html, body').animate({
                     scrollTop: 0
                }, 800);
            }

            var privatePages = ['admin','account','credential'];
            var restrictedPage = privatePages.indexOf($filter('uri').segment(2)) != -1;

            if (restrictedPage && !$localStorage.jwt) {
                return $location.path('/signin');
            }
        });
    });

app.filter("sanitize", ['$sce', function($sce) {
  return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
  }
}]);

app.filter('uri', function($location) {
    return {
        segment: function(segment) {
            var data = $location.path().split("/");
            if(data[segment-1]) { return data[segment-1]; }
            return false;
        },
        total_segments: function() {
            var data = $location.path().split("/");
            var i = 0;
            angular.forEach(data, function(value){
                if(value.length) { i++; }
            });
            return i;
        },
        current: function(){
            var data = $location.path().split("/");
            return data.join('/');
        }
    };
});