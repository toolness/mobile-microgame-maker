define(function(require) {
  var Blockly = require('blockly');
  var goog = window.goog;

  function hackedFieldOnMouseUp(e) {
    // The following is taken directly from
    // https://github.com/google/blockly/blob/master/core/field.js
    // as of commit 65392111044c13fcaa697bdd3c53646c7678094c,
    // but *excludes* an iOS-specific branch that causes
    // field editors to break on iOS 8. For more information, see
    // https://github.com/google/blockly/issues/17.

    if (Blockly.isRightButton(e)) {
      // Right-click.
      return;
    } else if (Blockly.Block.dragMode_ == 2) {
      // Drag operation is concluding.  Don't open the editor.
      return;
    } else if (this.sourceBlock_.isEditable()) {
      // Non-abstract sub-classes must define a showEditor_ method.
      this.showEditor_();
    }
  }

  return function hack() {
    Blockly.Field.prototype.onMouseUp_ = hackedFieldOnMouseUp;
  };
});
