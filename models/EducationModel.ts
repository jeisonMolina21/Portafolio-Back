import pool from '@/lib/db';

export class EducationModel {
  static async getAll() {
    const [rows]: any = await pool.query('SELECT * FROM education ORDER BY created_at DESC');
    return rows;
  }

  static async create(data: any) {
    const { institution, degree, period, description, lang = 'es' } = data;
    const [result]: any = await pool.query(
      'INSERT INTO education (institution, degree, period, description, lang) VALUES (?, ?, ?, ?, ?)',
      [institution, degree, period, description, lang]
    );
    return result.insertId;
  }

  static async delete(id: number) {
    await pool.query('DELETE FROM education WHERE id = ?', [id]);
  }
}

