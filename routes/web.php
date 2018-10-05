<?php



Route::get('/', function () {
  return view('layouts.pages.home');
})->name('index');

Auth::routes();

Route::get('courses/create', 'CourseController@create')->name('create.course');
Route::get('courses', 'CourseController@index')->name('courses');
Route::get('courses/{slug}', 'CourseController@show')->name('course');
Route::get('courses/{slug}/edit', 'CourseController@edit')->name('edit.course');

Route::post('courses', 'CourseController@store')->name('store.course');
Route::post('courses/{slug}/update', 'CourseController@update')->name('update.course');

Route::get('top', 'CourseController@top')->name('top');


Route::get('map', function () {
  return view('layouts.pages.map');
})->name('map');

Route::get('profile', 'UserController@show')->name('user.profile');
Route::post('profile', 'UserController@update')->name('user.update');

Route::post('bookmark/remove', 'BookmarkController@remove')->name('bookmark.remove');