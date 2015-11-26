#!/bin/bash
target=~/bin
dir=$(dirname $0)

cd $dir
mkdir -p $target
cp voc.sh $target/voc
cp google-voc.sh $target/google-voc

echo "Install success. Please add following content to ~/.bash_profile"
echo ""
echo "export PATH=\$PATH:~/bin"
echo ""
