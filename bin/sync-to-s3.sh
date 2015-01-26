#! /bin/bash

node bin/build-optimized.js &&
  # The '/' after 'build' is REALLY important here.
  s3cmd sync --acl-public build/ s3://mmm.minica.de &&
  s3cmd sync --acl-public assets/js/ s3://minicade-assets/js/
