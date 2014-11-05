var Sprite = React.createClass({
  render: function() {
    var sprite = this.props.sprite;
    return (
      <li className="list-group-item">
        {sprite.key}/{sprite.animation} @ {sprite.x}, {sprite.y}
        &nbsp;
        <button className="btn btn-xs btn-default" onClick={this.props.onRemove.bind(null, sprite.id)}>
          <span className="glyphicon glyphicon-trash"></span>
        </button>
      </li>
    );
  }
});
