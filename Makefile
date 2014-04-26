all:
	-mkdir dist
	tsc --outDir dist --noImplicitAny `find src -name *.ts`
	rsync -a --exclude "*~" --exclude ".*.sw?" --exclude "*.ts" src/ dist/

clean:
	-rm -rf dist
	find . -name *~ | xargs rm -f
