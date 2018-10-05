@extends('layouts.master')

@section('title', 'Login')

@section('content')

<div class="auth-pg">
  <div class="form-container">
    <login-component :old="{{ json_encode(Session::getOldInput()) }}" :errors="{{json_encode($errors->all())}}"></login-component>
  </div>
</div>
@endsection
