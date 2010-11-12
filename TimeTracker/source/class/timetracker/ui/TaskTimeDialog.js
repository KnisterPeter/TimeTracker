qx.Class.define('timetracker.ui.TaskTimeDialog', {
  extend: qx.ui.window.Window,

  construct: function(task, mode) {
    this.base(arguments, mode + ' Task Time...');
    this.setTask(task);
    this._mode = mode;

    this._createForm();
    this.setLayout(new qx.ui.layout.Grow());
    this.add(new qx.ui.form.renderer.Single(this._form));

    this.setModal(true);
  },

  properties: {
    task: {
      init: null,
      check: 'timetracker.model.Task'
    }
  },

  members: {
    _mode: null,
    _form: null,

    _createForm: function() {
      this._form = new qx.ui.form.Form();

      var time = new qx.ui.form.TextField();
      this._form.add(time, "Text");

      var save = new qx.ui.form.Button('Save');
      save.addListener('execute', function() {
        this.close();
      }, this);
      this._form.addButton(save);

      var cancel = new qx.ui.form.Button('Cancel');
      cancel.addListener('execute', function() {
        this.close();
      }, this);
      this._form.addButton(cancel);
    }
  }
});

