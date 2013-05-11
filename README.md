marked-man(1) -- markdown to roff
=================================

TODO
----

* Test suite

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


OPTIONS
-------

`marked-man` adds a some options to `marked` existing options:

* format  
  Sets the output format. Outputs html if different from `roff`.
  Defaults to `roff`.

* version
  The version shown in the manpage header.
  Defaults to empty string.

* manual
  The MANUAL string shown in the manpage header.
  Defaults to empty string.
