# The Miso Project Website

There's no reason why this repo should ever be public, but here's how you set it up.

You need the following gems:

* chunky_png (1.2.0)
* compass (0.11.5)
* fssm (0.2.7)
* haml (3.1.2)
* rack (1.3.2)
* rake (0.8.7)
* sass (3.1.6)
* staticmatic (0.11.1)
##Setup
`git submodule init`
`git submodule update`

## Deploying
`rake deploy MSG='commit name on production'`
Message is optional

To hide index.html
`rake deploy HIDE=yes`

## Previewing

From project root, run:

```
staticmatic preview .
```

Never edit .html files.

## Building static site

From project root, run:

```
staticmatic build .
```

## Adding runnable code snipptes:

* Make your snippet under the `src/snippets` directory (or subdirectory as your heart desires.)
* Include a call to it like so somewhere:

```javascript
= toRunnableCodeBlock("creation/importingLocalStrictDataArray")
```

## Adding non runnable code snippets:

```javascript
= toDisplayCodeBlock("creation/importingLocalStrictDataArray")
```

## Deployment

Getting files over from dataset

`rake copyfiles DIR=../Dataset`

Deploying to github pages:

`rake deploy HIDE=true MSG="new layout and lots of excitement"`

## Notes

* Some stylesheets live in site/stylesheets and don't have a sass equivalent. For all application level styles, **only edit screen.sass** which is under src/stylesheets.
* Main site layout is under src/layouts.
* Pages can be broken into partials which are stored under src/partials. See example in dataset.haml.

That's all folks.


