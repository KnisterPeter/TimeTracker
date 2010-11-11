qx.Class.define('timetracker.ui.ProjectDialog', {
  extend: qx.ui.window.Window,

  construct: function(project) {
    this.base(arguments, 'Project...');
    this.setIcon('timetracker/report.png');
    this._createForm();
    this.setLayout(new qx.ui.layout.Grow());
    this.add(new qx.ui.form.renderer.Single(this._form));
    this.setModal(true);

    if (!project) {
      this._new = true;
      project = new timetracker.model.Project();
    }
    this.setProject(project);
  },

  properties: {
    project: {
      init: null,
      apply: '_applyProject',
      event: 'changeProject'
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

    _applyProject: function(project) {
      this._ctrl.setModel(project);
    },

    _onSave: function() {
      if (this._new) {
        timetracker.Storage.getInstance().getModel().addProject(this.getProject());
      }
      timetracker.Storage.getInstance().save();
      this.close();
    }
  }
});

