THIS IS WORK IN PROGRESS
========================

marked-man(3)
=============

SYNOPSIS
--------

```
var marked = require('marked-man');
```
See [marked README](https://github.com/chjj/marked) for documentation
about how to use marked.


DESCRIPTION
-----------

`marked-man` wraps `marked` to extend it with groff output support.
Using it will make output defaults to groff.


OPTIONS
-------

`marked-man` adds a single option to `marked` existing options:

* format
  Sets the output format. Values are `roff`, `html`.
  Defaults to `roff`.

