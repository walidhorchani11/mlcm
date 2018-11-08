#!/bin/bash

# Wrapper autour de la commande timeout
if (( $# < 2 )); then
  echo "$0 timeout [command...]"
  exit 0
else
  TIME="$1"; shift
fi

/usr/bin/timeout $TIME $@
OUT=$?

# Si la commande finit en timeout, logging dans syslog
if (( $OUT == 124 )); then
  echo "'$@' killed after $TIME timeout" | logger
fi

exit $OUT
