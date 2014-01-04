man/marked-man.1: README.md
	./bin/marked-man --gfm --breaks -o $@ $<

doc: man/marked-man.1
