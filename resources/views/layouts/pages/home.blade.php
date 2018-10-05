@extends ('layouts.master')

@section('title', 'Home Page')

@section ('content')

<div class="home-pg">
  <div class="hero">
  <img src="{{ asset('storage/hero.jpg')}}" alt="Masters Image">
    <div class="hero_msg">
      <h1 class="has-text-weight-bold">WELCOME TO</h1>     
      <h1>coursefinder</h1>
      <hr class="bar">
      <p><i class="fas fa-map-marker-alt fa-2x" aria-hidden="true"></i>&nbsp; find your next favourite course</p>
    </div>
  </div>
  <div class="content">
    <h2 class="page_heading">Features</h2>
    <ul>
      <li class="feature columns">
        <div class="icon">
          <i class="fas fa-map-marker-alt fa-5x" aria-hidden="true"></i>
        </div>
        <div class="feature_desc">
          <h3>Location based searching</h3>
          <p>Find all the courses in your local area, or even an area your visting via our map search</p>
        </div>
      </li>
      <li class="feature columns">
        <div class="icon">
          <i class="fas fa-tag fa-5x" aria-hidden="true"></i>
        </div>
        <div class="feature_desc">
          <h3>Catergories / Tags</h3>
          <p>Quickly view catergories that each course includes, tags such as societies and  practice areas</p>
        </div>
      </li>
      <li class="feature columns">
        <div class="icon">
          <i class="fas fa-comment fa-5x" aria-hidden="true"></i>
        </div>
        <div class="feature_desc">
          <h3>Read players comments</h3>
          <p>Listen and read real players experiences and ratings of the courses your interested in</p>
        </div>
      </li>
      <li class="feature columns">
        <div class="icon">
          <i class="fas fa-search fa-5x" aria-hidden="true"></i>
        </div>
        <div class="feature_desc">
          <h3>Find your next favourite course</h3>
          <p>Search our database for any course you can think of, or maybe enter one we're missing</p>
        </div>
      </li>
    </ul>
  </div>
</div>

@endsection