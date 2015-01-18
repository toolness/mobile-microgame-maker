var StartupManager = {
  msgEl: null,
  begin: function(msgEl) {
    this.msgEl = msgEl;
    window.addEventListener("error", this.handleError, false);
  },
  end: function() {
    window.removeEventListener("error", this.handleError, false);
  }
};

StartupManager.handleError = function(e) {
  this.msgEl.style.color = "red";
  this.msgEl.textContent = e.message;
}.bind(StartupManager);
