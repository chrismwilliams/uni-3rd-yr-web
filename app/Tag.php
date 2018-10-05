<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Tag extends Model
{
    /*
    |--------------------------------------------------------------------------
    | Tag model
    |--------------------------------------------------------------------------
    |
    | This represents a tag that is attached to a course
    |
     */
    // name of the table
    protected $table = 'tag';

    public function tags()
    {
        return $this->belongsToMany(Course::class);
    }
}
