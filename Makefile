man/marked-man.1: README.md
	./bin/marked-man -o $@ $<

doc: man/%.1
