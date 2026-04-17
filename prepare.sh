#!/bin/sh

CURRENT_DIRECTORY="$(pwd)";

cd modules/frontend;
npm i;

cd $CURRENT_DIRECTORY;
