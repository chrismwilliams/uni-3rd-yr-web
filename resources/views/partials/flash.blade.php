@if ($flash = session('message'))
  <article class="flash message is-primary">
    <div class="message-header">
      <p>Success</p>
    </div>
    <div class="message-body">
      {{$flash}}
    </div>
  </article>
@endif

@if ($status = session('status'))  
<article class="flash message is-info">
  <div class="message-header">
    <p>Success</p>
  </div>
  <div class="message-body">
    {{$status}}
  </div>
</article>
@endif

<modal-component></modal-component>