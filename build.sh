#!/bin/bash

rm -r public

hugo --gc --minify -d public -b https://solinnen.github.io --disableKinds=RSS