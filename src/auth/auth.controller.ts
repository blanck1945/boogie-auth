// src/auth/auth.controller.ts
import { Body, Controller, Get, Post, Query, Req, Res } from '@nestjs/common';
import type { Request, Response } from 'express';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AuthController {
  private readonly defaultCallback =
    process.env.HOST_CALLBACK_URL || 'http://localhost:5173';

  // 1) PÁGINA DE LOGIN + SETEO DE relayState EN SESIÓN
  @Get('login')
  getLoginPage(
    @Query('from_url') fromUrl: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const relayState = fromUrl || this.defaultCallback;

    res.send(`
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>YourID - Login</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background: #e3f2fd; /* azul claro */
        font-family: Arial, sans-serif;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100vh;
      }

      .card {
        background: white;
        padding: 30px 40px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        width: 350px;
        text-align: center;
      }

      h1 {
        margin-bottom: 20px;
        color: #1976d2;
        font-size: 26px;
      }

      label {
        font-size: 14px;
        display: block;
        margin-bottom: 6px;
        text-align: left;
      }

      input {
        width: 100%;
        padding: 10px;
        margin-bottom: 16px;
        border: 1px solid #b0bec5;
        border-radius: 6px;
        font-size: 14px;
      }

      button {
        width: 100%;
        background: #1976d2;
        color: white;
        padding: 12px;
        border: none;
        border-radius: 6px;
        font-size: 16px;
        cursor: pointer;
      }

      button:hover {
        background: #0d47a1;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>YourID</h1>

      <form method="POST" action="/login">
        <input type="hidden" name="relayState" value="${relayState}" />

        <div>
          <label>Username</label>
          <input name="username" autocomplete="username"/>
        </div>

        <div>
          <label>Password</label>
          <input type="password" name="password" autocomplete="current-password"/>
        </div>

        <button type="submit">Entrar</button>
      </form>
    </div>
  </body>
</html>
`);
  }

  // 2) PROCESAR LOGIN, GUARDAR USER EN SESIÓN Y USAR relayState
  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const { username, password, relayState } = body;

    // TODO: reemplazar por lógica real (DB, hash, etc.)
    if (username !== 'admin' || password !== 'admin') {
      return res.status(401).send('Credenciales inválidas');
    }

    // Redirigir al host usando relayState
    return res.redirect(
      `https://boogie-applications-production.up.railway.app/user/login?relayState=${encodeURIComponent(relayState || '')}&user=${username}&email=admin@example.com`,
    );
  }
}
