var Sprite = React.createClass({
  handleChangeKey: function(e) {
    var key = e.target.value;
    this.props.onChange(this.props.sprite.id, {
      key: {$set: key},
      animation: {$set: this.props.gameData.animations[key][0].name}
    });
  },
  handleChangeAnimation: function(e) {
    this.props.onChange(this.props.sprite.id, {
      animation: {$set: e.target.value}
    });
  },
  handleBlurNumber: function(prop, e) {
    e.target.value = this.props.sprite[prop];
  },
  handleChangeNumber: function(prop, e) {
    var val = parseFloat(e.target.value);
    if (isNaN(val)) return;
    var changes = {};
    changes[prop] = {$set: val};
    this.props.onChange(this.props.sprite.id, changes);
  },
  getInitialState: function() {
    return {isCollapsed: true};
  },
  handleToggleCollapse: function() {
    this.setState({isCollapsed: !this.state.isCollapsed});
  },
  render: function() {
    var sprite = this.props.sprite;
    var animations = this.props.gameData.animations[sprite.key] || [];
    return (
      <li className="list-group-item">
        <div>
          <div style={{display: 'inline-block', width: 38, height: 32, verticalAlign: 'bottom'}}>
            <CssSprite sprite={sprite} gameData={this.props.gameData} maxDimension={32} />
          </div>
          <code>{sprite.name}</code>
          <button className="btn btn-default" style={{float: 'right'}} onClick={this.handleToggleCollapse}>
            <span className={React.addons.classSet({
              'glyphicon': true,
              'glyphicon-chevron-down': this.state.isCollapsed,
              'glyphicon-chevron-up': !this.state.isCollapsed
            })}></span>
          </button>

        </div>
        {this.state.isCollapsed ? null :
        <div>
          <br/>
          <div className="form-group">
            <label>Spritesheet</label>
            <select className="form-control" value={sprite.key} onChange={this.handleChangeKey}>
              {this.props.gameData.spritesheets.map(function(info) {
                return <option key={info.key} value={info.key}>{info.key}</option>
              })}
            </select>
          </div>
          <div className="form-group">
            <label>Animation</label>
            <select className="form-control" value={sprite.animation} onChange={this.handleChangeAnimation}>
              {animations.map(function(info) {
                return <option key={info.name} value={info.name}>{info.name}</option>
              })}
            </select>
          </div>
          <div className="row">
            <div className="col-xs-6 form-group">
              <label>X</label>
              <input className="form-control" type="text" defaultValue={sprite.x} onChange={this.handleChangeNumber.bind(null, 'x')} onBlur={this.handleBlurNumber.bind(null, 'x')}/>
            </div>
            <div className="col-xs-6">
              <label>Y</label>
              <input className="form-control" type="text" defaultValue={sprite.y} onChange={this.handleChangeNumber.bind(null, 'y')} onBlur={this.handleBlurNumber.bind(null, 'y')}/>
            </div>
          </div>
          <button className="btn btn-xs btn-default" onClick={this.props.onRemove.bind(null, sprite.id)}>
            <span className="glyphicon glyphicon-trash"></span>
          </button>
        </div>}
      </li>
    );
  }
});
