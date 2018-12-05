<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PageController extends Controller
{
    // index page
  public function index()
  {
    return view('layouts.pages.home');
  }

    // map page
  public function map()
  {
    return view('layouts.pages.map');
  }
}
