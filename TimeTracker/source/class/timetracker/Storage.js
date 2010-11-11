qx.Class.define('timetracker.Storage', {
  extend: qx.core.Object,
  type: 'singleton',

  properties: {
    model: {
      init: null,
      check: 'timetracker.model.Root',
      event: 'changeModel'
    },
    activeTask: {
      init: null,
      nullable: true,
      check: 'timetracker.model.Task',
      apply: '_applyActiveTask',
      event: 'changeActiveTask'
    }
  },

  members: {
    save: function() {
        localStorage.setItem('timetracker.projects', qx.util.Json.stringify(this.getModel().toNative()));
    },

    load: function() {
      var data = localStorage.getItem('timetracker.projects');
      if (data) { data = qx.util.Json.parse(data); }
      this.setModel(new timetracker.model.Root(data));
    },

    clear: function() {
      this.getModel().clear();
      this.save();
    },

    _applyActiveTask: function(task, old) {
      if (old != null) {
        old.stop();
      }
      if (task != null) {
        task.start();
      }
    },

    startTask: function(task) {
      this.setActiveTask(task);
      this.save();
    },

    stopTask: function() {
      if (this.getActiveTask() != null) {
        this.setActiveTask(null);
      }
      this.save();
    }
  }
});

