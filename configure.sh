#!/bin/sh

#VERSION="1.2.1"
VERSION="1.3"

[ -d "qooxdoo-$VERSION-sdk" ] && exit
wget "http://downloads.sourceforge.net/qooxdoo/qooxdoo-$VERSION-sdk.zip" && unzip qooxdoo-$VERSION-sdk.zip

