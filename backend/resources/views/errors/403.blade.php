@extends('errors.layout')

@section('code', '403')
@section('title', 'Acceso denegado')

@section('icon')
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
</svg>
@endsection

@section('message')
No tienes permisos para acceder a esta pagina. Si crees que esto es un error, contacta al administrador.
@endsection
