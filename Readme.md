#ES6 Connect Four

![Board Picture] (boardpic.png)

##Live at: <https://williamjohnsonjr-connectfour.surge.sh/>

A Connect Four game built using JavaScript ES6 modules. See installation instructions below.

Original approach was to try to create a web app game using Ruby and/or Ruby on Rails, but both of these approaches would eventually require use of CoffeeScript, JS, and/or jQuery to handle events and manipulate the DOM. As a result, I opted to use regular JavaScript, ES6 modules, and jQuery.


# Installation

#### Prerequisites

Make sure you have an up to date installation of `npm`
with `brew update` followed by either `brew install npm` or `brew upgrade npm`.

Then use npm to install the following apps with `npm install -g $APP_NAME`
* `gulp-cli`
* `surge`

Finally, I would strongly encourage you to install the `newapp` script from [here][newapp].

[newapp]: https://gist.github.com/kingcons/a25733c233faf10847cbb4ff557e6843

# Usage

#### If you are using the `newapp` tool

*NOTE:* If you do not use a lowercased project/folder name, the automatic deploy to surge with `npm run deploy` will fail as surge.sh always expects lowercased names.

1. Run `$ newapp template <project name>`
2. Change in to your new project
3. Initialize Git `$ git init`
4. Build

#### If you are NOT using the `newapp` tool

1. Clone down this repo
2. Rename and change into the project folder
3. Remove `git` from it `$ rm -rf .git`
4. Initialize Git `$ git init`
5. Install the dependencies `$ npm install`
6. Build 


# Features

This template features a couple different tools. First it utalizes both NPM and Gulp for different tasks.

## Gulp Tasks

All tasks are listed below, but ideally you will just need to run `gulp start` and be done with it.

- `gulp start`: This is the primary task that will fire up the server and allow you to start building
- `gulp server`: This will start a Browsersync server with live-reload
- `gulp build`: This will compile your ES6 to ES5 and SCSS to CSS

## NPM Scripts

- `npm run test`: This will launch Mocha in your terminal and run any tests
- `npm run deploy`: This will deploy your application to Surge.sh for you
- `npm run lint`: This will run ESLint on your `/src/js` folder
