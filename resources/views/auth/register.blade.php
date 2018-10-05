@extends('layouts.master')

@section('title', 'Register')

@section('content')

<div class="auth-pg">
  <div class="form-container">
  <register-component :old="{{ json_encode(Session::getOldInput()) }}" :errors="{{json_encode($errors->all())}}"></register-component>
  </div>
</div>
@endsection
