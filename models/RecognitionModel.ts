import pool from '@/lib/db';

export class RecognitionModel {
  static async getAll() {
    const [rows]: any = await pool.query('SELECT * FROM recognitions ORDER BY created_at DESC');
    return rows;
  }

  static async create(data: any) {
    const { name, entity, date, image_url } = data;
    const [result]: any = await pool.query(
      'INSERT INTO recognitions (name, entity, date, image_url) VALUES (?, ?, ?, ?)',
      [name, entity, date, image_url]
    );
    return result.insertId;
  }

  static async delete(id: number) {
    await pool.query('DELETE FROM recognitions WHERE id = ?', [id]);
  }
}
