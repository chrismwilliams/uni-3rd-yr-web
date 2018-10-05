@extends ('layouts.master')

@section('title', 'Create Course Page')

@section ('content')

<div class="auth-pg">
  <div class="form-container">
  <add-course 
    :tags="{{ json_encode($tags) }}" 
    :old="{{ json_encode(Session::getOldInput()) }}" 
    :errors="{{json_encode($errors->all())}}">
  </add-course>
  </div>
</div>

@endsection