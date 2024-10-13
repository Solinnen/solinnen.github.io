#!/bin/bash

rm -r public

hugo server -D --bind 192.168.1.140 --baseURL http://192.168.1.140:8080 -p 8080