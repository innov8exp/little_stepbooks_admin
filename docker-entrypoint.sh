#!/usr/bin/env sh
set -eu

envsubst '${ENV}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"