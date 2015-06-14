voc () {
    host="http://www.merriam-webster.com"
    path=$(pwd)

    # check input
    if [[ $# = 0 ]] ; then
        echo "Usage: voc <word>"
        return;
    fi

    # create webster folder
    mkdir -p ~/webster
    cd ~/webster

    # check the word audio is exist or not
    word=$1
    if [ ! -f $word.wav ] ; then
        echo "Find the word '$word' on webster ..."
        audio=$(curl "$host/dictionary/$word" -s | grep "'$word'" | grep "au(" | awk -F'onclick="return ' '{print $2}' | awk -F';"' '{print $1}')
        if [[ $audio == "" ]] ; then
            echo "The word '$word' is not found"
            cd $path
            return;
        fi

        # show audio list with line number
        echo "$audio" | awk '{print NR ". " $0}'
        echo ""

        # create query data
        query=$(echo "$audio" | awk 'NR==1 {print $0}' | awk -F\' '{print "file="$2"&word="$4"&text="$6}')

        # download the audio
        echo "Download the word '$word' from webster ... ($query)"
        curl $(curl "$host/audio.php?$query" -s | grep "embed" | awk -F\" '{print $2}') -s > $word.wav
        echo "Download Success"
        echo ""
    fi

    # play audio
    echo "play $word ..."
    afplay $word.wav
    cd $path
}