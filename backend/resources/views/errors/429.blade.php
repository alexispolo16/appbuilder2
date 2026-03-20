@extends('errors.layout')

@section('code', '429')
@section('title', 'Demasiadas solicitudes')

@section('icon')
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
</svg>
@endsection

@section('message')
Has realizado demasiadas solicitudes en poco tiempo. Por favor espera un momento antes de intentar de nuevo.
@endsection

@section('actions')
<a href="javascript:location.reload()" class="btn btn-primary">Reintentar</a>
<a href="/" class="btn btn-secondary">Ir al inicio</a>
@endsection
