@extends ('layouts.master')

@section('title', 'Add A New Course')
@section('description', 'Add your favourite course to our database')

@section ('content')

<div class="auth-pg">
  <div class="form-container">
  <add-course 
    :route="{{ json_encode(route('courses.store')) }}" 
    :tags="{{ json_encode($tags) }}" 
    :old="{{ json_encode(Session::getOldInput()) }}" 
    :errors="{{json_encode($errors->all())}}">
  </add-course>
  </div>
</div>

@endsection