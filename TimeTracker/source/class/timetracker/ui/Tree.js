qx.Class.define('timetracker.ui.Tree', {
  extend: qx.core.Object,

  construct: function() {
    this.base(arguments);
    this._createTree();
    timetracker.Storage.getInstance().addListener('changeModel', this._onModelUpdate, this);
  },

  members: {
    _tree: null,

    _createTree: function() {
      this._tree = new qx.ui.tree.Tree();
      this._tree.setHideRoot(true);

      this._rootNode = new qx.ui.tree.TreeFolder('');
      this._rootNode.setOpen(true);
      this._tree.setRoot(this._rootNode);

      return this._tree;
    },

    getTree: function() {
      return this._tree;
    },

    getSelection: function() {
      return this._tree.getSelection()[0].getModel();
    },

    _onModelUpdate: function(e) {
      var model = e.getData();
      qx.lang.Object.getValues(model.getProjects()).forEach(this._createProjectNode, this);
      model.addListener('updatedProject', this._onProjectUpdate, this);
    },

    _onProjectUpdate: function(e) {
      var data = e.getData();
      switch (data.type) {
        case 'add':
          this._createProjectNode(data.project);
          break;
        case 'del':
          this._removeProjectNode(data.project);
          break;
      };
    },

    _createProjectNode: function(project) {
      var folder = new qx.ui.tree.TreeFolder();
      folder.setIcon('timetracker/report.png');
      folder.addSpacer();
      folder.addOpenButton();
      folder.addIcon();
      folder.addLabel(project.getName());
      folder.setOpen(true);
      folder.setModel(project);
      this._rootNode.add(folder);
      qx.lang.Object.getValues(project.getTasks()).forEach(function(task) { this._createTaskNode(folder, task); }, this);

      project.addListener('changeName', function(e) { folder.setLabel(e.getData()); });
      project.addListener('updatedTask', function(e) { this._onTaskUpdate(e, folder) }, this);
    },

    _removeProjectNode: function(project) {
      this._tree.getItems(true, true).forEach(function(folder) {
        if (folder.getModel() === project) {
          folder.getParent().remove(folder);
        }
      }, this);
    },

    _onTaskUpdate: function(e, parent) {
      var data = e.getData();
      switch (data.type) {
        case 'add':
          this._createTaskNode(parent, data.task);
          break;
        case 'del':
          this._removeTaskNode(parent, data.task);
          break;
      };
    },

    _createTaskNode: function(parent, task) {
      var file = new qx.ui.tree.TreeFile();
      var time = new qx.ui.basic.Label("00:00");
      this._updateTaskIcon(task, file, time);
      file.addIcon();
      file.addWidget(new qx.ui.core.Spacer(10));
      file.addWidget(time);
      file.addWidget(new qx.ui.core.Spacer(10));
      file.setModel(task);
      file.addLabel(task.getName());
      parent.add(file);

      task.addListener('changeName', function(e) { file.setLabel(e.getData()); }, this);
      task.addListener('changeOpenTime', function(e) { this._updateTaskIcon(task, file, time); }, this);
      task.addListener('changeStartTime', function(e) { this._updateTaskIcon(task, file, time); }, this);
    },

    _updateTaskIcon: function(task, node, time) {
      if (task.getStartTime() > 0) {
        node.setIcon('timetracker/time.png');
      } else if (task.getOpenTime() > 0) {
        node.setIcon('timetracker/tick.png');
      } else {
        node.setIcon('timetracker/page_white.png');
      }
      time.setValue('' + task.getTotalTime(true));
    },

    _removeTaskNode: function(parent, task) {
      parent.getItems(true, true).forEach(function(node) {
        if (node.getModel() === task) {
          parent.remove(node);
        }
      }, this);
    }
  }
});

