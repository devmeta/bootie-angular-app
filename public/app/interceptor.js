angular.module('interceptor', [])

.factory('httpRequestInterceptor', function ($q, $location, $window, $localStorage, AuthService) {
    return {
        request: function(config){ 
            if($localStorage.jwt){
                var jwt = JSON.parse($localStorage.jwt);

                if(jwt&&jwt.data.role){
                    config.headers['X-Auth-Token'] =  'Bearer ' + jwt.token;
                    AuthService.isAuthenticated(jwt.data.role);
                }

                if(jwt&&jwt.data.remember==false){
                    $window.onbeforeunload = function() {
                        $localStorage.$reset();
                    }                
                }

            }
            return config; 
        },
        responseError: function(rejection) {
            if(rejection.status === 401){
                $location.path('/expired');
            }

            if(rejection.status === 404){
                $location.path('/404');
            }

            return $q.reject(rejection);
         }
     };
});