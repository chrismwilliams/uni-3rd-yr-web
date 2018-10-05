<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use App\Http\Resources\CommentsResource;
use Cviebrock\EloquentSluggable\Sluggable;

class Course extends Model
{
  /*
    |--------------------------------------------------------------------------
    | Course model
    |--------------------------------------------------------------------------
    |
    | This represents the model for a golf course
    |
   */
  use Sluggable;

  // name of the table
  protected $table = 'course';

  protected $guarded = [];

  protected $hidden = [
    'user_id'
  ];

  public function comments()
  {
    return $this->hasMany(Comment::class);
  }

  public function user()
  {
    return $this->belongsTo(User::class);
  }

  public function tags()
  {
    return $this->belongsToMany(Tag::class);
  }

  public function bookmarks()
  {
    return $this->hasMany(Bookmark::class);
  }

  public function sluggable()
  {
    // use the name to create a slug
    return [
      'slug' => [
        'source' => 'name'
      ]
    ];
  }

  public function averageScore()
  {
    // return the course model's average user rating
    return $this->comments()->avg('rating');
  }

  public function scopeNearTo($query, $lat, $lng)
  {
    // find local all courses based on the lattitude and longitude 
    // based on the query shown by google maps: https://developers.google.com/maps/solutions/store-locator/clothing-store-locator
    $haversine = "(3959 * acos(cos(radians(?)) 
                     * cos(radians(course.lat)) 
                     * cos(radians(course.lng) 
                     - radians(?)) 
                     + sin(radians(?)) 
                     * sin(radians(course.lat))))";
    return $query
      ->select('name', 'lat', 'lng', 'slug', 'thumbnail', 'address')
      ->selectRaw("{$haversine} AS distance", [$lat, $lng, $lat])
      ->whereRaw("{$haversine} < 30.00", [$lat, $lng, $lat]);
  }

  public function scopeAllComments()
  {
    // return an api call for all a course's comments
    CommentsResource::withoutWrapping();
    return CommentsResource::collection($this->comments);
  }
}
