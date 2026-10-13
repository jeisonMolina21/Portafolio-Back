import pool from '@/lib/db';
import { ProfileModel } from '@/models/ProfileModel';
import { ExperienceModel } from '@/models/ExperienceModel';
import { ProjectModel } from '@/models/ProjectModel';
import { EducationModel } from '@/models/EducationModel';
import { RecognitionModel } from '@/models/RecognitionModel';
import { translate } from '@/lib/translator';
import { localizeObject } from '@/constants/languages';

export class PortfolioService {
  /**
   * Obtiene el resumen completo del portafolio procesado y traducido.
   */
  static async getFullSummary(lang: string = 'es') {
    // 1. Obtención de datos en paralelo (Repositorios)
    const [profilesRaw, experienceRaw, projectRaw, [skillRows], educationRows, recognitionRows]: any = await Promise.all([
      pool.query('SELECT * FROM profile_settings ORDER BY id ASC').then(([r]: any) => r),
      ExperienceModel.getAll(lang),
      ProjectModel.getAll(),
      pool.query('SELECT * FROM skills ORDER BY name ASC'),
      EducationModel.getAll(),
      RecognitionModel.getAll()
    ]);

    // 2. Procesamiento y Traducción en paralelo (Lógica de Negocio)
    const [profiles, experience, projects, education] = await Promise.all([
      Promise.all((profilesRaw || []).map((p: any) => this.processProfile(p, lang))),
      this.processExperience(experienceRaw, lang),
      this.processProjects(projectRaw, lang),
      this.processEducation(educationRows, lang)
    ]);

    const defaultProfile = profiles.find((p: any) => p?.id === 1) || profiles[0] || null;

    return {
      profile: defaultProfile,
      profiles,
      experience,
      projects,
      skills: skillRows,
      education,
      recognitions: recognitionRows
    };
  }

  static async getExperience() { return ExperienceModel.getAll(); }
  static async addExperience(data: any) { return ExperienceModel.create(data); }
  static async deleteExperience(id: number) { return ExperienceModel.delete(id); }

  static async getProjects() { return ProjectModel.getAll(); }
  static async addProject(data: any) { return ProjectModel.create(data); }
  static async deleteProject(id: number) { return ProjectModel.delete(id); }

  static async getEducation() { return EducationModel.getAll(); }
  static async addEducation(data: any) { return EducationModel.create(data); }
  static async deleteEducation(id: number) { return EducationModel.delete(id); }

  static async getRecognitions() { return RecognitionModel.getAll(); }
  static async addRecognition(data: any) { return RecognitionModel.create(data); }
  static async deleteRecognition(id: number) { return RecognitionModel.delete(id); }

  private static async processProfile(profile: any, lang: string) {
    if (!profile) return null;
    const localized = localizeObject(profile, ['title', 'bio', 'headline_metric'], lang);
    
    // Traducción automática si falta el campo localizado
    const [title, bio] = await Promise.all([
      !localized.title && profile.title_es ? translate(profile.title_es, lang) : localized.title,
      !localized.bio && profile.bio_es ? translate(profile.bio_es, lang) : localized.bio
    ]);

    localized.title = title;
    localized.bio = bio;
    
    if (profile.metrics_json) {
      try {
        localized.metrics = JSON.parse(profile.metrics_json);
      } catch (e) {
        localized.metrics = [];
      }
    }
    return localized;
  }

  private static async processExperience(items: any[], lang: string) {
    // Filter out other versions of Horizonte to avoid duplicates on the main website
    const filtered = items.filter(item => {
      if (item.company === 'Fundación Universitaria Horizonte') {
        const roleLower = item.role.toLowerCase();
        return roleLower.includes('full stack') || roleLower.includes('fullstack');
      }
      return true;
    });

    if (lang === 'es') return filtered;
    return Promise.all(filtered.map(async (item) => ({
      ...item,
      role: await translate(item.role, lang),
      description: await translate(item.description, lang),
      skills: await translate(item.skills, lang)
    })));
  }

  private static async processProjects(items: any[], lang: string) {
    if (lang === 'es') return items;
    return Promise.all(items.map(async (item) => ({
      ...item,
      title: await translate(item.title, lang),
      description: await translate(item.description, lang),
      challenge: await translate(item.challenge || '', lang),
      action: await translate(item.action || '', lang),
      result: await translate(item.result || '', lang),
      tech_stack: await translate(item.tech_stack, lang)
    })));
  }

  private static async processEducation(items: any[], lang: string) {
    if (lang === 'es') return items;
    return Promise.all(items.map(async (item) => ({
      ...item,
      degree: await translate(item.degree, lang),
      description: await translate(item.description || '', lang)
    })));
  }
}
