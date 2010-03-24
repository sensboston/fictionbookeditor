all: tFBE

clean:
	-del /q genres.txt
	devenv FBE.sln /clean Release

genres.txt: root_genres.xml gtrans.xsl
	msxsl root_genres.xml gtrans.xsl -o genres.txt

tFBE: genres.txt
	devenv FBE.sln /build Release
