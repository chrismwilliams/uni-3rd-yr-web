<?php

namespace App\Providers;

use App\Course;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;
use GuzzleHttp\Exception\ConnectException;

class ComposerServiceProvider extends ServiceProvider
{
  /**
   * Register bindings in the container.
   *
   * @return void
   */
  public function boot()
  {
    // course page to find all comments of current course
    View::composer('courses.course', function ($view) {
      $course = $view->getData()['course'];
      $comms = $course->allComments();

      $user_comment = [];
      $saved = false;
      // check if user has added any comments
      if (auth()->user()) {
        $user_comment = auth()->user()->comments()->where('course_id', '=', $course->id)->pluck('id')->toArray();
        $saved = in_array($course->id, auth()->user()->getAllBookmarks());
      }

      // Create a curl client to openweathermap api with course lat/lng
      try {
        $client = new Client(['base_uri' => 'http://api.openweathermap.org/data/2.5/']);
        $res = $client->request('GET', "weather?lat=$course->lat&lon=$course->lng&units=metric&APPID=" . config('app.weather_api'));
        $res = json_decode($res->getBody(), true);

        $weather['current'] = $res['weather'][0];
        $weather['temp'] = $res['main']['temp'];
        $weather['wind'] = $res['wind']['speed'];

      } catch (ConnectException $e) {
        $weather = [];
      } catch (\Exception $e) {
        $weather = [];
      }

      $view->with(compact('comms', 'user_comment', 'weather', 'saved'));
    });

    // edit course page to add all the current pivot tags with the course
    View::composer('courses.edit', function ($view) {
      $course = $view->getData()['course'];
      $currentTags = $course->tags()->pluck('id')->toArray();

      $view->with(compact('currentTags'));
    });

    // user profile page to get all the courses saved by the user
    View::composer('user.index', function ($view) {
      if (auth()->user()->bookmarks()->count() > 0) {
        $courses = Course::find(auth()->user()->getAllBookmarks());

        $view->with(compact('courses'));
      }
    });
  }

  /**
   * Register the service provider.
   *
   * @return void
   */
  public function register()
  {
        //
  }
}