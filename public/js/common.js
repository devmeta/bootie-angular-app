
// get permission to run notifications
var webnotigranted = false;

function askNoti(){
  if(Notification.permission && Notification.permission!='granted'){
    Notification.requestPermission().then(function(result) {
      return ('granted'==result);
    });
  }
}

function notification(theTitle, theIcon, theBody) {
  if(!webnotigranted) webnotigranted = askNoti();
  var options = {};
  if(theIcon == null) theIcon = '/assets/img/system.png';
  options.icon = theIcon;
  if(theBody) options.body = theBody;
  var n = new Notification(theTitle, options);
  var audio = new Audio('/assets/audio/notification.ogg');
  audio.play();  
  setTimeout(n.close.bind(n), 8000);
}
$(document).on('display','body',function(e){
  $('#twitter').sharrre({
    share: {
      twitter: true
    },
    enableHover: false,
    enableTracking: true,
    enableCounter: false,
    buttons: { twitter: {via: 'CreativeTim'}},
    click: function(api, options){
      api.simulateClick();
      api.openPopup('twitter');
    },
    template: '<i class="fa fa-twitter"></i> Twitter &middot; 532',
    url: 'http://presentation.creative-tim.com/'
  });

  $('#facebook').sharrre({
    share: {
      facebook: true
    },
    enableHover: false,
    enableTracking: true,
    enableCounter: false,
    click: function(api, options){
      api.simulateClick();
      api.openPopup('facebook');
    },
    template: '<i class="fa fa-facebook-square"></i> Facebook &middot; 352',
    url: 'http://presentation.creative-tim.com/'
  });
});

$(document).on('click','.js-search',function(e){
  return location.search = $(this).data('search');
});

$(document).on('submit','.form.ajax',function(e){

  e.preventDefault();
    
  if( $(this).attr("action") ){
    $('body').addClass("loading");
    $(this).find('button').addClass('disabled');

    var arr = $(this).attr("action").split('/');
    arr = $.grep(arr, function(n){ return (n); });
    var callback = arr.join('_');

    $.ajax({
      type: 'post',
      url: $(this).attr('action'),
      data: $(this).serialize(),
      success:function(json){
        if(json.redirect){
          location.href = json.redirect;
        }
        if(typeof Desktop.options.forms[callback] == 'function') {
          Desktop.options.forms[callback].call(this,json);
        }
        $('body').removeClass("loading");
      }
    });

    return false;
  } 

  if(typeof Desktop.options.forms[callback] == 'function') {
    Desktop.options.forms[callback].call(this,null);
  }

  return false;
});


