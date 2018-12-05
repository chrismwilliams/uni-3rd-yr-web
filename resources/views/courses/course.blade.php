@extends ('layouts.master')

@section('title', $course->name . ' Page')
@section('description', 'All the important details on ' . $course->name)

@section ('content')

<div class="course-pg">
  <div class="hero">
  <img src="{{asset('storage/courses/' . $course->img_src)}}" alt="Picture of {{ $course->name }}">
    <div class="course_title">
      <h1>{{ $course->name }}</h1>
      <p>{{ $course->address }}</p>
    </div>
  </div>
  <div class="content">
    <div class="page_heading">
      <h2>Details</h2>
      @can('update', $course)
        <a class="link is-link" href="{{ route('courses.edit', $course->slug) }}"><i class="fas fa-pencil-alt"></i>Edit</a>
      @endcan
      @auth
        <div class="user_save">
          <p>Bookmark</p>
          <bookmark-component 
            :courseid="{{ $course->id }}" 
            :saved="{{ json_encode($saved) }}">
          </bookmark-component>
        </div>
      @endauth
    </div>
    <div class="course_heading">
      <div class="course_location">
        <div class="course_contact">
          <div>
            <h3>Location</h3>
            <p>{{ $course->address }}</p>
          </div>
          <div>
            <h3>Tel</h3>
            <p>{{ $course->tel_no }}</p>
          </div>
          <div>
            <h3>Website</h3>
          <p><a target="_blank" rel="nofollow noopener noreferrer" href="{{ $course->website }}">{{ str_limit(str_replace('http://','',$course->website), 35, '...')}}</a></p>
          </div>  
        </div>
        <div class="course_extra">
          <div class="tag_container">
            <h3>Tags</h3>
            <div class="tags">
              @foreach ($course->tags as $tag)
                <span class="tag is-light is-success">{{ $tag->tag_name }}</span>
              @endforeach
            </div>
          </div>
          <div class="pricing">
            <h3>Prices</h3>
            <div class="columns">
              <p class="column">Weekday: <span>&pound;{{ $course->weekday_cost }}</span></p>
              <p class="column">Weekend: <span>&pound;{{ $course->weekend_cost }}</span></p>
            </div>
          </div>
          @if(!empty($weather))
            <div class="weather">
              <h3>Weather</h3>
              <div class="columns">
                <div class="column"><i aria-hidden="true" class="has-text-primary wi wi-owm-{{ $weather['current']['id'] }}"></i>  {{ $weather['current']['main']}}</div>
                <div class="column"><i aria-hidden="true" class=" has-text-primary wi wi-thermometer"></i>  {{ $weather['temp'] }}<i class="wi wi-celsius"></i></div>
                <div class="column"><i aria-hidden="true" class="has-text-primary wi wi-strong-wind"></i>  {{ $weather['wind'] }}<span class="is-size-7">MPH</span></div>
              </div>
            </div>
          @endif
        </div>
        <div class="course_map">
          <div class="map_container">
            <figure class="image is-16by9">
              <img src="https://maps.googleapis.com/maps/api/staticmap?center={{$course->lat}},{{$course->lng}}&zoom=14&size=380x250&key={{config('services.google_api')}}&markers={{$course->lat}},{{$course->lng}}&scale=3" alt="Google Street Map of {{$course->name}}">
            </figure>
          </div>
        </div>
      </div>
      <div class="course_content">
        <div class="details">
          <h3>Description</h3>
          <p>{{ $course->description }}</p>
        </div>
      </div>
    </div>
    <div class="course_review_input">
      @auth
        @if(!empty($user_comment))
          <h3><em>Thank you for your comment!</em></h3>
        @else
          <add-comment :courseid="{{ $course->id }}" :errors="{{json_encode($errors->all())}}"></add-comment>
        @endif
      @else
        <h4>If you like this course, please <a class="user_link" href="{{ route('login') }}"><strong>{{ __('Login') }}</strong></a> or <a class="user_link"  href="{{ route('register') }}"><strong>{{ __('Register') }}</strong></a> to leave a review!</h4>
      @endauth
    </div>
    <reviews-component :comms="{{json_encode($comms)}}"></reviews-component>
  </div>
</div>

@endsection