# The Miso Project Website

This is the builder for the public miso project website. 
It uses Staticmatic alongside some custom api generating code.

Submit any issues/requests for the miso project website as issues here.

## Development Only:

### Setup

```
bundle install
```

### Deploying

`rake deploy MSG='commit name on production'`
Message is optional

To hide index.html
`rake deploy HIDE=yes`

### Previewing

From project root, run:

```
staticmatic preview .
```

Never edit .html files.

### Building static site

From project root, run:

```
staticmatic build .
```

### Adding runnable code snipptes:

* Make your snippet under the `src/snippets` directory (or subdirectory as your heart desires.)
* Include a call to it like so somewhere:

```javascript
= toRunnableCodeBlock("creation/importingLocalStrictDataArray")
```

### Adding non runnable code snippets:

```javascript
= toDisplayCodeBlock("creation/importingLocalStrictDataArray")
```

### Updating Dataset Builds Before Deploying

Getting files over from dataset

`rake copyfiles DIR=../Dataset`

### Notes

* Some stylesheets live in site/stylesheets and don't have a sass equivalent. For all application level styles, **only edit screen.sass** which is under src/stylesheets.
* Main site layout is under src/layouts.
* Pages can be broken into partials which are stored under src/partials. See example in dataset.haml.
* Updating `js` dependencies needs to be done under the `site/js` folder, as does the updating of any images or other non-code assets.


