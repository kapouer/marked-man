marked-man(1) -- markdown to roff
=================================

TODO
----

* Test suite
* Insert version, author, date, manualname from options object and
  from command-line options.
* advertise marked-man on ronnjs README and description.


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

`marked-man` adds a single option to `marked` existing options:

* format  
  Sets the output format. Values are `roff`, `html`.  
  Defaults to `roff`.

