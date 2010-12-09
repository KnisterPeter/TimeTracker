qx.Class.define('timetracker.model.Root', {
  extend: qx.core.Object,

  construct: function(input) {
    if (!input) { input = []; }
    this.base(arguments);
    this.fromNative(input);
  },

  events: {
    'updatedProject': 'qx.event.type.Data',
    'updatedTime': 'qx.event.type.Data'
  },

  properties: {
    projects: {
      init: null,
      event: 'changeProjects'
    }
  },

  members: {
    fromNative: function(input) {
      var projects = {}; 
      input.forEach(function(entry) {
        var project = new timetracker.model.Project(entry);
        project.addListener('updatedTime', this._updatedTime, this);
        projects[project.getName()] = project;
      }, this);
      this.setProjects(projects);
    },

    toNative: function() {
      var projects = [];
      qx.lang.Object.getValues(this.getProjects()).forEach(function(project) {
        projects.push(project.toNative());
      }, this);
      return projects;
    },

    _updatedTime: function() {
      this.fireDataEvent('updatedTime', 0);
    },

    addProject: function(project) {
      if (this.getProjects()[project.getName()]) {
        alert('Project already exists');
        return;
      }
      project.addListener('updatedTime', this._updatedTime, this);
      this.getProjects()[project.getName()] = project;
      this._updatedTime();
      this.fireDataEvent('updatedProject', {type: 'add', project: project});
    },

    delProject: function(project) {
      project.removeListener('updatedTime', this._updatedTime, this);
      delete this.getProjects()[project.getName()];
      this._updatedTime();
      this.fireDataEvent('updatedProject', {type: 'del', project: project});
    },

    clear: function() {
      qx.lang.Object.getValues(this.getProjects()).forEach(function(project) {
        project.clear();
      }, this);
    },

    getTotalTime: function(format) {
      var time = 0;
      qx.lang.Object.getValues(this.getProjects()).forEach(function(project) {
        time += project.getTotalTime();
      }, this);
      if (format) {
        time = timetracker.Format.time(time);
      }
      return time;
    }
  }
});

