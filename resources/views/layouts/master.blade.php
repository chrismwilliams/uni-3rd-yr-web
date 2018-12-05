<!DOCTYPE html>
<html lang="en">
@include('partials.header')
<body>
  <div id="app" class="grid">
    @include ('partials.nav')
    @include ('partials.flash')
    <div class="page-content">
      @yield('content')
    </div>
    @include ('partials.footer')
  </div>
  <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key={{config('services.google_api')}}&libraries=places"></script>
  
  <script src="{{ mix('js/manifest.js') }}"></script>
  <script src="{{ mix('js/vendor.js') }}"></script>
  <script src="{{ mix('js/app.js') }}"></script>
</body>
</html>