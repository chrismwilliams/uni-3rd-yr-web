let mix = require("laravel-mix");
require("laravel-mix-purgecss");

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Uses Mix to handle our asset bundling. Extracts all our dependancies and 
 | vendor library (Vue). Depending upon if we're in development, Mix via 
 | purgeCss will essentually clean out any redundant CSS rules, version it 
 | for cache busting, and uglify it.
 |
 */

mix.js("resources/assets/js/app.js", "public/js").extract(["vue"]);
mix.sass("resources/assets/sass/app.scss", "public/css");

if (mix.inProduction()) {
  mix.purgeCss({
    enabled: true,
    extensions: ["html", "js", "php", "vue"],
    whitelistPatterns: [/wi-/, /nav_/, /fade/, /transition_/]
  }),
    mix.options({
      uglify: {}
    }),
    mix.version();
}

mix.browserSync({
  proxy: "coursefinder.test",
  files: ["./resources", "./app", "./config", "./routes"]
});
