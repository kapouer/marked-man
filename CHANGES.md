# CHANGES

## 0.1.4

* depends on marked 0.3.2
* use .nf/.fi instead of .EX/.EE to format blockquotes

## 0.1.6

* ensure tests pass

## 0.2.0

* add support for gfm table

## 0.2.1

* remove useless test files from npm package

## 0.3.0

* accept a timestamp in milliseconds as --date argument

## 1.0.0

* node >= 12
* --format option is dropped, use directly marked for html output
* other options should work the same
* mostly rewritten
* depends marked >= 4.2
* more groff macros are implemented

## 1.1.0

* --breaks is now the default

## 1.2.0

* the level-2 NAME section is not generated if it already exists
* --section, if missing from ronn header, is set to 1 by default
* --manual, if missing, is now omitted to let man display a default value
* --description can set the description if not set from ronn header format
* --version, if missing, is read from package.json of target file module, or omitted.

## 1.3.0

* fix crash when md has only one token
* better support for stdin, e.g. `cat file.md | marked-man | man /dev/stdin`
* fix blockquote, use a table
