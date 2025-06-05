#!/bin/bash

if git diff --quiet HEAD^ HEAD -- . ':!backend'; then
  echo "Only backend folder changed. Skipping build."
  exit 0
else
  echo "Changes outside backend detected. Proceeding with build."
  exit 1
fi
