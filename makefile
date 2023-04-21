SRC_PNG = $(wildcard components/*/img/*.png)
SRC_FAVICON = favicon.png
SRC_OTF = $(wildcard fonts/*.otf)
SRC_TTF_1 = $(wildcard fonts/*.ttf)
SRC_TTF_2 = $(wildcard components/*/fonts/*.ttf)
SRC_HTML = $(wildcard components/*/template.html)
SRC_TS_1 = main.ts colors.ts set-favicon.ts
SRC_TS_2 = $(wildcard fonts/*.ts)
SRC_TS_3 = $(wildcard utils/*.ts)
SRC_TS_4 = $(wildcard components/*/*.ts)

STATIC = $(SRC_PNG:.png=.js) $(SRC_OTF:.otf=.js) $(SRC_TTF_1:.ttf=.js) $(SRC_TTF_2:.ttf=.js) $(SRC_HTML:.html=.js) $(SRC_FAVICON:.png=.js)
DIST = $(SRC_PNG:%.png=dist/%.js) $(SRC_OTF:%.otf=dist/%.js) $(SRC_TTF_1:%.ttf=dist/%.js) $(SRC_TTF_2:%.ttf=dist/%.js) $(SRC_HTML:%.html=dist/%.js) $(SRC_TS_1:%.ts=dist/%.js) $(SRC_TS_2:%.ts=dist/%.js) $(SRC_TS_3:%.ts=dist/%.js) $(SRC_TS_4:%.ts=dist/%.js) $(SRC_FAVICON:%.png=dist/%.js)

all: $(DIST)

static: $(STATIC) 

dist/%.js: %.png
	./node_modules/esbuild/bin/esbuild --sourcemap --loader:.png=dataurl --format=esm $^ --outfile=$@

dist/%.js: %.ttf
	./node_modules/esbuild/bin/esbuild --sourcemap --loader:.ttf=dataurl --format=esm $^ --outfile=$@

dist/%.js: %.otf
	./node_modules/esbuild/bin/esbuild --sourcemap --loader:.otf=dataurl --format=esm $^ --outfile=$@

dist/%.js: %.html
	./node_modules/esbuild/bin/esbuild --sourcemap --loader:.html=text --format=esm $^ --outfile=$@

%.js: %.png
	./node_modules/esbuild/bin/esbuild --sourcemap --loader:.png=dataurl --format=esm $^ --outfile=$@

%.js: %.ttf
	./node_modules/esbuild/bin/esbuild --sourcemap --loader:.ttf=dataurl --format=esm $^ --outfile=$@

%.js: %.otf
	./node_modules/esbuild/bin/esbuild --sourcemap --loader:.otf=dataurl --format=esm $^ --outfile=$@

%.js: %.html
	./node_modules/esbuild/bin/esbuild --sourcemap --loader:.html=text --format=esm $^ --outfile=$@

dist/%.js: %.ts
	./node_modules/esbuild/bin/esbuild --sourcemap --format=esm $^ --outfile=$@
