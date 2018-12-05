<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <meta name="description" content="@yield('description', 'Find your next favourite course with coursefinder')">
  <title>coursefinder - @yield('title')</title>
  <link rel="apple-touch-icon" sizes="180x180" href="{{{ asset('images/apple-touch-icon.png') }}}">
  <link rel="icon" type="image/png" sizes="32x32" href="{{{ asset('images/favicon-32x32.png') }}}">
  <link rel="icon" type="image/png" sizes="16x16" href="{{{ asset('images/favicon-16x16.png') }}}">
  <link rel="shortcut icon" href="{{{ asset('images/favicon.ico') }}}">
  <link href="https://fonts.googleapis.com/css?family=Cantata+One|Raleway:500" rel="stylesheet">
  <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.9/css/all.css" integrity="sha384-5SOiIsAziJl6AWe0HWRKTXlfcSHKmYV4RBF18PPJ173Kzn7jzMyFuTtk8JA7QQG1" crossorigin="anonymous">
  <link rel="stylesheet" type="text/css" href="{{ mix('css/app.css') }}">
  
  <!-- CSRF Token -->
  <meta name="csrf-token" content="{{ csrf_token() }}">
</head>