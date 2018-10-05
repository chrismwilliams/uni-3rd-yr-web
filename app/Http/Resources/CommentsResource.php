<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class CommentsResource extends JsonResource
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
      'id' => $this->id,
      'username' => $this->user->username,
      'gravatar' => $this->user->gravatar,
      'comment' => $this->comment,
      'rating' => $this->rating,
      'date' => date($this->updated_at),
      'updated_at' => $this->updated_at->diffForHumans(),
      'canEdit' => $this->when(auth()->user() && auth()->user()->id == $this->user_id, true)
    ];
  }
}
