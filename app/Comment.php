<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
  /*
  |--------------------------------------------------------------------------
  | Comment model
  |--------------------------------------------------------------------------
  |
  | This represents a message left by a user for any course
  |
   */
  // name of the table
  protected $table = 'comment';

  protected $guarded = [];

  protected $hidden = [
    'user_id'
  ];

  public function course()
  {
    return $this->belongsTo(Course::class);
  }

  public function user()
  {
    return $this->belongsTo(User::class);
  }
}
