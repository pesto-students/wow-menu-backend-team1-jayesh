#!/bin/bash

echo "preparing for husky"
if [[ $APP_ENV == "local" ]]; then husky install; fi