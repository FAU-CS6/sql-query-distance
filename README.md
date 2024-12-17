# SQL Query Distance

A prototype implementation of the query-comparison approach presented in "Graph-based QSS: A Graph-based Approach to Quantifying Semantic Similarity for Automated Linear SQL Grading" (will be published at the 21st Conference on Database Systems for Business, Technology and Web (BTW25)).

## Web Interface

The prototype is written in Javascript and is made available via GitHub Pages. 

The latest web version of the prototype can be found [here](https://fau-cs6.github.io/sql-query-distance/). 

Please note that with this type of deployment, the code runs entirely in your browser and, depending on the device you are using, execution may therefore be faster or slower.

## Manual Installation 

The prototype can be built and used manually. To do this, the following steps must be followed:

### 1. Preparation

In order to build the project, Node.js and its package manager NPM are required.
Both can be found at [the Node.js website](https://nodejs.org/).

### 2. Installation of the Requirements

After cloning the repository, the npm dependencies have to be installed.

This can be done by navigating the terminal to the repository's root directory and executing: `npm install`
In case of problems because of out-of-date dependencies, try running `npm update` first.

It may take up to a few minutes.

### 3. Usage

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


## Reproducability 

As part of the publication of our approach at BTW25, we are also taking part in the conference's reproducibility track. 

Unfortunately, we can only offer certain aspects in our reproducibility efforts:

What we **cannot** offer:
 
1) An automated method to repeat our survey, as a survey is dependent on human participants.
2) An automated method to reproduce the manual corrections used in the survey, as they were created by humans with experience in grading exams.
3) An automated method to reproduce the results of the dynamic analysis tool used in the survey, as it is currently heavily dependent on a GUI and therefore cannot be directly accessed via an API.
 
What we **can** offer:
 
1) All questions and unaggregated results of our survey. Since the survey was conducted in German, we also provide an English translation: [Link to the survey](survey/README.md)
2) All manual corrections we had created, as they were used in the survey: [Link to the manual corrections](survey/img/)
3) The source code of the dynamic analysis tool, along with an explanation of how it can be deployed and used via a Docker container: [Link to the dynamic analysis tool](https://github.com/FAU-CS6/assSQLQuestion#Installation)

4) **(Our focus)** A container that contains our graph-based QSS tool and with which our tool can be run again on the 11 pairs of student answers and sample solutions from the survey. With this we want to show that our prototype can really generate the results that were ultimately evaluated in the study: See next subsection.

### The Graph-based QSS Container

### 1. Preparation

To be able to use the container, you must have a containerization tool such as [Docker](https://www.docker.com/) or [Podman](https://podman.io/) installed. The container was mainly tested on Docker, but a test using Podman was also successful.

### 2. Creation of the Container

The container can be built using the following command (execute in the main folder of the repository):

```
docker build -t sql-query-distance .
```

(Replace `docker` with `podman` if you prefer to use Podman)

### 3. Run the Testcases

As part of our study, we ran our graph-based QSS tool on pairs of student answers and sample solutions for 11 scenarios. 

With the following command, you can run the tool again on the scenarios used in the study and thus reproduce the results we evaluated with our survey:

```
docker run sql-query-distance
```