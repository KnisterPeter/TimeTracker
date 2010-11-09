qx.Class.define('timetracker.Project', {
  extend: qx.core.Object,

  construct: function(input) {
    this.base(arguments);
    this.fromNative(input);
  },

  events: {
    'updatedTask': 'qx.event.type.Data'
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
          var task = new timetracker.Task(this, entry);
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

    addTask: function(task) {
      if (this.getTasks()[task.getName()]) {
        alert('Task already exists');
        return;
      }
      this.getTasks()[task.getName()] = task;
      this.fireDataEvent('updatedTask', {type: 'add', task: task});
    },

    delTask: function(task) {
      delete this.getTasks()[task.getName()];
      this.fireDataEvent('updatedTask', {type: 'del', task: task});
    },

    clear: function() {
      qx.lang.Object.getValues(this.getTasks()).forEach(function(task) {
        task.clear();
      }, this);
    }
  }
});

