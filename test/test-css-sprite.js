defineTests([
  "react",
  "jsx!src/ui/css-sprite",
  "./sample-game-data"
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

  test("scales sprite when height > width", function() {
    var cs = React.createElement(CssSprite, {
      gameData: defaultGameData,
      maxDimension: 10,
      sprite: {name: 'example', key: 'fly', animation: 'flying'}
    });
    cs = React.addons.TestUtils.renderIntoDocument(cs);
    equal(cs.getDOMNode().style.height, '10px');
    equal(cs.getDOMNode().style.width.slice(0, 3), '8.6');
    cs.unmountComponent();
  });

  test("scales sprite when width > height", function() {
    var cs = React.createElement(CssSprite, {
      gameData: defaultGameData,
      maxDimension: 10,
      sprite: {name: 'example', key: 'grumpaloomba', animation: 'grumpy'}
    });
    cs = React.addons.TestUtils.renderIntoDocument(cs);
    equal(cs.getDOMNode().style.width, '10px');
    equal(cs.getDOMNode().style.height.slice(0, 3), '9.7');
    cs.unmountComponent();
  });
});
