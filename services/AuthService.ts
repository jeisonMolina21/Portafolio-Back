import pool from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signToken } from '@/lib/auth';

export class AuthService {
  /**
   * Autentica a un usuario y genera un token JWT.
   */
  static async login(username: string, pass: string) {
    const [rows]: any = await pool.query('SELECT * FROM users WHERE username = ?', [username.trim()]);
    const user = rows[0];

    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new Error('Credenciales inválidas');
    }

    const token = signToken({ userId: user.id, username: user.username });

    return {
      token,
      user: { id: user.id, username: user.username }
    };
  }
}
