defineTests([
  "react",
  "jsx!src/ui/css-sprite",
  "src/default-game-data"
], function(React, CssSprite, defaultGameData) {
  module("CssSprite");

  test("does not explode if unable to load sprite", function() {
    var cs = React.createElement(CssSprite, {
      gameData: defaultGameData,
      sprite: {name: 'example', key: 'nonexistent'}
    });
    sinon.stub(console, "log");
    try {
      cs = React.addons.TestUtils.renderIntoDocument(cs);
      equal(console.log.args[0].slice(0, 3).join(" "),
            "Unable to load sprite example nonexistent/undefined");
    } finally {
      console.log.restore();
    }
    ok(!cs.getDOMNode().hasAttribute('style'));
    cs.unmountComponent();
  });
});
