var require = {
  paths: {
    "text": "vendor/require.text",
    "jsx": "vendor/require.jsx",
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
  jsx: {
    fileExtension: '.jsx'
  },
  shim: {
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
    "includes/phaser-microgame": {
      exports: "PhaserMicrogame"
    },
    "includes/simple-event-emitter": {
      exports: "SimpleEventEmitter"
    }
  }
};
