@extends('layouts.master')

@section('title', 'Reset Password')

@section('content')

<div class="auth-pg">
  <div class="form-container">
    <form class="form" method="POST" action="{{ route('password.request') }}">
      @csrf
      <input type="hidden" name="token" value="{{ $token }}">
      <h1>Password Reset</h1>
      <div class="field">
        <label class="label" for="email">{{ __('E-Mail Address') }}</label>
        <div class="control has-icons-left">
          <input class="input{{ $errors->has('email') ? ' is-danger' : '' }}"  id="email" name="email" type="email" placeholder="Your Email Address" value="{{ $email or old('email') }}" required>
          <span class="icon is-small is-left">
            <i class="fas fa-envelope"></i>
          </span>
        </div>
        @if ($errors->has('email'))
          <p class="help is-danger">{{ $errors->first('email') }}</p>
        @endif
      </div>
      
      <div class="field">
        <label class="label" for="password">{{ __('New Password') }}</label>
        <div class="control has-icons-left">
          <input class="input{{ $errors->has('password') ? ' is-danger' : '' }}"  id="password" name="password" type="password" placeholder="Password" required>
          <span class="icon is-small is-left">
            <i class="fas fa-lock"></i>
          </span>
        </div>
        @if ($errors->has('password'))
          <p class="help is-danger">{{ $errors->first('password') }}</p>
        @endif
      </div>
      
      <div class="field">
        <label class="label" for="password-confirm">{{ __('Confirm New Password') }}</label>
        <div class="control has-icons-left">
          <input class="input{{ $errors->has('password_confirmation') ? ' is-danger' : '' }}"  id="password-confirm" name="password_confirmation" type="password" placeholder="Confirm Password" required>
          <span class="icon is-small is-left">
            <i class="fas fa-lock"></i>
          </span>
        </div>
        @if ($errors->has('password_confirmation'))
          <p class="help is-danger">{{ $errors->first('password_confirmation') }}</p>
        @endif
      </div>

      <div class="field">
        <div class="control">
          <button class="button is-primary" type="submit">{{ __('Reset Password') }}</button>
        </div>
      </div>
    </form>
  </div>
</div>
@endsection
