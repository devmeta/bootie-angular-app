(function() {
  'use strict';
  angular.module('readableTime', []).filter('readableTime', function() {
    return function(seconds) {
      var day, format, hour, minute, month, week, year;
      seconds = parseInt(seconds/1000, 10);
      minute = 60;
      hour = minute * 60;
      day = hour * 24;
      week = day * 7;
      year = day * 365;
      month = year / 12;
      format = function(number, string) {
        string = number === 1 ? string : "" + string + "s";
        return "" + number + " " + string;
      };
      switch (false) {
        case !(seconds < minute):
          return format(seconds, 'second');
        case !(seconds < hour):
          return format(Math.floor(seconds / minute), 'minuto');
        case !(seconds < day):
          return format(Math.floor(seconds / hour), 'hora');
        case !(seconds < week):
          return format(Math.floor(seconds / day), 'día');
        case !(seconds < month):
          return format(Math.floor(seconds / week), 'semana');
        case !(seconds < year):
          return format(Math.floor(seconds / month), 'mes');
        default:
          return format(Math.floor(seconds / year), 'año');
      }
    };
  });

}).call(this);

/*
//@ sourceMappingURL=angular-readable-time.js.map
*/