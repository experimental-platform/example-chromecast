# Chromecast Example for Experimental Platform

[The node.js code](https://github.com/experimental-platform/example-chromecast/blob/master/index.js) has only a few lines and is easy to understand. It uses [castnow](https://github.com/xat/castnow) to stream an mp4 file to a Chromecast.

## Requirements

* A machine that runs [Experimental Platform](https://github.com/experimental-platform/platform-configure-script)
* A [Chromecast that plays videos](http://www.google.com/chromecast/tv/) and is in the same network as your experimental platform

## Installation

    git clone git@github.com:experimental-platform/example-chromecast.git
    cd example-chromecast
    git remote add platform ssh://dokku@your-box.local:8022/example-chromecast
    git push platform master