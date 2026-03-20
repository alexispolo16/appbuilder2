@extends('errors.layout')

@section('code', '404')
@section('title', 'Pagina no encontrada')

@section('icon')
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
</svg>
@endsection

@section('message')
La pagina que buscas no existe o fue movida. Verifica la URL e intenta de nuevo.
@endsection
