<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTagsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tag', function (Blueprint $table) {
            $table->increments('id');
            $table->string('tag_name')->unique();
            $table->timestamps();
        });

        Schema::create('course_tag', function (Blueprint $table) {
            $table->integer('course_id');
            $table->integer('tag_id');
            $table->primary(['course_id', 'tag_id']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tag');
        Schema::dropIfExists('course_tag');
    }
}
