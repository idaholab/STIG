#!/bin/bash
# TODO: Work In Progress...
#  			add in echo command instructions for adding to path
#       fix build_db.txt to use a variable database sent from here
# 			Add in Windows Functionality
#
# Tested on:
#   Ubuntu 16.04 LTS
#
# Note: This script checks for the following environment variables:
#   ORIENTDB_HOME
#   STIG_HOME
#
# You can set the variables with the following commands:
#   export ORIENTDB_HOME=/opt/orientdb
#   export PATH=$PATH:$ORIENTDB_HOME/bin
#
#
# The build_db.txt currently uses a database called: stig2, for now
# this needs to be manually entered edited
#
#

#variables
STIG_DIR=$PWD

echo $STIG_DIR

#Check OS versions here.
#TODO: Only out of the box diff is probably MacOS and Windows
#The Following instructions might need if/el for different OS, specifically for env variables
if [[ "$OSTYPE" == "linux-gnu" ]]; then
	echo "GNU"
elif [[ "$OSTYPE" == "darwin"* ]]; then
	echo "MACOS"
elif [[ "$OSTYPE" == "cygwin" ]]; then
	echo "POSIX"
elif [[ "$OSTYPE" == "msys" ]]; then
	echo "msys"
elif [[ "$OSTYPE" == "win32" ]]; then
	echo "win32"
elif [[ "$OSTYPE" == "freebsd"* ]]; then
	echo "freebsd"
else
	echo "OS not found"
fi


# Check for environment variables
# TODO: Only works for Linux
if [[ ! -v ORIENTDB_HOME ]]; then
	echo "ORIENTDB_HOME is not set"
	echo "Please set ORIENTDB_HOME variable and add to your PATH"
	#echo "export ORIENTDB_HOME=/opt/orientdb'"
	#echo "export PATH=$PATH:$ORIENTDB_HOME/bin'"
	exit;
elif [[ -z "${ORIENTDB_HOME}" ]]; then
	echo "ORIENTDB_HOME is set to the empty string"
else
	echo "ORIENTDB_HOME has the value: $ORIENTDB_HOME"
fi


echo "Initializing Build Script for OrientDB and STIG"
echo "Warning: this script will drop your database stig"

read -p "Are you sure? " -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
#	(cd ${ORIENTDB_HOME}/bin && source console.sh $STIG_DIR/empty_build_db.txt)
	(cd ${ORIENTDB_HOME}/bin && source console.sh "SET ignoreErrors true;DROP DATABASE remote:localhost/stig root admin plocal;SET ignoreErrors false;CREATE DATABASE remote:localhost/stig root admin plocal;IMPORT DATABASE $STIG_DIR/stig.gz -preserveClusterIDs=true")

fi


echo "OrientDB Build Script Finished for STIG"
