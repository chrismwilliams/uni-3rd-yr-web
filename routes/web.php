<?php

Auth::routes();

Route::get('/', 'PageController@index')->name('index');
Route::get('map', 'PageController@map')->name('map');
Route::get('top', 'CourseController@top')->name('top');

Route::resource('courses', 'CourseController')->except(['destroy']);
Route::delete('bookmark/remove', 'BookmarkController@remove')->name('bookmark.remove');

Route::get('profile', 'UserController@index')->name('user.index');
Route::patch('profile', 'UserController@update')->name('user.update');
