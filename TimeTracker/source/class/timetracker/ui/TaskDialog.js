qx.Class.define('timetracker.ui.TaskDialog', {
  extend: qx.ui.window.Window,

  construct: function(project, task) {
    this.base(arguments, 'Task...');
    this.setIcon('timetracker/page_white.png');
    this._createForm();
    this.setLayout(new qx.ui.layout.Grow());
    this.add(new qx.ui.form.renderer.Single(this._form));
    this.setModal(true);

    this.setProject(project);
    if (!task) {
      this._new = true;
      task = new timetracker.model.Task(project);
    }
    this.setTask(task);
  },

  properties: {
    project: {
      init: null
    },
    task: {
      init: null,
      apply: '_applyTask',
      event: 'changeTask'
    }
  },

  members: {
    _new: false,
    _ctrl: null,
    _form: null,
    _name: null,
    _save: null,
    _cancel: null,

    _createForm: function() {
      this._form = new qx.ui.form.Form();

      this._name = new qx.ui.form.TextField();
      this._form.add(this._name, 'Name');

      this._save = new qx.ui.form.Button('Save');
      this._save.addListener('execute', this._onSave, this);
      this._form.addButton(this._save);

      this._cancel = new qx.ui.form.Button('Cancel');
      this._cancel.addListener('execute', function() {
        this.close();
      }, this);
      this._form.addButton(this._cancel);

      this._ctrl = new qx.data.controller.Form(null, this._form);
    },

    _applyTask: function(task) {
      this._ctrl.setModel(task);
    },

    _onSave: function() {
      if (this._new) {
        this.getProject().addTask(this.getTask());
      }
      timetracker.Storage.getInstance().save();
      this.close();
    }
  }
});

