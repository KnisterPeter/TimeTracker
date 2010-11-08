/* ************************************************************************

#asset(timetracker/*)

************************************************************************ */
qx.Class.define("timetracker.Application", {
  extend : qx.application.Standalone,

  members :  {
    main : function() {
      this.base(arguments);
      if (qx.core.Variant.isSet("qx.debug", "on")) {
        qx.log.appender.Native;
        qx.log.appender.Console;
      }
      this._createCommands();
      this.getRoot().add(this._getLayout(), {edge:0});
      timetracker.Storage.getInstance().load();
    },

    _createCommands: function() {
      this._newProjectCmd = new qx.ui.core.Command(null);
      this._newProjectCmd.addListener('execute', function(e) {
        var dlg = new timetracker.ProjectDialog();
        dlg.center();
        dlg.open();
      }, this);

      this._editProjectCmd = new qx.ui.core.Command(null);
      this._editProjectCmd.setEnabled(false);
      this._editProjectCmd.addListener('execute', function(e) {
        var dlg = new timetracker.ProjectDialog(this._tree.getSelection());
        dlg.center();
        dlg.open();
      }, this);

      this._removeProjectCmd = new qx.ui.core.Command(null);
      this._removeProjectCmd.setEnabled(false);
      this._removeProjectCmd.addListener('execute', function(e) {
        timetracker.Storage.getInstance().getModel().delProject(this._tree.getSelection());
        timetracker.Storage.getInstance().save();
      }, this);

      this._newTaskCmd = new qx.ui.core.Command(null);
      this._newTaskCmd.addListener('execute', function(e) {
        var sel = this._tree.getSelection();
        if (sel instanceof timetracker.Task) {
          sel = sel.getProject();
        }
        var dlg = new timetracker.TaskDialog(sel);
        dlg.center();
        dlg.open();
      }, this);

      this._editTaskCmd = new qx.ui.core.Command(null);
      this._editTaskCmd.setEnabled(false);
      this._editTaskCmd.addListener('execute', function(e) {
        var task = this._tree.getSelection();
        var dlg = new timetracker.TaskDialog(task.getProject(), task);
        dlg.center();
        dlg.open();
      }, this);

      this._removeTaskCmd = new qx.ui.core.Command(null);
      this._removeTaskCmd.setEnabled(false);
      this._removeTaskCmd.addListener('execute', function(e) {
        var task = this._tree.getSelection();
        task.getProject().delTask(task);
        timetracker.Storage.getInstance().save();
      }, this);

      this._startTaskCmd = new qx.ui.core.Command(null);
      this._startTaskCmd.setEnabled(false);
      this._startTaskCmd.addListener('execute', function(e) {
        timetracker.Storage.getInstance().startTask(this._tree.getSelection());
      }, this);

      this._stopTaskCmd = new qx.ui.core.Command(null);
      this._stopTaskCmd.setEnabled(false);
      this._stopTaskCmd.addListener('execute', function(e) {
        timetracker.Storage.getInstance().stopTask();
      }, this);
      timetracker.Storage.getInstance().addListener('changeActiveTask', function(e) {
        this._stopTaskCmd.setEnabled(e.getData() !== null);
      }, this);
    },

    _getLayout: function() {
      var composite = new qx.ui.container.Composite(new qx.ui.layout.Dock(0, 0));
      composite.add(this._getHeader(), {edge:'north'});
      composite.add(this._getMenu(), {edge:'north'});
      composite.add(this._getButtons(), {edge:'west'});
      composite.add(this._getTree(), {edge:'center'});
      return composite;
    },

    _getHeader: function() {
      var composite = new qx.ui.container.Composite(new qx.ui.layout.HBox());
      composite.setAppearance('app-header');
      composite.add(new qx.ui.basic.Label('TimeTracker'));
      composite.add(new qx.ui.core.Spacer(), {flex: 1});
      composite.add(new qx.ui.basic.Label('v1.0'));
      return composite;
    },

    _getMenu: function() {
      var project  = new qx.ui.menu.Menu();
      project.add(new qx.ui.menu.Button('New', 'timetracker/report_add.png', this._newProjectCmd));
      project.add(new qx.ui.menu.Button('Edit', 'timetracker/report_edit.png', this._editProjectCmd));
      project.add(new qx.ui.menu.Button('Remove', 'timetracker/report_delete.png', this._removeProjectCmd));

      var task  = new qx.ui.menu.Menu();
      task.add(new qx.ui.menu.Button('New', 'timetracker/page_white_add.png', this._newTaskCmd));
      task.add(new qx.ui.menu.Button('Edit', 'timetracker/page_white_edit.png', this._editTaskCmd));
      task.add(new qx.ui.menu.Button('Remove', 'timetracker/page_white_delete.png', this._removeTaskCmd));
      task.add(new qx.ui.menu.Button('Start', 'timetracker/control_play_blue.png', this._startTaskCmd));
      task.add(new qx.ui.menu.Button('Stop', 'timetracker/control_stop_blue.png', this._stopTaskCmd));

      var menubar = new qx.ui.menubar.MenuBar();
      menubar.add(new qx.ui.menubar.Button('Project', null, project));
      menubar.add(new qx.ui.menubar.Button('Task', null, task));
      return menubar;
    },

    _getButtons: function() {
      var composite = new qx.ui.container.Composite(new qx.ui.layout.VBox(5));

      composite.add(new qx.ui.basic.Label('Project:').set({margin:5}));
      composite.add(this._getNewProjectButton());
      composite.add(this._getEditProjectButton());
      composite.add(this._getRemoveProjectButton());

      composite.add(new qx.ui.basic.Label('Task:').set({margin:5}));
      composite.add(this._getNewTaskButton());
      composite.add(this._getEditTaskButton());
      composite.add(this._getRemoveTaskButton());

      composite.add(new qx.ui.basic.Label('Other:').set({margin:5}));
      composite.add(this._getStartTaskButton());
      composite.add(this._getStopTaskButton());
      var button = new qx.ui.form.Button("Reset").set({margin:5});
      composite.add(button);
      button.addListener("execute", function(e) {
        localStorage.removeItem('timetracker.projects');
      });

      return composite;
    },

    _getNewProjectButton: function() {
      var button = new qx.ui.form.Button("New", 'timetracker/report_add.png', this._newProjectCmd).set({margin:5});
      button.setCenter(false);
      return button;
    },

    _getEditProjectButton: function() {
      var button = new qx.ui.form.Button("Edit", 'timetracker/report_edit.png', this._editProjectCmd).set({margin:5});
      button.setCenter(false);
      return button;
    },

    _getRemoveProjectButton: function() {
      var button = new qx.ui.form.Button("Remove", 'timetracker/report_delete.png', this._removeProjectCmd).set({margin:5});
      button.setCenter(false);
      return button;
    },

    _getNewTaskButton: function() {
      var button = new qx.ui.form.Button("New", 'timetracker/page_white_add.png', this._newTaskCmd).set({margin:5});
      button.setCenter(false);
      button.setEnabled(false);
      return button;
    },

    _getEditTaskButton: function() {
      var button = new qx.ui.form.Button("Edit", 'timetracker/page_white_edit.png', this._editTaskCmd).set({margin:5});
      button.setCenter(false);
      return button;
    },

    _getRemoveTaskButton: function() {
      var button = new qx.ui.form.Button("Remove", 'timetracker/page_white_delete.png', this._removeTaskCmd).set({margin:5});
      button.setCenter(false);
      return button;
    },

    _getStartTaskButton: function() {
      var button = new qx.ui.form.Button('Start', 'timetracker/control_play_blue.png').set({margin:5});
      button.setCommand(this._startTaskCmd);
      button.setCenter(false);
      return button;
    },

    _getStopTaskButton: function() {
      var button = new qx.ui.form.Button('Stop', 'timetracker/control_stop_blue.png').set({margin:5});
      button.setCommand(this._stopTaskCmd);
      button.setCenter(false);
      return button;
    },

    _getTree: function() {
      this._tree = new timetracker.Tree();
      this._tree.getTree().addListener('changeSelection', function(e) {
        var sel = e.getData();
        var item = sel.length > 0 ? sel[0].getModel() : null;
        var projEnabled = item !== null && item instanceof timetracker.Project;
        var taskEnabled = item !== null && item instanceof timetracker.Task;
        this._editProjectCmd.setEnabled(projEnabled);
        this._removeProjectCmd.setEnabled(projEnabled);
        this._newTaskCmd.setEnabled(projEnabled || taskEnabled);
        this._editTaskCmd.setEnabled(taskEnabled);
        this._removeTaskCmd.setEnabled(taskEnabled);
        this._startTaskCmd.setEnabled(taskEnabled);
      }, this);

      return this._tree.getTree();
    }
  }
});
