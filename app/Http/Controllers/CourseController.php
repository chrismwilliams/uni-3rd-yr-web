<?php

namespace App\Http\Controllers;

use Image;
use App\Tag;
use App\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\File;
use App\Http\Requests\StoreCourseReq;
use App\Http\Requests\UpdateCourseReq;
use App\Http\Resources\CourseResource;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\CommentsResource;
use App\Http\Resources\FindCourseResource;
use Cviebrock\EloquentSluggable\Services\SlugService;

class CourseController extends Controller
{
  /*
    |--------------------------------------------------------------------------
    | Course Controller
    |--------------------------------------------------------------------------
    |
    | This controller is responsible for maintaining the course model
    |
   */

  public function __construct()
  {
    $this->middleware('auth')->only(['create', 'store', 'edit', 'update']);
  }

  public function index()
  {
    // set empty bookmark array
    $bookmarks = [];

    // check if user logged in
    if (auth()->check()) {
      // see if they currently have any bookmarks
      $bookmarks = auth()->user()->getAllBookmarks();
    }

    // return the first 12 paginated courses
    $courses = Course::paginate(12);
    return view('courses.index', compact('courses', 'bookmarks'));
  }

  public function show($slug)
  {
    // find and return single course
    $course = Course::with('tags')->where('slug', $slug)->firstOrFail();

    return view('courses.course', compact('course'));
  }

  public function create()
  {
    // get all tags in db
    $tags = Tag::all();
    // return course creation page
    return view('courses.create', compact('tags'));
  }

  public function store(StoreCourseReq $request)
  {   
    // create a new unique slug
    $slug = SlugService::createSlug(Course::class, 'slug', $request->name);
      
    // move the image with path from slug
    $path = $this->makeImages($slug, $request->image);

    // store course in db
    $course = Course::create([
      'user_id' => auth()->user()->id,
      'name' => $request->name,
      'address' => $request->address,
      'lat' => $request->lat,
      'lng' => $request->lng,
      'tel_no' => $request->tel_no,
      'description' => $request->description,
      'slug' => $slug,
      'img_src' => $slug . '/' . $path[0],
      'thumbnail' => $slug . '/' . $path[1],
      'website' => $request->website,
      'weekday_cost' => $request->weekday_cost,
      'weekend_cost' => $request->weekend_cost
    ]);
    // add the pivot tags
    $course->tags()->attach($request->tags);
    // return newly created course
    return redirect()->route('course', [$slug])->with('message', $course->name . ' has been added!');
  }

  public function edit($slug)
  {
    // find the course
    $course = Course::where('slug', $slug)->firstOrFail();
    // make sure user can update (owner)
    if (auth()->user()->can('update', $course)) {
      // get all tags from db and return edit page
      $tags = Tag::all();
      return view('courses.edit', compact('course', 'tags'));
    // not authorised
    } else {
      return redirect()->route('index');
    }
  }

  public function update(UpdateCourseReq $request)
  {
    // find the course
    $course = Course::where('slug', $request->route('slug'))->firstOrFail();

    // check if name changed
    if ($request->name !== $course->name) {
      // create new slug
      $slug = SlugService::createSlug(Course::class, 'slug', $request->name);

      // rename folder
      Storage::disk('public')->move($course->slug, $slug);

      // update name, img_src, thumbnail & slug
      $course->name = $request->name;
      $course->img_src = str_replace($course->slug, $slug, $course->img_src);
      $course->thumbnail = str_replace($course->slug, $slug, $course->thumbnail);
      $course->slug = $slug;
    }
    
    // if a new image inc
    if ($request->hasFile('image')) {

      // delete old image
      Storage::disk('public')->delete($course->img_src);
      Storage::disk('public')->delete($course->thumbnail);

      // create new images and save their paths
      $path = $this->makeImages($course->slug, $request->image);
      $course->img_src = $course->slug . '/' . $path[0];
      $course->thumbnail = $course->slug . '/' . $path[1];
    }

    // udpate all fields
    $course->address = $request->address;
    $course->description = $request->description;
    $course->lat = $request->lat;
    $course->lng = $request->lng;
    $course->tel_no = $request->tel_no;
    $course->website = $request->website;
    $course->weekday_cost = $request->weekday_cost;
    $course->weekend_cost = $request->weekend_cost;

    // update pivot tags
    $course->tags()->detach();
    $course->tags()->attach($request->tags);
    
    // save updates
    $course->save();
    
    // redirect with updates
    return redirect()->route('course', [$course->slug])->with('message', $course->name . ' has been updated!');
  }

  public function findLocal()
  {
    // validate request
    $this->validate(request(), [
      'lat' => 'required',
      'lng' => 'required'
    ]);
    // return laravel api resource of courses near to lat lng, without outer wrapping
    CourseResource::withoutWrapping();
    return CourseResource::collection(Course::nearTo(request('lat'), request('lng'))->get());
  }

  public function search()
  {
    // validate request
    $this->validate(request(), [
      'search' => 'required|string'
    ]);
    // find and return courses similar to users search input
    $query = "%" . request('search') . "%";
    FindCourseResource::withoutWrapping();
    return FindCourseResource::collection(Course::where('name', 'LIKE', $query)->limit(12)->get());
  }

  public function top()
  {
    // select the paginated top 15 courses based on the ratings for each course in the db
    $courses = Course::selectRaw('course.*, (select round(avg(rating),1) from comment where `course_id` = course.id) as average')
      ->orderBy('average', 'desc')
      ->withCount('comments')
      ->paginate(15);

    return view('layouts.pages.top', compact('courses'));
  }

  private function makeImages($slug, $imgRequest)
  {
    // save the path to course images
    $path = 'app/public/courses/' . $slug;
    // create the folder if required
    if (!File::isDirectory(storage_path($path))) {
      File::makeDirectory(storage_path($path));
    }
    // create new unique hash for larger image and also save thumbnail
    $hash = md5(Carbon::now()->toDateString());
    $hashFileName = $hash . '.' . $imgRequest->getClientOriginalExtension();
    $thumbnail = 'thumbnail.' . $imgRequest->getClientOriginalExtension();

    // resize both images and move them to the folder
    $img1 = Image::make($imgRequest)
      ->resize(1024, 768, function ($constraint) {
        $constraint->aspectRatio();
      })->save(storage_path($path . '/' . $hashFileName))->destroy();
    // thumbnail too
    $img2 = Image::make($imgRequest)
      ->resize(320, 240)
      ->save(storage_path($path . '/' . $thumbnail))->destroy();
    // return paths to both images
    return [$hashFileName, $thumbnail];
  }
}
