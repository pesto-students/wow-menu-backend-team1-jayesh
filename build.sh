#!/bin/bash

cp .env.staging .env
export APP_ENV=production
echo "$APP_ENV is building"
npm i