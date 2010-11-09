qx.Class.define('timetracker.Task', {
  extend: qx.core.Object,

  construct: function(project, input) {
    this.base(arguments);
    this.setProject(project);
    this.fromNative(input);
  },

  properties: {
    project: {
      /* Not persisted  */
      init: null
    },
    timerId: {
      /* Not persisted  */
      init: null,
      nullable: true
    },
    name: {
      init: '',
      event: 'changeName'
    },
    openTime: {
      init: 0,
      event: 'changeOpenTime'
    },
    startTime: {
      init: 0,
      event: 'changeStartTime'
    }
  },

  members: {
    fromNative: function(input) {
     if (input) {
      this.setName(input.name);
      this.setOpenTime(input.openTime);
      this.setStartTime(input.startTime);

      if (this.getStartTime() > 0) {
        timetracker.Storage.getInstance().setActiveTask(this);
      }
     }
    },

    toNative: function() {
      return {
        name: this.getName(),
        openTime: this.getOpenTime(),
        startTime: this.getStartTime()
      };
    },

    start: function() {
      if (this.getStartTime() == 0) {
        this.setStartTime(qx.lang.Date.now());
      }
      if (this.getTimerId() == null) {
        this.setTimerId(qx.util.TimerManager.getInstance().start(function() {
          this.fireDataEvent('changeOpenTime', 0);
        }, 1000, this));
      }
    },

    stop: function() {
      if (this.getStartTime() > 0) {
        this.setOpenTime(this.getTotalTime());
        this.setStartTime(0);
      }
      if (this.getTimerId() != null) {
        qx.util.TimerManager.getInstance().stop(this.getTimerId());
        this.setTimerId(null);
      }
    },

    clear: function() {
      this.stop();
      this.setOpenTime(0);
    },

    getTotalTime: function(format) {
      var time = this.getOpenTime();
      if (this.getStartTime() > 0) {
        time += (qx.lang.Date.now() - this.getStartTime());
      }
      if (format) {
        time = time / 1000 / 60;
        var hour = (time / 60).toFixed(1).toString();
        var min = (time % 60).toFixed(1).toString();

        hour = hour.substr(0, hour.indexOf('.'));
        min = min.substr(0, min.indexOf('.'));
        time = (hour < 10 ? '0' + hour : hour) + ':' + (min < 10 ? '0' + min : min);
      }
      return time;
    }
  }
});

