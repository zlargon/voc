#!/bin/bash

google () {
    word=$1
    host="http://soundoftext.com"
    mp3_id=$(curl -X POST $host/sounds -d "lang=en&text=$word" -s | jq '.id')
    uri=$(curl $host/sounds/$mp3_id -s | grep '<source src=' | awk -F\" '{print $2}')

    # get file name
    audio=$(echo $uri | awk -F\/ '{print $5}')
    echo $audio

    # download mp3
    curl $host$uri -s > $audio
}

# check jq
if [[ $(which jq) == "" ]]; then
    echo "command 'jq' is not found, please install it"
    echo "https://stedolan.github.io/jq/"
    exit
fi

echo "Download '$1' from Google Translate"
audio=$(google "$1")
echo "play '$audio' ..."
afplay $audio
