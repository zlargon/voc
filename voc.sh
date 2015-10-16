#!/bin/bash
path=~/webster

webster () {
    word=$1
    host="http://www.merriam-webster.com"
    audio=$(curl "$host/dictionary/"$word -s | grep "'$word'" | grep "au(" | awk -F'onclick="return ' '{print $2}' | awk -F';"' '{print $1}')
    if [[ $audio == "" ]] ; then
        return
    fi

    # create query string
    query=$(echo "$audio" | awk 'NR==1 {print $0}' | awk -F\' '{print "file="$2"&word="$4"&text="$6}')

    # download the audio
    curl $(curl "$host/audio.php?$query" -s | grep "embed" | awk -F\" '{print $2}') -s > $word.wav
    echo $word.wav
}

yahoo () {
    word=$1
    uri="http://l.yimg.com/tn/dict/kh/v1/"
    curl "http://tw.dictionary.search.yahoo.com/search?p="$word"&fr2=dict" -s | awk -F$uri '{print $2}' | awk -F'.mp3' '{print $1}' | while read mp3_id
    do
        if [[ $mp3_id == "" ]]; then
            continue
        fi

        # download audio
        curl $uri$mp3_id.mp3 -s > $word.mp3
        echo $word.mp3
        return
    done
}

play () {
    echo "play '$1' ..."
    afplay $1
    exit
}

main () {
    word=$1

    # check audio file
    if [ -f $word.mp3 ]; then
        play $word.mp3
    elif [ -f $word.wav ]; then
        play $word.wav
    fi

    # Webster
    echo "Download '$word' from Webster ..."
    audio=$(webster $word)
    echo "audio = $audio"
    if [[ $audio != "" ]]; then
        play $audio
    fi

    # Yahoo
    echo "Download '$word' from Yahoo ..."
    audio=$(yahoo $word)
    echo "audio = $audio"
    if [[ $audio != "" ]]; then
        play $audio
    fi
}

# create webster folder
if [ ! -d $path ] ; then
    echo "create webster folder ... $path/"
    echo ""
    mkdir -p $path
fi
cd $path

# check curl
if [[ $(which curl) == "" ]]; then
    echo "command 'curl' is not found, please install it"
    echo "http://curl.haxx.se/"
    exit
fi

# check input
if [[ $# = 0 ]] ; then
    echo "Usage: voc <word>"
    exit
fi

# run voc
main $1
