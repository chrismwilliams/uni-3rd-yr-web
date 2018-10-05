@extends ('layouts.master')

@section('title', 'Top Courses')

@section ('content')

<div class="top-pg">
  <h1 class="page_heading">Top Courses</h1>
  <section class="table-section" aria-label="Table of the top rated courses">
    <table class="table is-striped is-fullwidth">
      <thead role="rowgroup">
        <tr role="row">
          <th role="columnheader">Image</th>
          <th role="columnheader">Name</th>
          <th role="columnheader" class="address">Address</th>
          <th role="columnheader" class="comment_no"><abbr title="Number of Comments">No. Comments</abbr></th>
          <th role="columnheader"><abbr title="Average Rating">Avg. Rating</abbr></th>
        </tr>
      </thead>
      <tbody role="rowgroup">
        @foreach ($courses as $course)
          <tr role="row">
            <th role="columnheader">
              <figure class="image is-128x128">
                <img src="{{asset('storage/courses/' . $course->thumbnail)}}" alt="Image of {{$course->name}}">
              </figure>
            </th>
            <td role="columnheader"><a href="{{ route('course', $course->slug) }}" title="{{ $course->name}}">{{ $course->name }}</a></td>
            <td role="columnheader" class="address">{{ $course->address }}</td>
            @if ($course->average > 0)
              <td role="columnheader" class="comment_no">{{ $course->comments_count }}</td>
              <td role="columnheader">{{ $course->average}}/5</td>
            @else
              <td role="columnheader" class="comment_no">0</td>
              <td role="columnheader" >NA</td>
            @endif
          </tr>
        @endforeach
      </tbody>
    </table>

    {{ $courses->links() }}
  </section>
</div>

@endsection