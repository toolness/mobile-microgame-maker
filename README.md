This is a very early attempt at a Mobile Microgame Maker (MMM) for
[Minicade][]. 

## Design Opportunity

* Minicade is built to make it easy for anyone of any skill level
  to build a minigame using the tool of their choice, but there
  aren’t any good tools suitable for building very simple HTML5
  minigames on mobile devices, which is where we think a lot of our 
  users are.

* Minigame development is potentially well-suited for mobile and
  touch devices, as the minigame’s conceptual simplicity might 
  complement the device’s relatively low screen real-estate and
  lack of physical keyboard. The existence and success of
  [WarioWare DIY][] is suggestive of this.

## Solution

Create a mobile-first, offline-ready HTML5 minigame maker that
allows non-technical users to create a variety of simple minigames.

## Minimum Viable Product (MVP) Requirements

* Rough versions of the following types of games should be able to
  be created using MMM:
  * [I Wonder What's This Red Button Do?][button_game] from
    *Dumb Ways To Die*
  * [Get Your Toast Out With A Fork][fork_game] from
    *Dumb Ways To Die*
  * [Flyswat][], one of the original minigames for Minicade

* Minigames should be playable on mobile devices and desktop/laptop.
  This means that we can only assume that the player’s device
  represents **a pointer capable of taps/clicks and drags**. To be
  clear, this means no multi-touch gestures, no keyboard, no mouse
  hovering, and certainly no accelerometer/GPS/camera/etc.

* Authors must be able to write very short text instructions for
  their game (which players should be able to read and comprehend
  during the tiny amount of time they have to play the game).

* Authors must be able to select pre-made graphics for their games
  and position them on-screen. Each object should have a
  human-readable unique identifier, such as `Object1`.

* Authors must be able to create win/lose screens consisting,
  at minimum, of text.

* Authors, if so inclined, should be able to "level up" their
  skills and learn how to code HTML5 games by examining and
  tinkering with the [Phaser][]-based JavaScript code that
  MMM generates for them.

## Quick Start

Working on the project just requires a web server that serves
static files from the root of the repository. If you don't have
one, try `python -m SimpleHTTPServer`, or if you like node use
[http-server][].

## Running Tests

QUnit tests are located in the `test` directory. Just visit it
in your web browser to run the test suite.

## Optimized Builds

The default development "build" doesn't have support for offline
use and takes time to load every required [requirejs][] module
from the server. For faster builds that support offline use, you'll
need to first run `npm install` and then run
`node bin/build-optimized.js`. All files required for the optimized
build will be placed in the `build` directory, which you can deploy
to any static web server or Amazon S3.

## Adding Assets

During development, microgame assets, such as spritesheets, sounds,
and so on, are expected to be stored in a Google Spreadsheet, which 
allows content creators to add their assets without blocking on
a developer. The spreadsheet can be loaded by adding
`?spreadsheet=<key>` to the end of the MMM url, where `<key>` is the
key for the spreadsheet. Alternatively, `?spreadsheet=on` can be
supplied, in which case the [default assets spreadsheet][sheet] will
be loaded.

Note that any errors that occur while loading the sheet will be
logged to the browser's developer console.

<!-- Links -->

  [Minicade]: http://minica.de/
  [WarioWare DIY]: http://en.wikipedia.org/wiki/WarioWare_D.I.Y.
  [button_game]: http://dumbway2sdie.wikia.com/wiki/I_wonder_what%27s_this_red_button_do%3F
  [fork_game]: http://dumbway2sdie.wikia.com/wiki/Get_your_Toast_out_with_a_Fork
  [Flyswat]: https://github.com/toolness/flyswat-minigame
  [Phaser]: http://phaser.io/
  [http-server]: https://www.npmjs.org/package/http-server
  [requirejs]: http://requirejs.org/
  [sheet]: https://docs.google.com/spreadsheets/d/15P3ABqc128s1z4vA2Ln1EdrFTXPxZ8YMaiW1w3o1qgs/edit#gid=0
