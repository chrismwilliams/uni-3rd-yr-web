@component('mail::message')
# Welcome {{ $user->name }}, to coursefinder

Thank you for signing up to our website and we hope you enjoy your stay!

Thanks,<br>
{{ config('app.name') }}
@endcomponent
