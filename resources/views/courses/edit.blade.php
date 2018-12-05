@extends ('layouts.master')

@section('title', 'Edit ' . $course->name)
@section('description', 'Edit the details of ' . $course->name)

@section ('content')

<div class="auth-pg">
  <div class="form-container">
    <update-course
      :route="{{ json_encode(route('courses.update', $course->slug)) }}"
      :current="{{ json_encode($course) }}"
      :current-tags="{{ json_encode($currentTags) }}"
      :tags="{{ json_encode($tags) }}" 
      :old="{{ json_encode(Session::getOldInput()) }}" 
      :errors="{{json_encode($errors->all())}}">
    </update-course>
  </div>
</div>

@endsection