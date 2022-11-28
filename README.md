marked-man(1) -- markdown to roff
=================================

SYNOPSIS
--------

```bash
marked-man README.md > doc/foo.1
# works too with stdin
cat README.md | marked-man --version 1.0 | man /dev/stdin
```

See also [marked documentation](https://marked.js.org/).

DESCRIPTION
-----------

`marked-man` wraps `marked` to extend it with groff output support in order to
create Unix manual pages for use with `man`.

It follows the `ronn` markdown level-1 header format:
    # name(section) -- short description

which populates the *HEADER* section, and the *NAME* section (if none is already written) of the manpage.

OPTIONS
-------

`marked-man` is a `marked` CLI extension, meaning options can be passed directly to marked.

The `--breaks` option, which retains intra-paragraph line breaks, is now true by default. Use `--no-breaks` to disable it.

`marked-man` adds some options to `marked`'s existing options, to be able to override the header/footer of generated man pages.

* `--name <name>`
Optional, overrides `name` in ronn header.

* `--section <section>`
Optional, overrides `section` in ronn header. Defaults to 1.

* `--description <description>`
Optional, overrides `description` in ronn header.

* `--version <version>`
The version shown in the manpage footer.
Optional, when omitted, defaults to the target node module version, or empty.

* `--manual <manual>`
The manual-group name shown in the manpage header.
Optional, when omitted, man displays a value matching the section.

* `--date <date>`
The date shown in the manpage header.
Optional, defaults to now.
Must be acceptable to `new Date(string or timestamp)`.
Honors `SOURCE_DATE_EPOCH` environment variable for reproducible builds.

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
marked-man README.md | man /dev/stdin
```

AS MARKED EXTENSION
-------------------

```js
import markedMan from 'marked-man';
import marked from 'marked';

marked.use(markedMan);
```

SEE ALSO
--------

[Ronn](https://github.com/rtomayko/ronn)
[Ronn-NG](https://github.com/apjanke/ronn-ng)
[groff](https://man.cx/groff_man(7))

REPORTING BUGS
--------------

See [marked-man repository](https://github.com/kapouer/marked-man).
