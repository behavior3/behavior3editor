# Building Behavior3 Editor

You can build the editor in two different environments: for development and for production. For development you can run a local web server that will build and reload automatically the application for each new modification on the project. The production mode builds and package the editor for different platforms.


## Requirements

To run the editor you will need the following softwares:

**required for everything:**
- [NodeJS](https://nodejs.org)
- [Bower](http://bower.io)

*if you want to run/build the desktop version:*
- [Node-Webkit](http://nwjs.io)
- [Node-Webkit Builder](https://github.com/nwjs/nw-builder)


## Configuration

Before building, you need to install some 3rd-party libraries. You need to run in console the following commands:

    npm install

and:

    bower install

The former installs a bunch of NodeJS modules, which are used on the building system and some dependences of the desktop application. The last installs CSS and Javascript vendor libraries.


## Building during development

During development you can run the editor in a web browser with automatically building and reloading:

    gulp serve

which will run a web server hosted on `http://127.0.0.1:8000`.

To run the desktop version (without automatically building and reload):

    gulp nw


## Building final version

Just run:

    gulp dist



