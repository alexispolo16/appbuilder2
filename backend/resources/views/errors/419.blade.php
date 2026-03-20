@extends('errors.layout')

@section('code', '419')
@section('title', 'Sesion expirada')

@section('icon')
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
</svg>
@endsection

@section('message')
Tu sesion ha expirado. Por favor recarga la pagina e intenta de nuevo.
@endsection

@section('actions')
<a href="javascript:location.reload()" class="btn btn-primary">Recargar pagina</a>
<a href="/" class="btn btn-secondary">Ir al inicio</a>
@endsection
