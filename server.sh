#!/bin/bash

rm -r public

hugo server -D --bind 127.0.0.1 --baseURL http://127.0.0.1:8080 -p 8080