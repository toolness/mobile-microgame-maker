#! /usr/bin/env python

import os
import sys
import subprocess
import argparse

PHASER_VERSION = "2.2.1"
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

buildtype = 'online'
s3bucket = 'mmm.minica.de'

parser = argparse.ArgumentParser(
    description='Build optimized MMM bundle and upload to S3.'
)
parser.add_argument(
    '--offline', action='store_true',
    help='Build bundle w/ mmm.appcache and upload to ommm.minica.de.'
)
parser.add_argument(
    '--dry-run', action='store_true',
    help='Don\'t actually upload to S3.'
)

args = parser.parse_args()
env = {'ENABLE_APPCACHE': ''}

env.update(os.environ)

if args.offline:
    buildtype = 'offline'
    s3bucket = 'ommm.minica.de'

print "Exporting %s build to s3://%s.\n" % (buildtype, s3bucket)

if not args.offline:
    del env['ENABLE_APPCACHE']

def call(cmdline):
    cmdline = cmdline % {
        'BUCKET': s3bucket,
        'PHASER_VERSION': PHASER_VERSION
    }
    print 'Executing "%s"' % cmdline
    if sys.platform == 'win32':
        subprocess.check_call([
            "bash", "-c", cmdline
        ], env=env, cwd=ROOT)
    else:
        subprocess.check_call(cmdline, shell=True, env=env, cwd=ROOT)

def call_s3cmd(cmdline, caching='max-age=600'):
    flags = ['--acl-public',
             "--add-header 'Cache-Control:%s'" % caching]
    if args.dry_run:
        flags.append("--dry-run")
    cmdline = "s3cmd " + ' '.join(flags) + " " + cmdline
    call(cmdline)

call("rm -rf build")
call("node bin/build-optimized.js")

# The '/' after 'build' is REALLY important here.
call_s3cmd("sync --delete-removed build/ s3://%(BUCKET)s")

if args.offline:
    call_s3cmd("put -m text/cache-manifest "
               "build/mmm.appcache s3://%(BUCKET)s/mmm.appcache",
               caching="must-revalidate")

call("gzip -c -9 build/main.js > build/main.js.gz")
call_s3cmd("put -m application/javascript "
           "--add-header 'Content-Encoding:gzip' build/main.js.gz "
           "s3://%(BUCKET)s/main.js")

call("gzip -c -9 build/vendor/phaser-%(PHASER_VERSION)s.js > "
     "build/vendor/phaser-%(PHASER_VERSION)s.js.gz")

call_s3cmd("put -m application/javascript "
           "--add-header 'Content-Encoding:gzip' "
           "build/vendor/phaser-%(PHASER_VERSION)s.js.gz "
           "s3://%(BUCKET)s/vendor/phaser-%(PHASER_VERSION)s.js",
           caching="max-age=86400")

call_s3cmd("sync assets/js/ s3://minicade-assets/js/",
           caching="max-age=86400")
