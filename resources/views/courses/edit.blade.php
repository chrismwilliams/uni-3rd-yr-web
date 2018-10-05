@extends ('layouts.master')

@section('title', 'Edit ' . $course->name)

@section ('content')

<div class="auth-pg">
  <div class="form-container">
    <update-course
      :current="{{ json_encode($course) }}"
      :current-tags="{{ json_encode($currentTags) }}"
      :tags="{{ json_encode($tags) }}" 
      :old="{{ json_encode(Session::getOldInput()) }}" 
      :errors="{{json_encode($errors->all())}}">
    </update-course>
  </div>
</div>

@endsection