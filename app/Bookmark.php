<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Bookmark extends Model
{
  /*
    |--------------------------------------------------------------------------
    | Bookmark model
    |--------------------------------------------------------------------------
    |
    | This represents a saved course made by a user
    |
   */
  // name of the table
  protected $table = 'bookmark';
  // don't use timestamps
  public $timestamps = false;

  protected $guarded = [];

  protected $hidden = [
    'user_id'
  ];

  public function users()
  {
    return $this->belongsToMany(User::class);
  }

  public function courses()
  {
    return $this->belongsToMany(Course::class);
  }
}
