<template>
  <transition name="fade">
    <article v-if="$root.showModal" class="modal_msg message" :class="$root.status">
      <div class="message-header">
        <p>{{$root.header}}</p>
      </div>
      <div class="message-body">
        {{$root.message}}
      </div>
    </article>
  </transition>
</template>

<script>
export default {
  name: "Modal",
  data() {
    return {};
  }
};
</script>

