#!/bin/sh

if [ -f universaleditbutton.zip ]; then
    rm -f universaleditbutton.zip
fi

zip universaleditbutton.zip *.js manifest.json README.md skin skin/*.png
