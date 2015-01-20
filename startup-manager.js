var StartupManager = {
  msgEl: null,
  log: function(msg, color) {
    var span = document.createElement('span');
    span.textContent = msg;
    this.msgEl.appendChild(document.createElement('br'));
    this.msgEl.appendChild(span);
    if (color) span.style.color = color;
  },
  handleError: function(e) {
    this.log(e.message, "red");
  },
  autobind: function() {
    Object.keys(this).forEach(function(prop) {
      if (typeof(this[prop]) == 'function')
        this[prop] = this[prop].bind(this);
    }, this);
  },
  begin: function(msgEl) {
    this.msgEl = msgEl;
    window.addEventListener("error", this.handleError, false);
  },
  end: function() {
    window.removeEventListener("error", this.handleError, false);
  }
};

StartupManager.autobind();
