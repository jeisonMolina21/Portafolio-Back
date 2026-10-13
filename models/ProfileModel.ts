import pool from '@/lib/db';

export class ProfileModel {
  static async getById(id: number) {
    const [rows]: any = await pool.query('SELECT * FROM profile_settings WHERE id = ?', [id]);
    return rows[0];
  }

  static async update(id: number, data: any) {
    const { full_name, title_es, title_en, bio_es, bio_en, location, whatsapp, email, linkedin, github, image_url, cv_backend_url, cv_automation_url, cv_helpdesk_url } = data;
    await pool.query(
      'UPDATE profile_settings SET full_name = ?, title_es = ?, title_en = ?, bio_es = ?, bio_en = ?, location = ?, whatsapp = ?, email = ?, linkedin = ?, github = ?, image_url = ?, cv_backend_url = ?, cv_automation_url = ?, cv_helpdesk_url = ? WHERE id = ?',
      [full_name, title_es ?? null, title_en ?? null, bio_es ?? null, bio_en ?? null, location ?? null, whatsapp ?? null, email ?? null, linkedin ?? null, github ?? null, image_url ?? null, cv_backend_url ?? null, cv_automation_url ?? null, cv_helpdesk_url ?? null, id]
    );
  }
}
