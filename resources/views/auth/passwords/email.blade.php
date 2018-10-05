@extends('layouts.master')

@section('title', 'Reset Password')

@section('content')

<div class="auth-pg">
  <div class="form-container">
    <form class="form" method="POST" action="{{ route('password.email') }}">
      @csrf
      <h1>Password Reset</h1>
      <div class="field">
        <label class="label" for="email">{{ __('E-Mail') }}</label>
        <div class="control has-icons-left">
          <input class="input{{ $errors->has('email') ? ' is-danger' : '' }}"  id="email" name="email" type="email" placeholder="Your Email Address" value="{{ old('email') }}" required>
          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>
        @if ($errors->has('email'))
          <p class="help is-danger">{{ $errors->first('email') }}</p>
        @endif
      </div>
      
      <div class="field">
        <div class="control">
          <button class="button is-primary" type="submit">{{ __('Send Password Reset Link') }}</button>
        </div>
      </div>
    </form>
  </div>
</div>
@endsection
