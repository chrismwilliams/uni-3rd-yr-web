@extends ('layouts.master')

@section('title', 'Profile Page')

@section ('content')

<div class="profile-pg">
  <h1 class="page_heading">Welcome {{ auth()->user()->username }}</h1>
  <div class="dashboard columns is-mutiline">
    <div class="column">
      <div class="box notification has-text-centered">
        <div class="heading">Member Since</div>
        <div class="title">{{ auth()->user()->created_at->diffForHumans() }}</div>
      </div>
    </div>
    <div class="column">
      <div class="box notification is-success has-text-centered">
        <div class="heading">Number Of Courses Created</div>
        <div class="title">{{ auth()->user()->courses()->count() }}</div>
      </div>
    </div>
    <div class="column">
      <div class="box notification is-info has-text-centered">
        <div class="heading">Total Number of Comments</div>
        <div class="title">{{ auth()->user()->comments()->count() }}</div>
      </div>
    </div>
  </div>
  @if(!empty($courses))
    <div class="bookmarks">
      <h2>Bookmarks</h2>
      <div class="courses columns">
        @foreach ($courses as $course)
          <div href="{{ route('course', $course->slug) }}" class="column">
            <div class="card">
              <div class="card-image">
                <figure class="image is-16by9">
                  <img src="{{asset('storage/courses/' . $course->thumbnail)}}" alt="Picture of {{ $course->name }}">
                </figure>
              </div>
              <div class="card-content">
                <p class="title is-4">{{ $course->name }}</p>
                <p class="subtitle is-7">{{ $course->address }}</p>
              </div>
              <footer class="card-footer">
                <a aria-label="Visit {{$course->name}} Page" href="{{ route('course', $course->slug) }}" class="card-footer-item">Visit</a>
                <form method="POST" action="{{ route('bookmark.remove') }}" class="card-footer-item">
                  @csrf
                  <input type="hidden" name="course_id" value="{{ $course->id }}">
                  <button class="button" type="submit">Remove</button>
                </form>
              </footer>
            </div>
          </div>
        @endforeach
      </div>
    </div>
  @endif
  <div class="form-container">
    <h2>Account</h2>
    <form class="form" method="POST" action="{{route('user.update')}}" >
      @csrf
      <h3>Reset Your Password</h3>

      <div class="field">
        <label class="label" for="current-password">{{ __('Current Password') }}</label>
        <div class="control has-icons-left">
          <input class="input{{ $errors->has('current-password') ? ' is-danger' : '' }}"  id="current-password" name="current-password" type="password" placeholder="Current Password" required>
          <span class="icon is-small is-left">
            <i class="fas fa-lock"></i>
          </span>
        </div>
        @if ($errors->has('current-password'))
          <p class="help is-danger">{{ $errors->first('current-password') }}</p>
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
          <input class="input" id="password-confirm" name="password_confirmation" type="password" placeholder="Confirm Password" required>
          <span class="icon is-small is-left">
            <i class="fas fa-lock"></i>
          </span>
        </div>
      </div>

      <div class="field">
        <div class="control">
          <button class="button is-primary" type="submit">{{ __('Update') }}</button>
        </div>
      </div>
    </form>
  </div>
</div>

@endsection