# voc

[![][npm-img]][npm-url]

[![][dependency-img]][dependency-url]
[![][dependency-dev-img]][dependency-dev-url]

[![][travis-img]][travis-url]
[![][appveyor-img]][appveyor-url]
[![][coverage-img]][coverage-url]

> Download and play English vocabulary's audio via command line.

> The audio will be downloaded to directory `~/vocabulary` by default, and played by audio player command line.

Dictionary:

 - [Webster](http://www.merriam-webster.com/)
 - [Collins](http://www.collinsdictionary.com/)
 - [Yahoo](http://tw.dictionary.search.yahoo.com)

Text-To-Speech:

 - [Google](https://translate.google.com/)
 - [iSpeech](http://www.ispeech.org/)
 - [Voice RSS](http://www.voicerss.org/)

## Change Log

Please see [CHANGELOG](https://github.com/zlargon/voc/blob/master/CHANGELOG.md).

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
  -c, --collins      force download audio from collins
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

[npm-url]: https://nodei.co/npm/voc-cli
[npm-img]: https://nodei.co/npm/voc-cli.png

[dependency-url]: https://david-dm.org/zlargon/voc
[dependency-img]: https://img.shields.io/david/zlargon/voc.svg

[dependency-dev-url]: https://david-dm.org/zlargon/voc#info=devDependencies
[dependency-dev-img]: https://img.shields.io/david/dev/zlargon/voc.svg

[travis-url]: https://travis-ci.org/zlargon/voc
[travis-img]: https://img.shields.io/travis/zlargon/voc.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSItMTQyLjUgLTE0Mi41IDI4NSAyODUiPjxjaXJjbGUgcj0iMTQxLjciIGZpbGw9IiNERDQ4MTQiLz48ZyBpZD0iYSIgZmlsbD0iI0ZGRiI%2BPGNpcmNsZSBjeD0iLTk2LjQiIHI9IjE4LjkiLz48cGF0aCBkPSJNLTQ1LjYgNjguNGMtMTYuNi0xMS0yOS0yOC0zNC00Ny44IDYtNSA5LjgtMTIuMyA5LjgtMjAuNnMtMy44LTE1LjctOS44LTIwLjZjNS0xOS44IDE3LjQtMzYuNyAzNC00Ny44bDEzLjggMjMuMkMtNDYtMzUuMi01NS4zLTE4LjctNTUuMyAwYzAgMTguNyA5LjMgMzUuMiAyMy41IDQ1LjJ6Ii8%2BPC9nPjx1c2UgeGxpbms6aHJlZj0iI2EiIHRyYW5zZm9ybT0icm90YXRlKDEyMCkiLz48dXNlIHhsaW5rOmhyZWY9IiNhIiB0cmFuc2Zvcm09InJvdGF0ZSgyNDApIi8%2BPC9zdmc%2B

[appveyor-url]: https://ci.appveyor.com/project/zlargon/voc
[appveyor-img]: https://img.shields.io/appveyor/ci/zlargon/voc.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjEyOCIgaGVpZ2h0PSIxMjgiIHZpZXdCb3g9IjAgMCAxMjggMTI4Ij48ZyBmaWxsPSIjMUJBMUUyIiB0cmFuc2Zvcm09InNjYWxlKDgpIj48cGF0aCBkPSJNMCAyLjI2NWw2LjUzOS0uODg4LjAwMyA2LjI4OC02LjUzNi4wMzd6Ii8%2BPHBhdGggZD0iTTYuNTM2IDguMzlsLjAwNSA2LjI5My02LjUzNi0uODk2di01LjQ0eiIvPjxwYXRoIGQ9Ik03LjMyOCAxLjI2MWw4LjY3LTEuMjYxdjcuNTg1bC04LjY3LjA2OXoiLz48cGF0aCBkPSJNMTYgOC40NDlsLS4wMDIgNy41NTEtOC42Ny0xLjIyLS4wMTItNi4zNDV6Ii8%2BPC9nPjwvc3ZnPg==

[coverage-url]: https://coveralls.io/r/zlargon/voc
[coverage-img]: https://img.shields.io/coveralls/zlargon/voc.svg
