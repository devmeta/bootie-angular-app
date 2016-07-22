angular.module('controllers', [])

.controller('header', function ($scope, AuthService) {
  $scope.isAuthenticated = AuthService.isAuthenticated;
  $scope.initRightMenu = function() {
    navbar_initialized = false;
    rubik.initRightMenu();
  }
})

.controller('auth', function ($scope, $localStorage, $rootScope, $timeout, $location, $http, ApiService,AuthService) {
    $scope.login = {};
    $scope.signup = {};
    $scope.jwt = $localStorage.jwt ? JSON.parse($localStorage.jwt) : false;
    $scope.doLogin = function (customer) {
        ApiService.post('/login',{
            customer: customer
        }).then(function (results) {
            ApiService.toast(results);
            if (results.status == "success") {
                var jwt = results.auth.jwt;
                if(jwt){
                    $http.defaults.headers.common['X-Auth-Token'] =  'Bearer ' + jwt.token;
                    $localStorage.jwt = JSON.stringify(jwt);
                    $rootScope.jwt = jwt;
                    return $location.path(jwt.data.role + '/dash');
                }
                return $location.path('credential');
            }
        });
    };
    $scope.signup = {email:'',pass:'',title:'',phone:'',address:'',city:''};
    $scope.signUp = function (customer) {
        ApiService.post('/register', {
            customer: customer
        }).then(function (results) {
            ApiService.toast(results);
            if (results.status == "success") {
                store.setToken(results.token);
                var jwt = results.jwt
                $localStorage.jwt = JSON.stringify(jwt);
                $rootScope.jwt = jwt;
                $location.path('credential');
                $timeout(function(){
                    $window.location.href = '/singin';
                },2000);
            }
        });
    };
    
    $scope.logout = function () {
        $http.defaults.headers.common['X-Auth-Token'] =  '';
        delete $localStorage.jwt;
        ApiService.toast({'status':'success','message':"Has finalizado sesión exitosamente."});
        AuthService.isAuthenticated(false);
        $location.path('login');
    }
})

.controller('landing', function ($scope, ApiService) {
    ApiService.get('/landing').then(function (results) {
        $scope.header = results.header;
        $scope.middle = results.middle;
        $scope.packs = results.packs;
        $scope.lines = grep(results.packs,'content');
    });
})

.controller('slug', function ($scope, $routeParams, ApiService) {
    ApiService.get('/blog/'+$routeParams.slug).then(function (results) {
        $scope.entry = results.entry;
    });
})

.controller('packs', function ($scope, $routeParams, $filter, ApiService) {
    for(var i in $routeParams) $scope[i]=$routeParams[i];
    var uri = $filter('uri').current();
    ApiService.get(uri).then(function (results) {
        $scope.data = results;
        $scope.lines = grep(results,'content');
    });
})

.controller('data', function ($scope, $timeout, $window, $routeParams, $filter, ApiService) {
    for(var i in $routeParams) $scope[i]=$routeParams[i];
    var uri = $filter('uri').current();
    ApiService.get(uri).then(function (results) {
        $scope.data = results;
    });

    $scope.delete = function() {
        if(confirm('There is no undo after this. You really wanna delete?')){
            var section = $filter('uri').segment(3);
            ApiService.delete( uri, {
                customer: this.data
            }).then(function (results) {
                if(results.status == 'success'){
                    $timeout(function(){
                        $window.location.href = '/admin/' + section;
                    },2000);
                }
                ApiService.toast(results);
            });
        }
    };    

    $scope.submit = function() {
        ApiService.put( uri, {
            customer: this.data
        }).then(function (results) {
            ApiService.toast(results);
        });
    };    
})

.controller('create', function ($scope, $window, $routeParams, $filter, ApiService) {
    for(var i in $routeParams) $scope[i] = $routeParams[i];
    var uri = $filter('uri').current().replace('/create','');
    $scope.submit = function() {
        ApiService.post( uri, {
            customer: this.data
        }).then(function (results) {
            if(results.id) {
                $window.location.href = uri + '/' + results.id;
            }
            ApiService.toast(results);
        });
    };    
})

.controller('tageditor', function ($scope, $element, $routeParams, $filter, ApiService) {

      var id = $scope.id;
      var namespace = $($element).data('namespace');

      // tags included

      $scope.tag_exclude = function(tag){

        ApiService.post('/tags/remove/' + id,{
            customer: {
              tags : [tag]
            }
        }).then(function (json) {
            if(json.result=="success"){
                var index = $scope.included.indexOf(tag);
                $scope.included.splice(index, 1);
                $scope.excluded.push(tag);
                ApiService.toast({'status':'success','message':"Tag excluido correctamente."});
            }
        });
          return false;
      };


      // tags excluded

     $scope.tag_include = function(tag){

        ApiService.post('/tags/add/' + namespace + '/' + id,{
            customer: {
              tags : [tag]
            }
        }).then(function (json) {
            if(json.result=="success"){
                var index = $scope.excluded.indexOf(tag);
                $scope.excluded.splice(index, 1);
                $scope.included.push(tag);
                ApiService.toast({'status':'success','message':"Tag incluido correctamente."});
            }
        });
      };


      // tags add
      $scope.tag_add = function(){
        var tags_str = $.trim($( "#tags-add" ).val());

        if(tags_str == ""){
          ApiService.toast({'status':'warning','message':"Ingrese al menos 1 tag para incluir"});
          return false;
        }

        var tags = tags_str.split(" ");

        for(var i in tags){
          tags[i] = $.trim(tags[i]);
        }
        
        $( "#tags-add" ).val( "" );

        ApiService.post('/tags/add/' + namespace + '/' + id,{
            customer: {
              tags : tags
            }
        }).then(function (json) {
          if(json.result=="success"){
            for(var i in tags){
                $scope.included.push(tags[i]);
            }
          }
          $('body').removeClass("loading");    

          var p = tags.length > 1 ? 's':'';
          ApiService.toast({'status':'success','message':"Tag" + p + " creado" + p + " correctamente."});
        });
        return false;

    };


    ApiService.get('/tags/' + namespace + '/' + id).then(function (json) {
        if(json){
            $scope.included = json.included;
            $scope.excluded = json.excluded;
        }
    });    
});


function grep(data,key){
    var lines = [];
    angular.forEach(data, function(item, k) {
        if(item[key]){
            var self_lines = item[key].split("\n");
            var temp = [];
            for(var i in self_lines){
                if(self_lines[i] != ''){
                    temp.push(self_lines[i]);
                }
            }
            lines.push(temp);
        }
    });
    return lines;
}