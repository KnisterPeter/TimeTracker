qx.Class.define('timetracker.Format', {
  extend: qx.core.Object,
  statics: {
    time: function(time) {
      time = time / 1000 / 60;
      var hour = (time / 60).toFixed(1).toString();
      var min = (time % 60).toFixed(1).toString();

      hour = hour.substr(0, hour.indexOf('.'));
      min = min.substr(0, min.indexOf('.'));
      return (hour < 10 ? '0' + hour : hour) + ':' + (min < 10 ? '0' + min : min);
    }
  }
});

