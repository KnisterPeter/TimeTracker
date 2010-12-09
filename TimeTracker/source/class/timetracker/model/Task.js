qx.Class.define('timetracker.model.Task', {
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

    isActive: function() {
      return this.getStartTime() > 0;
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
        time = timetracker.Format.time(time);
      }
      return time;
    }
  }
});

