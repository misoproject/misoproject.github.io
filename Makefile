UPSTREAM ?= upstream

default: clean view

.PHONY: build
build: site site/d3-chart/api site/dataset/api site/storyboard/api

site:
	bundle exec staticmatic build .
	cp -R src/* site

view: build
	bundle exec staticmatic preview .

node_modules: package.json
	npm install
	@touch package.json node_modules

site/%/api : projects/% node_modules
	$(eval commit=$(word 1, $(shell git submodule status $<)))
	$(eval name=$(subst -,.,$(notdir $<)))
	$(eval srcUrl=https://github.com/misoproject/$(name))
	$(eval srcFileUrl=$(srcUrl)/blob/$(commit)/src/{{ fileName }})
	$(eval srcLineUrl=$(srcFileUrl)\#L{{ lineNumber }})
	$(eval exDir=$</examples/api)
	mkdir -p $@
	./node_modules/.bin/jsdoc $</src \
		--destination $@ \
		--template ./node_modules/miso-jsdoc-template/src \
		--configure ./jsdoc-config.json \
		--query "layout=$@.html&externalExBase=$(exDir)&sourceUrl=$(srcUrl)&sourceFileUrl=$(srcFileUrl)&sourceLineUrl=$(srcLineUrl)" \

.PHONY: clean
clean:
	rm -rf site

.PHONY: check_working_dir
.SILENT: check_working_dir
check_working_dir:
	if [ -n "`git status --porcelain`" ]; then\
		echo "Untracked changes in working directory. Stash or commit them before deploying.";\
		exit 1;\
	fi

.PHONY: deploy
deploy: check_working_dir clean build
	git checkout -B gh-pages
	# Keep untracked files and .gitignore
	git ls-files -z * | xargs -0 git rm
	mv site/* .
	# Prevent GitHub from attempting to build the site with Jekyll
	touch .nojekyll
	git add .
	git commit -m "Deploy site"
	git push --force ${UPSTREAM} gh-pages
	git checkout -
