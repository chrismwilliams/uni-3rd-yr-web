<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Course;

class BookmarkController extends Controller
{
  /*
    |--------------------------------------------------------------------------
    | Bookmark Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling user saving and deleting courses
    |
   */

  public function __construct()
  {
    $this->middleware('auth')->only(['remove']);
  }

  public function store()
  {
    // get the current user
    $user = request()->user();

    // check if course exists and that they haven't already bookmarked it
    $this->validate(request(), [
      'course_id' => 'required|exists:course,id|unique:bookmark,course_id,NULL,id,user_id,' . $user->id
    ]);

    // add the bookmark
    $user->bookmarks()->create([
      'course_id' => request('course_id')
    ]);

    // return the users bookmarks
    return $user->getAllBookmarks();
  }

  public function delete()
  {
    // get the current user
    $user = request()->user();

    // custom function to ensure bookmark exists
    $this->validateAndDelete(request(), $user);

    // return users bookmarks
    return $user->getAllBookmarks();
  }

  public function remove()
  {
    // get the current user
    $user = auth()->user();

    // custom function to ensure bookmark exists
    $this->validateAndDelete(request(), $user);

    // return users profile page
    return view('user.index');;
  }

  private function validateAndDelete($request, $user)
  {
    // ensure bookmark exists
    $this->validate($request, [
      'course_id' => 'required|exists:bookmark,course_id,user_id,' . $user->id
    ]);

    // delete bookmark from db
    $user->bookmarks()->where('course_id', '=', $request->course_id)->where('user_id', '=', $user->id)->delete();
  }
}
