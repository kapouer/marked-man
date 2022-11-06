marked-man(1) -- markdown to roff
=================================

SYNOPSIS
--------

```bash
marked-man README.md > doc/marked-man.1
```

See also [marked documentation](https://marked.js.org/).

DESCRIPTION
-----------

`marked-man` wraps `marked` to extend it with groff output support in order to
create Unix manual pages for use with `man`.

OPTIONS
-------

`marked-man` is a `marked` CLI extension, meaning options can be passed directly to marked.

The `--breaks` option, which retains intra-paragraph line breaks, is now true by default. Use `--no-breaks` to disable it.

`marked-man` adds some options to `marked`'s existing options:

* `--name <name>`
The name shown in the manpage header, if it isn't given in the ronn header like in this README.
Defaults to empty string.

* `--section <section>`
The section number shown in the manpage header, if it isn't given in the ronn header like in this README.
Defaults to empty string.

* `--version <version>`
The version shown in the manpage footer.
Defaults to empty string.
This flag is converted to manVersion option, to avoid conflict with marked.

* `--manual <manual>`
The manual-group name shown in the manpage header.
Defaults to empty string.

* `--date <date>`
The date shown in the manpage header.
Defaults to now, must be acceptable to `new Date(string or timestamp)`.
If `process.env.SOURCE_DATE_EPOCH` exists, it uses that time instead.

INSTALLATION
------------

See your node package manager manual...

For example:

```bash
npx marked-man simple.md
```

EXAMPLE
-------

To view this README as a man page, run something like the following:

```bash
marked-man --man-version v0.1.0 --manual 'Man Utilities' README.md | man /dev/stdin
```

AS MARKED EXTENSION
-------------------

```js
import markedMan from 'marked-man';
import marked from 'marked';

marked.use(markedMan);
```

THANKS TO
---------

[Rronn](https://github.com/rtomayko/ronn)
[Ronn-NG](https://github.com/apjanke/ronn-ng)
[groff](https://man.cx/groff_man(7))

REPORTING BUGS
--------------

See [marked-man repository](https://github.com/kapouer/marked-man).
