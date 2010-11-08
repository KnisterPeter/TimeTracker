qx.Class.define('timetracker.ConfirmDialog', {
  extend: qx.ui.window.Window,
  statics: {
    confirm: function(question, callback) {
      new timetracker.ConfirmDialog(question, callback);
    }
  },
  construct: function(question, callback) {
    this.base(arguments, 'Confirm...');
    this.setAllowClose(false);
    this.setAllowMaximize(false);
    this.setAllowMinimize(false);
    this.setShowClose(false);
    this.setShowMaximize(false);
    this.setShowMinimize(false);
    this.setAlwaysOnTop(true);
    this.setModal(true);
    this.setResizableTop(false);
    this.setResizableRight(false);
    this.setResizableBottom(false);
    this.setResizableLeft(false);

    this.setLayout(new qx.ui.layout.VBox(10));
    this.add(new qx.ui.basic.Label(question));
    var buttons = new qx.ui.container.Composite(new qx.ui.layout.HBox(5));
    buttons.add(new qx.ui.core.Spacer(), {flex: 1});
    var okBtn = new qx.ui.form.Button('Ok');
    okBtn.addListener('execute', function() {
      this.close();
      callback();
    }, this);
    buttons.add(okBtn);
    var cancelBtn = new qx.ui.form.Button('Cancel');
    cancelBtn.addListener('execute', function() {
      this.close();
    }, this);
    buttons.add(cancelBtn);
    this.add(buttons);

    this.center();
    this.open();
  }
});

