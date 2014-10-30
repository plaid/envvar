ISTANBUL = node_modules/.bin/istanbul
JSHINT = node_modules/.bin/jshint
XYZ = node_modules/.bin/xyz --repo git@github.com:plaid/envvar.git


.PHONY: lint
lint:
	$(JSHINT) -- index.js test/index.js


.PHONY: release-major release-minor release-patch
release-major release-minor release-patch:
	@$(XYZ) --increment $(@:release-%=%)


.PHONY: setup
setup:
	npm install


.PHONY: test
test:
	$(ISTANBUL) cover node_modules/.bin/_mocha
	$(ISTANBUL) check-coverage --branches 100
