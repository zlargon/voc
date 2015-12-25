# voc

Download and play English vocabulary's audio by command line.

The audio will be downloaded to directory `~/vocabulary` (this is configurable), and played by command line [`afplay`](https://developer.apple.com/library/mac/documentation/Darwin/Reference/ManPages/man1/afplay.1.html) (this is configurable too)

English online dictionary website:
 - [Webster](http://www.merriam-webster.com/)
 - [VoiceTube](https://tw.voicetube.com/definition/)
 - [Yahoo](http://tw.dictionary.search.yahoo.com)
 - _Google_ (API has been changed)

## Installation

```
$ npm install -g voc-cli
```

## Usage

```
Usage: voc <words...>

Options:

  -h, --help         output usage information
  -V, --version      output the version number
  -w, --webster      force download audio from webster
  -v, --voicetube    force download audio from voicetube
  -y, --yahoo        force download audio from yahoo
  -a, --audio <cli>  the command line to play .mp3 audio. set defaults to 'afplay'
  -d, --dir <path>   set the download directory. set defaults to '~/vocabulary'
  -l, --list         list all the configuration
  -r, --reset        reset configuration to default
```

## Example

```bash
$ voc hello                # download hello.mp3
$ voc hello world          # download both hello.mp3, world.mp3
```

## Configuration

```bash
$ voc -a mplayer           # set audio command line to 'mplayer'
$ voc -d ~/my_vocabulary   # set download directory to '~/my_vocabulary'
```

## License

MIT
