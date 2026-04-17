#!/bin/sh

CURRENT_DIRECTORY="$(pwd)";

function install_dependencies
{
	cd "$CURRENT_DIRECTORY/modules/$1";
	npm i;
};

install_dependencies frontend
install_dependencies database
install_dependencies checkout
install_dependencies authentication

cd $CURRENT_DIRECTORY;
