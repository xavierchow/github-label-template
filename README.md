Github Label Template
------------------------
[![Build Status](https://travis-ci.org/xavierchow/github-label-template.svg?branch=master)](https://travis-ci.org/xavierchow/github-label-template)
[![npm](http://img.shields.io/npm/v/github-label-template.svg?maxAge=2592000)](https://www.npmjs.org/package/github-label-template)

## Intro

Will you be satisfied and stuck with the default labels in the github repository?
The answer may probably be NO, you always need to add some labels, customize the colors, etc.
Finally you will come to an awesome label template(or you might find someone from others),
when you create a new repository, you might want to use the template you favor, but still manually?

No... This command line tool tries to help you manuplate your github label template effectively.

## Prerequisite
Node.js 4.4 or later.

## Install
`npm install github-label-template`

## Usage
```

  Usage: ghlbl [options]

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -o, --owner [owner]      repo owner
    -r, --repo [repo]        repo name
    -t, --token [token]      github token
    -e, --export [filename]  export the lables to json file [filename]
    -d, --del                delete all existed labels
    -i, --import [filename]  import the labels from json file [filename]


```


## License
MIT
