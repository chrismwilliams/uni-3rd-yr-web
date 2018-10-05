<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Comment;
use App\Course;

class CommentsController extends Controller
{
  /*
    |--------------------------------------------------------------------------
    | Comments Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling comments added/removed
    | to a course
    |
   */

  public function __construct()
  {
    // auth:api set in api.php
  }

  public function store(Course $course)
  {

    // validate values
    $this->validate(request(), [
      'comment' => 'required|string|min:7|max:500',
      'rating' => 'required|integer|between:1,5'
    ]);

    // create a new comment
    $course->comments()->create([
      'user_id' => request()->user()->id,
      'comment' => request('comment'),
      'rating' => request('rating')
    ]);

    // return all course comments
    return $course->allComments();
  }

  public function update()
  {
    // validate request
    $this->validate(request(), [
      'comment_id' => 'required|exists:comment,id',
      'comment' => 'required|string|min:7|max:500',
      'rating' => 'required|integer|between:1,5'
    ]);

    // Get the comment
    $comment = Comment::findOrFail(request('comment_id'));

    // make sure they are the owner
    if (request()->user()->can('update', $comment)) {
      // update and save msg
      $comment->comment = request('comment');
      $comment->rating = request('rating');
      $comment->save();
      // return all course comments
      return Course::find($comment->course_id)->allComments();

    } else {
      // return 401
      return response()->json(['error' => 'unauthorised'], 401);
    }
  }

  public function delete()
  {
    // validate request
    $this->validate(request(), [
      'comment_id' => 'required|exists:comment,id'
    ]);

    // Get the comment
    $comment = Comment::findOrFail(request('comment_id'));

    // make sure user is the owner of comment
    if (request()->user()->can('delete', $comment)) {
      // delete msg
      $comment->delete();
      return response()->json('success');

    } else {
      // return 401
      return response()->json(['error' => 'unauthorised'], 401);
    }
  }
}
