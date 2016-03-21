# voc

[![npm version](https://badge.fury.io/js/voc-cli.svg)](https://badge.fury.io/js/voc-cli)

[![Dependency Status](https://david-dm.org/zlargon/voc.svg)](https://david-dm.org/zlargon/voc)
[![devDependency Status](https://david-dm.org/zlargon/voc/dev-status.svg)](https://david-dm.org/zlargon/voc#info=devDependencies)

[![Build Status](https://travis-ci.org/zlargon/voc.svg)](https://travis-ci.org/zlargon/voc)
[![Coverage Status](https://coveralls.io/repos/github/zlargon/voc/badge.svg?branch=master)](https://coveralls.io/github/zlargon/voc?branch=master)

Download and play English vocabulary's audio via command line.

The audio will be downloaded to directory `~/vocabulary` by default, and played by audio player command line.

Dictionary:
 - [Webster](http://www.merriam-webster.com/)
 - [Collins](http://www.collinsdictionary.com/)
 - [Yahoo](http://tw.dictionary.search.yahoo.com)

Text-To-Speech:
 - [Google](https://translate.google.com/)
 - [iSpeech](http://www.ispeech.org/)
 - [Voice RSS](http://www.voicerss.org/)

## Installation

```
$ npm install -g voc-cli
```

or

```
$ git clone https://github.com/zlargon/voc.git
$ cd voc/
$ npm link
```

## Usage

```
Usage: voc <words...>

Options:

  -h, --help         output usage information
  -V, --version      output the version number
  -w, --webster      force download audio from webster
  -y, --yahoo        force download audio from yahoo
  -C, --collins      force download audio from collins
  -c, --collins-edu  force download audio from collins education
  -g, --google       force download audio from google
  -i, --ispeech      force download audio from ispeech
  -v, --voicerss     force download audio from voicerss
  -a, --audio <cli>  the command line to play .mp3 audio.
  -d, --dir <path>   set the download directory. set defaults to '~/vocabulary'
  -l, --list         list all the configuration
  -r, --reset        reset configuration to default
```

## Example

```bash
$ voc hello              # download hello.mp3
$ voc hello world        # download both hello.mp3, world.mp3
$ voc hello_world -g     # download hello_world.mp3 from google service
$ voc "Hello World" -i   # download hello_world.mp3 from ispeech service
```

## Audio Player Command Line

* __MAC OSX :__ `afplay`

  https://developer.apple.com/library/mac/documentation/Darwin/Reference/ManPages/man1/afplay.1.html

* __UNIX :__ `mpg123`

  http://www.mpg123.de/

* __Windows :__ `dlc`

  http://dlcplayer.jimdo.com/

## Configuration

```bash
$ voc -d ~/my_vocabulary   # set download directory to '~/my_vocabulary'
$ voc -a mplayer           # set audio command line to 'mplayer'
$ voc -a "dlc -p"          # set audio command line to 'dlc' with argument '-p'
```

## License

MIT
