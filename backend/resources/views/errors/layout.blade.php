<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title') - BuilderApp</title>
    <style>
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f0f2f5;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            -webkit-font-smoothing: antialiased;
            padding: 24px;
        }

        .error-card {
            max-width: 480px;
            width: 100%;
            background: #fff;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 4px 24px rgba(0,0,0,0.08);
            text-align: center;
        }

        .error-header {
            background: linear-gradient(135deg, #0972d3 0%, #033160 100%);
            padding: 36px 36px 32px;
        }

        .error-code {
            font-size: 72px;
            font-weight: 800;
            color: rgba(255,255,255,0.15);
            line-height: 1;
            margin-bottom: 8px;
            letter-spacing: -2px;
        }

        .error-icon {
            width: 56px;
            height: 56px;
            border-radius: 50%;
            background: rgba(255,255,255,0.12);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 14px;
        }

        .error-icon svg {
            width: 28px;
            height: 28px;
            color: #fff;
        }

        .error-header h1 {
            font-size: 20px;
            font-weight: 700;
            color: #fff;
            margin: 0;
            line-height: 1.3;
        }

        .error-body {
            padding: 32px 36px;
        }

        .error-body p {
            font-size: 15px;
            color: #687078;
            line-height: 1.6;
            margin-bottom: 28px;
        }

        .error-actions {
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 12px 28px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.15s;
            border: none;
            cursor: pointer;
        }

        .btn-primary {
            background: linear-gradient(135deg, #0972d3, #065fad);
            color: #fff;
        }

        .btn-primary:hover {
            background: linear-gradient(135deg, #065fad, #033160);
        }

        .btn-secondary {
            background: #f0f2f5;
            color: #414d5c;
        }

        .btn-secondary:hover {
            background: #e3e6ea;
        }

        .error-footer {
            padding: 16px 36px 20px;
            border-top: 1px solid #f2f3f3;
        }

        .error-footer p {
            font-size: 11px;
            color: #b8bfc7;
        }
    </style>
</head>
<body>
    <div class="error-card">
        <div class="error-header">
            <div class="error-code">@yield('code')</div>
            <div class="error-icon">
                @yield('icon')
            </div>
            <h1>@yield('title')</h1>
        </div>
        <div class="error-body">
            <p>@yield('message')</p>
            <div class="error-actions">
                @yield('actions',
                    '<a href="/" class="btn btn-primary">Ir al inicio</a>
                     <a href="javascript:history.back()" class="btn btn-secondary">Volver atras</a>'
                )
            </div>
        </div>
        <div class="error-footer">
            <p>BuilderApp</p>
        </div>
    </div>
</body>
</html>
