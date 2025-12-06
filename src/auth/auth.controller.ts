import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

@Controller()
export class AuthController {
  // en serio, pasá esto a .env en algún momento:
  private readonly defaultCallback =
    process.env.HOST_CALLBACK_URL || 'http://localhost:3000/auth/callback';

  constructor(private readonly jwtService: JwtService) {}

  @Get('login')
  getLoginPage(@Query('from_url') fromUrl: string, @Res() res: Response) {
    const callback = fromUrl || this.defaultCallback;

    // HTML súper simple para probar
    res.send(`
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <title>Login Service</title>
          </head>
          <body>
            <h1>Login</h1>
            <form method="POST" action="/login">
              <input type="hidden" name="fromUrl" value="${callback}" />
              <div>
                <label>Username:
                  <input name="username" />
                </label>
              </div>
              <div>
                <label>Password:
                  <input type="password" name="password" />
                </label>
              </div>
              <button type="submit">Entrar</button>
            </form>
          </body>
        </html>
      `);
  }

  @Post('login')
  async login(@Body() body: LoginDto, @Res() res: Response) {
    const { username, password, fromUrl } = body;

    // TODO: reemplazar por tu lógica real (DB, etc.)
    if (username !== 'admin' || password !== 'admin') {
      return res.status(401).send('Credenciales inválidas');
    }

    const userPayload = {
      sub: 1,
      username,
      email: 'admin@example.com',
    };

    const token = this.jwtService.sign(userPayload);

    const redirectUrl = fromUrl || this.defaultCallback;

    // 👉 Acá podrías disparar un webhook server → server opcionalmente
    // await fetch('http://localhost:3000/internal/auth-webhook', {...})

    // Redirigimos al host con el token
    return res.redirect(`${redirectUrl}?token=${encodeURIComponent(token)}`);
  }
}
