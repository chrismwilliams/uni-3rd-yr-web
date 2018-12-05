<?php

namespace App\Http\Requests;

use App\Course;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateCourseReq extends FormRequest
{
    private $course;

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        $this->course = Course::where('slug', $this->route('course'))->firstOrFail();

        return $this->course && $this->user()->can('update', $this->course);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            //
            'name' => [
                'required',
                'string',
                'min:5',
                'max:255',
                Rule::unique('course')->ignore($this->course->name, 'name')->where(function ($query) {
                    return $query->where('address', request('address'));
                })
            ],
            'address' => 'required|string|min:7|max:255',
            'image' => 'sometimes|required|image|mimes:jpeg,jpg,png|max:1024',
            'lat' => 'required|string|min:7|max:255',
            'lng' => 'required|string|min:7|max:255',
            'tel_no' => 'required|string|min:5|max:255',
            'tags' => 'array|required',
            'tags.*' => 'exists:tag,id',
            'description' => 'required|min:50|max:7000',
            'website' => 'required|string|min:5|max:255',
            'weekday_cost' => 'required|string|min:2|max:7',
            'weekend_cost' => 'required|string|min:2|max:7'
        ];
    }

    public function messages()
    {
        return [
            'name.unique' => 'This course has already been created'
        ];
    }

    public function getCourse()
    {
        return $this->course;
    }
}
