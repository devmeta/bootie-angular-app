angular.module('directives', [])
  .directive('appHeader', function() {
    return {
      restrict: 'EA',
      link: function (scope, element, attrs) {
        attrs.$observe('isauthenticated', function (value) {
          var filename = 'default.html';
          if (value!='false') { filename = value + '.html'; }
          scope.headerUrl = 'partials/sidebar/' + filename; 
        });
      },
      template: '<div ng-include="headerUrl" onload="initRightMenu()"></div>'
    }
  })
  .directive('loading', ['$http', function ($http) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          scope.isLoading = function () {
            return $http.pendingRequests.length > 0;
          };
          scope.$watch(scope.isLoading, function (value) {
            if (value) {
              element.removeClass('ng-hide');
            } else {
              element.addClass('ng-hide');
              rubik.initAnimationsCheck();
              if($('.navbar-toggle').hasClass('toggled')){
                $('.navbar-toggle').click();            
              }
            }
          });
        }
      };
  }])
  .directive('dropzone', function($localStorage, $timeout, ApiService, urls) {
    var jwt = JSON.parse($localStorage.jwt);
    var token = jwt&&jwt.data.role?'Bearer ' + jwt.token:"";

    return function(scope, element, attrs) {

      var namespace = $(element).data('namespace');
      var domain = $(element).data('domain');
     
      element.dropzone({ 
        url: urls.BASE_API + '/files/resize',
        maxFilesize: 100,
        paramName: "file",
        addRemoveLinks:true,
        dictCancelUploadConfirmation:"¿Seguro desea cancelar?",
        maxThumbnailFilesize: 5,
        init: function() {

          this.on('sending', function(file, json, formData) {
            formData.append("id", scope.id );
            formData.append("namespace", namespace );            
            formData.append("domain", domain );            
          });

          this.on('success', function(file, json) {
            $(file.previewElement).data('id',json.id);
            $(file.previewElement).data('namespace',namespace);
            $(file.previewElement).data('domain',domain); 
            ApiService.toast({'status':'success','message':"El archivo se guardó correctamente."});
         
            /*if($('#'+namespace).find('input[name="id"]').val()==0){
              $('#'+namespace).find('input[name="id"]').val(xhr.post_id);
            } */           
          });

          this.on('error', function(file, json) {
            ApiService.toast({'status':'error','message':"El archivo no se guardó correctamente."});
          });
          
          this.on('addedfile', function(file) {
            /*scope.$apply(function(){
              //alert(file) ;
             //scope.files.push({file: 'added'});
            });*/
          });

          this.on('removedfile', function(file) {
            ApiService.post('/files/remove',{
                customer: {
                  id : $(file.previewElement).data('id'),
                  domain : $(file.previewElement).data('domain'),
                  namespace : $(file.previewElement).data('namespace')
                }
            }).then(function (results) {
                ApiService.toast({'status':'success','message':"El archivo se eliminó correctamente."});
            });
          });

          this.on('drop', function(file) {
            alert('file');
          });

          if(scope.id){

            var $this = this;

            $timeout(function() {

              ApiService.get('/files/' + namespace + '/' + scope.id).then(function (data) {
                
                angular.forEach(data, function(item, key) {

                  var mockFile = { size: item.file_size, name: item.name };

                  $this.emit("addedfile", mockFile);
                  $this.emit("thumbnail", mockFile, urls.BASE + '/upload/' + domain + '/th/' + item.name);
                  
                  $(mockFile.previewElement).data('id',item.id);
                  $(mockFile.previewElement).data('domain',domain);
                  $(mockFile.previewElement).data('namespace',namespace);
                  $(mockFile.previewElement).find('.dz-progress').hide();
                });
              });
            }, 0);
          }

          $(element).sortable({
            update: function (event, ui) {

              var sorted=[];
              var id = "";
              var namespace = "";
              var domain = "";

              $(this).find('.dz-preview').each(function(i,item){
                if(id==""){
                  id = $(item).data('parent-id');
                }
                if(namespace==""){
                  namespace = $(item).data('namespace');
                }
                if(domain==""){
                  domain = $(item).data('domain');
                }

                sorted[i] = $(item).data('id');
              });

              ApiService.post('/files/order',{
                  customer: {
                    id : id,
                    sorted : sorted,
                    namespace : namespace,
                    domain : domain
                  }
              }).then(function (results) {
                  ApiService.toast({'status':'success','message':"El archivo se ordenó correctamente."});
              });
            }
          });
        }, 
        headers: {
          'X-Auth-Token': token
        }
      });
    }
  })

  .directive('mapbox', ['$interval', function ($interval) {
    return {
      restrict: 'EA',
      replace: true,
      scope: {
        callback: "="
      },
      template: '<div></div>',
      link: function (scope, element, attributes) {
        L.mapbox.accessToken = 'pk.eyJ1IjoibWFydGluZnJlZSIsImEiOiJ5ZFd0U19vIn0.Z7WBxuf0QKPrdzv2o6Mx6A';
        var map = L.mapbox.map(element[0], 'mapbox.streets');
        scope.callback(map);
      }
    };
  }]); 

