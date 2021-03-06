define(function() {
  return {
    handleScaleResize: function() {
      if (this.props.onBeforeScaleResize)
        this.props.onBeforeScaleResize();
      var scaleContainer = this.refs.scaleContainer || this;
      var rect = scaleContainer.getDOMNode().getBoundingClientRect();
      var idealWidth = this.state.scaleIdealWidth;
      var newScale;
      if (rect.width >= idealWidth) {
        newScale = 1;
      } else {
        newScale = rect.width / idealWidth;
      }
      if (this.props.adjustScale)
        newScale = this.props.adjustScale(newScale);
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
