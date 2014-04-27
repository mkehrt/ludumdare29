.PHONY: all clean deploy deploy-clean

all:
	-mkdir dist
	tsc --outDir dist --noImplicitAny `find src -name *.ts`
	rsync -a --exclude "*~" --exclude ".*.sw?" --exclude "*.ts" src/ dist/

clean:
	-rm -rf dist
	find . -name *~ | xargs rm -f

deploy: all
	ssh  mkehrt_roseandsigil@ssh.phx.nearlyfreespeech.net "mkdir /home/public/ludumdare29/; true"
	scp -r dist/* mkehrt_roseandsigil@ssh.phx.nearlyfreespeech.net:/home/public/ludumdare29/

