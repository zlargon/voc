## 1.8.1 (July 28, 2016)

- handle error case without audio in Webster and Yahoo ([#6](https://github.com/zlargon/voc/issues/6))
- it doesn't play sentence audio when the same audio has been downloaded ([#7](https://github.com/zlargon/voc/issues/7))

## 1.8.0 (July 28, 2016)

- support [The Free Dictionary](http://www.thefreedictionary.com/) with option `-f, --freedic`.
- download and play audio one by one.
- update package dependencies and add new package [`co`](https://github.com/tj/co).
- fully migrate to ES2015, and remove Stage-0 syntax `async/await`.

### Yahoo

- search and check the words before download the audio

## 1.7.1 (June 10, 2016)

### Webster
- fix the issue resloving incorrect URL link ([#5](https://github.com/zlargon/voc/issues/5))

## 1.7.0 (June 2, 2016)

- remove option `-c, --collins-education`
- change option from `-C, --collins` to `-c, --collins`

### Webster
- search and check the words before download the audio
- fix issue generating incorrect url in particular case

### Collins
- Collins and Collins-Education server API have been changed and have been merged into one
- remove option `-c, --collins-education`
- change option from `-C, --collins` to `-c, --collins`
