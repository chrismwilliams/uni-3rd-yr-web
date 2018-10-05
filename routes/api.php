<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
 */

Route::post('courses/find', 'CourseController@findLocal');

Route::post('courses/search', 'CourseController@search');


Route::middleware('auth:api')->group(function () {
  Route::post('courses/bookmark', 'BookmarkController@store')->name('bookmark.store');
  Route::post('courses/bookmark/delete', 'BookmarkController@delete')->name('bookmark.delete');
  Route::post('courses/{course}/comments', 'CommentsController@store')->name('comment.store');
  Route::post('courses/comments/delete', 'CommentsController@delete')->name('comment.delete');
  Route::post('courses/comments/update', 'CommentsController@update')->name('comment.delete');
});
