qx.Class.define('timetracker.Root', {
  extend: qx.core.Object,

  construct: function(input) {
    if (!input) { input = []; }
    this.base(arguments);
    this.fromNative(input);
  },

  events: {
    'updatedProject': 'qx.event.type.Data'
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
        var project = new timetracker.Project(entry);
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

    addProject: function(project) {
      if (this.getProjects()[project.getName()]) {
        alert('Project already exists');
        return;
      }
      this.getProjects()[project.getName()] = project;
      this.fireDataEvent('updatedProject', {type: 'add', project: project});
    },

    delProject: function(project) {
      delete this.getProjects()[project.getName()];
      this.fireDataEvent('updatedProject', {type: 'del', project: project});
    },

    clear: function() {
      qx.lang.Object.getValues(this.getProjects()).forEach(function(project) {
        project.clear();
      }, this);
    }
  }
});

