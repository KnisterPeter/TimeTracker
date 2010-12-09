qx.Class.define('timetracker.model.Project', {
  extend: qx.core.Object,

  construct: function(input) {
    this.base(arguments);
    this.fromNative(input);
  },

  events: {
    'updatedTask': 'qx.event.type.Data',
    'updatedTime': 'qx.event.type.Data'
  },

  properties: {
    name: {
      init: '',
      event: 'changeName'
    },
    tasks: {
      init: null
    }
  },

  members: {
    fromNative: function(input) {
     if (input) {
      this.setName(input.name);
      var tasks = {}; 
      if (input['tasks']) {
        input.tasks.forEach(function(entry) {
          var task = new timetracker.model.Task(this, entry);
          task.addListener('changeOpenTime', this._updatedTime, this);
          tasks[task.getName()] = task;
        }, this);
      }
      this.setTasks(tasks);
     } else {
      this.setTasks({});
     }
    },

    toNative: function() {
      var tasks = [];
      if (this.getTasks() !== null) {
        qx.lang.Object.getValues(this.getTasks()).forEach(function(task) {
          tasks.push(task.toNative());
        }, this);
      }
      return {
        name: this.getName(),
        tasks: tasks
      };
    },

    _updatedTime: function() {
      this.fireDataEvent('updatedTime', 0);
    },

    addTask: function(task) {
      if (this.getTasks()[task.getName()]) {
        alert('Task already exists');
        return;
      }
      task.addListener('changeOpenTime', this._updatedTime, this);
      this.getTasks()[task.getName()] = task;
      this._updatedTime();
      this.fireDataEvent('updatedTask', {type: 'add', task: task});
    },

    delTask: function(task) {
      task.removeListener('changeOpenTime', this._updatedTime, this);
      delete this.getTasks()[task.getName()];
      this._updatedTime();
      this.fireDataEvent('updatedTask', {type: 'del', task: task});
    },

    clear: function() {
      qx.lang.Object.getValues(this.getTasks()).forEach(function(task) {
        task.clear();
      }, this);
    },

    getTotalTime: function(format) {
      var time = 0;
      qx.lang.Object.getValues(this.getTasks()).forEach(function(task) {
        time += task.getTotalTime();
      }, this);
      if (format) {
        time = timetracker.Format.time(time);
      }
      return time;
    }
  }
});

