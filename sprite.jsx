var Sprite = React.createClass({
  handleChangeKey: function(e) {
    var key = e.target.value;
    this.props.onChange(this.props.sprite.id, {
      key: {$set: key},
      animation: {$set: this.props.gameData.animations[key][0]}
    });
  },
  handleChangeAnimation: function(e) {
    this.props.onChange(this.props.sprite.id, {
      animation: {$set: e.target.value}
    });
  },
  render: function() {
    var sprite = this.props.sprite;
    var animations = this.props.gameData.animations[sprite.key] || [];
    return (
      <li className="list-group-item">
        <div style={{display: 'inline-block', width: 38, height: 32, verticalAlign: 'bottom'}}>
          <CssSprite sprite={sprite} gameData={this.props.gameData} maxDimension={32} />
        </div>
        <code>{sprite.name}</code>
        &nbsp;
        <select value={sprite.key} onChange={this.handleChangeKey}>
          {this.props.gameData.spritesheets.map(function(info) {
            return <option key={info.key} value={info.key}>{info.key}</option>
          })}
        </select>&nbsp; / &nbsp;
        <select value={sprite.animation} onChange={this.handleChangeAnimation}>
          {animations.map(function(info) {
            return <option key={info.name} value={info.name}>{info.name}</option>
          })}
        </select>        
        &nbsp;
        @ {sprite.x}, {sprite.y}
        &nbsp;
        <button className="btn btn-xs btn-default" onClick={this.props.onRemove.bind(null, sprite.id)}>
          <span className="glyphicon glyphicon-trash"></span>
        </button>
      </li>
    );
  }
});
