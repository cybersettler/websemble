# websemble
> Desktop application MVC framework

it offers the following features:

* Based on web technology. Built on top of [Electron](http://electron.atom.io/)
* File system storage service with a REST API
* Web component support
* i18n support with [i18next](http://i18next.com)
* View template support with _Handlebars_

## Installation

```bash
cd myproject
npm install websemble
```

## Getting started

First let's create a view to display, the Index view.

```bash
mkdir -p frontend/component/view/Index
```

In the index folder create a Controller.js file and a View.html file.
The content should be:

```javascript
function IndexController( view, scope ){
 this.super( view, scope );
}

module.exports = IndexController;
```

```html
<template class="main">
 <h1>Hello World!</h1>
</template>

<script>
   (function(window, document, undefined) {
     require( "websemble" ).frontend.createComponent( 'view-index' );
   })(window, document);
</script>
```

Next we will create the App component.

```bash
mkdir -p frontend/component/core/App
```

As with the view component, we have to create a Controller and a
View file for the App.

```javascript
function AppController( view, scope ){
  this.super( view, scope );
}

module.exports = AppController;
```

```html
<template class="main">
  <view-index></view-index>
</template>

<script>
    (function(window, document, undefined) {
      require( "websemble" ).frontend.createComponent( 'core-app' );
    })(window, document);
</script>
```

Next create the app.js file in the root with the following content:

```javascript
var Websemble = require('websemble');
var app = new Websemble.backend.App();
```

Make sure that the value for the main attribute in the package.json
configuration file is "app.js".

The last file we need to create is the index.html in the root.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>websemble</title>
    <link rel="import" href="frontend/component/core/App/View.html" />
    <link rel="import" href="frontend/component/view/Index/View.html" />
    <style>
      core-app {
        display:block;
      }
    </style>
  </head>
  <body>
    <core-app></core-app>
  </body>
</html>
```

You will need electron to run your application:

```bash
npm install electron-prebuilt
```

To run your application, just type:

```bash
./node_modules/.bin/electron .
```

## Dig deeper

We have developed a very handy tool to generate boiler plate code for
your websemble application. Checkout the Yeoman [websemble generator]
(https://github.com/cybersettler/generator-websemble).

For information about the motivation and architecture behind websemble,
have a look at the [project's wiki]
(https://github.com/cybersettler/websemble/wiki).

To learn about making desktop applications with html5, head to the [Electron website](http://electron.atom.io/). This is the framework on top of which
websemble is built.
