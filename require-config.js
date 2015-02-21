var require = {
  paths: {
    "text": "vendor/require.text",
    "jsx": "vendor/require.jsx",
    "prism": "vendor/prism",
    "URLUtils": "vendor/URLUtils",
    "hammer": "vendor/hammer",
    "tabletop": "vendor/tabletop",
    "underscore": "vendor/underscore",
    "guid": "vendor/guid",
    "blockly/base": "vendor/blockly/blockly_compressed",
    "blockly/blocks": "vendor/blockly/blocks_compressed",
    "blockly/javascript": "vendor/blockly/javascript_compressed",
    "blockly": "vendor/blockly/en",
    "jquery": "vendor/jquery",
    "jquery-bootstrap": "vendor/bootstrap/js/bootstrap",
    "JSXTransformer": "vendor/react/build/JSXTransformer",
    "react": "vendor/react/build/react-with-addons",
  },
  waitSeconds: 120,
  jsx: {
    fileExtension: '.jsx'
  },
  packages: [
    {
      name: "src/migrations"
    }
  ],
  shim: {
    "prism": {
      exports: "Prism"
    },
    "URLUtils": {
      exports: "URLUtils"
    },
    "jquery-bootstrap": {
      deps: ["jquery"],
      exports: "jQuery"
    },
    "tabletop": {
      exports: "Tabletop"
    },
    "underscore": {
      exports: "_"
    },
    "blockly/blocks": {
      deps: ["blockly/base"]
    },
    "blockly/javascript": {
      deps: ["blockly/blocks"]
    },
    "blockly": {
      deps: ["blockly/javascript"],
      exports: "Blockly"
    },
    "assets/js/phaser-microgame-0.1": {
      exports: "PhaserMicrogame"
    }
  }
};

if (typeof(module) != "undefined")
  module.exports = require;
