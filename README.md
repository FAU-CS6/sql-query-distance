# SQL Query Distance

A prototype implementation of the query-comparison approach presented in [the accompanying paper](https://github.com/FAU-CS6/sql-query-distance/blob/master/paper.pdf).


## Preparation

In order to build an run the project, Node.js and its package manager NPM are required.
Both can be found [the Node.js website](https://nodejs.org/).


## Setup

After cloning the repository, the npm dependencies have to be installed.

This can be done by navigating the terminal to the repository's root directory and executing: `npm install`
In case of problems because of out-of-date dependencies, try running `npm update` first.

It may take up to a few minutes.


## Scripts

There are several npm scripts provided for building and running the project.

- `npm run build-web`:
Compiles the project into a browser-compatible JavaScript file `html/js/index.js`.
After this, `html/index.html` can be opened with a browser to use the project in standalone mode.
Or, `html/js/index.js` can be copied into or referenced by a web-app intending to use it.

- `npm run build-node`:
Compiles the project into JavaScript files for Node.js into the created `dist/` folder.
After this, the project can be imported and used in other Node.js projects.

- `npm test` or `npm run test`:
Compiles the project like `npm run build-node` and then tests certain example calculations.
If you are interested in examples for how to use this project, have a look into `test.js`.

- `npm start` or `npm run start`:
Starts a small HTTP server and opens a browser with the project in standalone mode.
It has an auto-reload feature, automatically reloading the site when project files are altered, which is especially useful during development.
Firefox is recommended over Chrome for this, because it automatically keeps the content of text fields across reloads.
Note that this also applies to the edit cost configuration, so in order to reset it, the respective text field must first be cleared, followed by a reload.
Also note that the server compiles the project internally, but does not generate the file `html/js/index.js`, like `npm run build-web` does.

- `npm run doc`:
Generates a [TypeDoc](https://typedoc.org/) documentation of the project inside the `docs/` folder.


## Survey

As part of the paper, a survey was also conducted for evaluation purposes. Detailed information about the survey can be found in the `survey` folder.