@extends ('layouts.master')

@section('title', 'Courses Page')

@section ('content')

<div class="courses-pg">
  <div class="page_heading">
    <h1>Courses</h1>
    @auth
      <a class="link is-link" href="{{ route('create.course') }}" class="course"><i class="fas fa-plus-square"></i>Add New</a>
    @endauth
  </div>

  <ul class="courses">
    @foreach ($courses as $course)
      <li>
        <a href="{{ route('course', $course->slug) }}" class="course">
          <div class="course_head">
            <figure class="image">
              <img src="{{asset('storage/courses/' . $course->img_src)}}" alt="Image of {{$course->name}}">
              <figcaption class="course_title">
              <h2>{{ $course->name }}</h2>
              </figcaption>
              @auth
                <bookmark-component 
                  :courseid="{{ $course->id }}" 
                  :saved="{{ json_encode(in_array($course->id, $bookmarks) ? true : false) }}">
                </bookmark-component>
              @endauth
            </figure>
          </div>
          <div class="course_details">
            <p>{{ str_limit($course->description, 400, '...') }}</p>
          </div>
          <div class="course_footer">
            <div class="location">
              <i class="fas fa-map-pin fa-lg" aria-hidden="true"></i>
              <p>{{ str_limit($course->address, 70, '...') }}</p>
            </div>
            @if ($course->averageScore() > 0)
              <div class="rating">
                <div class="score_title">reviews</div>
                <p class="score">{{ number_format($course->averageScore(), 1) }}</p>
              </div>
            @endif
          </div>
        </a>
      </li>
    @endforeach
  </ul>
  {{ $courses->links() }}
</div>

@endsection
