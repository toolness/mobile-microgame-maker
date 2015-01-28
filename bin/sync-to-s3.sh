#! /bin/bash

export PHASER_VERSION=2.2.1

node bin/build-optimized.js &&
  # The '/' after 'build' is REALLY important here.
  s3cmd sync --acl-public build/ s3://mmm.minica.de &&
  gzip -c -9 build/main.js > build/main.js.gz &&
  s3cmd put --acl-public -m application/javascript \
            --add-header 'Content-Encoding:gzip' build/main.js.gz \
            s3://mmm.minica.de/main.js &&
  gzip -c -9 build/vendor/phaser-${PHASER_VERSION}.js > \
       build/vendor/phaser-${PHASER_VERSION}.js.gz &&
  s3cmd put --acl-public -m application/javascript \
            --add-header 'Content-Encoding:gzip' \
            --add-header="Cache-Control:max-age=86400" \
            build/vendor/phaser-${PHASER_VERSION}.js.gz \
            s3://mmm.minica.de/vendor/phaser-${PHASER_VERSION}.js &&
  s3cmd sync --acl-public assets/js/ s3://minicade-assets/js/
