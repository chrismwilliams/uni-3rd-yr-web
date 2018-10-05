<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
  /**
   * Transform the resource into an array.
   *
   * @param  \Illuminate\Http\Request  $request
   * @return array
   */
  public function toArray($request)
  {
    return [
      'name' => $this->name,
      'address' => $this->address,
      'slug' => $this->slug,
      'lat' => $this->lat,
      'lng' => $this->lng,
      'thumbnail' => $this->thumbnail,
    ];
  }
}
