<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
  /*
    |--------------------------------------------------------------------------
    | User Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for handling the user model
    |
   */

  public function __construct()
  {
    // ensure a user is logged in
    $this->middleware('auth');
  }

  public function show()
  {
    // show user profile page
    return view('user.index');
  }

  public function update()
  {
    // make sure user's old password is the same
    if (!Hash::check(request('current-password'), auth()->user()->password)) {
      // current password not the same
      return redirect()->back()->withErrors(['current-password' => "Current password does not match our records"]);
    }

    // validate request
    $this->validate(request(), [
      'current-password' => 'required',
      'password' => 'required|string|min:6|confirmed'
    ]);

    // update password
    $user = auth()->user();
    $user->password = bcrypt(request('password'));
    $user->save();
    // return user profile page
    return redirect()->back()->with('message', 'Your Password Has Been Updated');
  }
}
