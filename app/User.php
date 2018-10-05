<?php

namespace App;

use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
  /*
  |--------------------------------------------------------------------------
  | User model
  |--------------------------------------------------------------------------
  |
  | This represents the user model
  |
   */
  use HasApiTokens, Notifiable;

  protected $table = 'user';

  /**
   * The attributes that are mass assignable.
   *
   * @var array
   */
  protected $fillable = [
    'username', 'email', 'password',
  ];

  /**
   * The attributes that should be hidden from arrays.
   *
   * @var array
   */
  protected $hidden = [
    'password', 'remember_token', 'id'
  ];

  public function courses()
  {
    return $this->hasMany(Course::class);
  }

  public function comments()
  {
    return $this->hasMany(Comment::class);
  }

  public function bookmarks()
  {
    return $this->hasMany(Bookmark::class);
  }

  public function getGravatarAttribute()
  {
    // generate user's gravitar based on the hash of their email address
    $hash = md5(strtolower(trim($this->addtributes['email'])));
    return "http://www.gravatar.com/avatar/$hash?s=40d=identicon";
  }

  public function getAllBookmarks()
  {
    // return all the user's bookmarks
    return $this->bookmarks()->pluck('course_id')->toArray();
  }
}
