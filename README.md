# The Miso Project Website

This is the builder for the public miso project website. 
It uses Staticmatic alongside some custom api generating code.

Submit any issues/requests for [the Miso project
website](http://misoproject.com/) as issues here.

## Development Only

If you'd like to work on this project, you'll need the following tools
installed on your system: [GNU Make](https://www.gnu.org/software/make/),
[Ruby](https://www.ruby-lang.org) (with [Bundler](http://bundler.io/)), and
[Node.js](http://nodejs.org/).

### Setup

After cloning the repository, run the following commands from the project root:

    git submodule init
    git submodule update
    bundle install
    npm install

### Building

From project root, run:

    make

### Previewing

From project root, run:

    staticmatic preview .

Never edit .html files.

### Deploying

    make deploy

This will create a branch named `gh-pages`, build the static site, and push the
branch to the git remote named `upstream`. If you would like to deploy to
another remote repository (for instance, `origin` during testing), you may set
the `UPSTREAM` environmental variable:

    UPSTREAM=origin make deploy

### Notes

* Some stylesheets live in site/stylesheets and don't have a sass equivalent. For all application level styles, **only edit screen.sass** which is under src/stylesheets.
* Main site layout is under src/layouts.
* Pages can be broken into partials which are stored under src/partials. See example in dataset.haml.
* Updating `js` dependencies needs to be done under the `site/js` folder, as does the updating of any images or other non-code assets.
