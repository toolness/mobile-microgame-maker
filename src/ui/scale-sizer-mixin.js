define(function() {
  return {
    handleScaleResize: function() {
      var scaleContainer = this.refs.scaleContainer || this;
      var rect = scaleContainer.getDOMNode().getBoundingClientRect();
      var idealWidth = this.state.scaleIdealWidth;
      var newScale;
      if (rect.width >= idealWidth) {
        newScale = 1;
      } else {
        newScale = rect.width / idealWidth;
      }
      if (this.state.scale != newScale)
        this.setState({scale: newScale});
    },
    componentDidMount: function() {
      window.addEventListener('resize', this.handleScaleResize);
      this.handleScaleResize();
    },
    componentWillUnmount: function() {
      window.removeEventListener('resize', this.handleScaleResize);
    }
  };
});
