define(function() {
  return function importFromHtml(html) {
    var match = html.match(/^var gameData = (.+);$/m);
    if (match) {
      try {
        return JSON.parse(match[1]);
      } catch (e) {}
    }
    return null;
  };
});
