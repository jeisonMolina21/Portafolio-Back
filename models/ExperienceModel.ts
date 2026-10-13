import pool from '@/lib/db';

export class ExperienceModel {
  static async getAll(lang: string = 'es') {
    const [rows]: any = await pool.query('SELECT * FROM experience ORDER BY created_at DESC');
    return rows;
  }

  static async create(data: any) {
    const { company, role, period, description, skills, lang = 'es' } = data;
    const [result]: any = await pool.query(
      'INSERT INTO experience (company, role, period, description, skills, lang) VALUES (?, ?, ?, ?, ?, ?)',
      [company, role, period, description, skills, lang]
    );
    return result.insertId;
  }


  static async delete(id: number) {
    await pool.query('DELETE FROM experience WHERE id = ?', [id]);
  }
}
