import pool from '@/lib/db';

export class ProjectModel {
  static async getAll() {
    const [rows]: any = await pool.query('SELECT * FROM projects ORDER BY created_at DESC');
    return rows;
  }

  static async create(data: any) {
    const { title, description, image_url, video_url, github_url, demo_url, tech_stack, challenge, action, result } = data;
    const [dbResult]: any = await pool.query(
      'INSERT INTO projects (title, description, image_url, video_url, github_url, demo_url, tech_stack, challenge, action, result) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, image_url, video_url ?? null, github_url ?? null, demo_url ?? null, tech_stack, challenge ?? null, action ?? null, result ?? null]
    );
    return dbResult.insertId;
  }

  static async delete(id: number) {
    await pool.query('DELETE FROM projects WHERE id = ?', [id]);
  }
}
