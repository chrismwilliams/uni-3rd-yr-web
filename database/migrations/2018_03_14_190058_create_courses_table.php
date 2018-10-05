<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCoursesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('course', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('user_id');
            $table->string('name');
            $table->string('address');
            $table->decimal('lat', 10, 8);
            $table->decimal('lng', 10, 8);
            $table->string('tel_no');
            $table->text('description');
            $table->string('slug');
            $table->string('img_src');
            $table->string('thumbnail');
            $table->string('website');
            $table->decimal('weekday_cost', 10, 2);
            $table->decimal('weekend_cost', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('course');
    }
}
