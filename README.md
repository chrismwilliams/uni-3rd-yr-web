# coursefinder ⛳️👀

## Advanced Web Applications 3rd Yr Project

coursefinder is an online web application prototype built using Laravel.

### How to Build

In order to bundle and test the web app, you must first install [node](https://nodejs.org/en/), and [composer](https://getcomposer.org/)

Once installed, navigate to the root dir and from the command line;

```
composer.phar install
```

```
npm install
```

Once all dependencies are installed, rename the .env.example to .env and ensure variables are correct, particularly DB\_\* & GOOGLE_API

To run with hot reload run in the terminal

```
npm run hot
```

From here, you can edit the code within the `/resources` directory and the bundle will automatically re-build/reload as you make changes.
