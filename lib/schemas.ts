import { z } from 'zod';

export const MessageSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres").max(100),
  phone: z.string().max(20).optional().nullable(),
  whatsapp: z.string().max(20).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  message: z.string().min(5, "El mensaje debe tener al menos 5 caracteres").max(2000)
});

export const LoginSchema = z.object({
  username: z.string().min(3, "El usuario es obligatorio"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres")
});

export const ProfileSchema = z.object({
  full_name: z.string().min(2),
  title_es: z.string().optional().nullable(),
  title_en: z.string().optional().nullable(),
  bio_es: z.string().optional().nullable(),
  bio_en: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  email: z.string().email().optional().nullable(),
  linkedin: z.string().url().optional().nullable(),
  github: z.string().url().optional().nullable(),
  image_url: z.string().optional().nullable(),
  cv_backend_url: z.string().optional().nullable(),
  cv_automation_url: z.string().optional().nullable(),
  cv_helpdesk_url: z.string().optional().nullable()
});

export const ProjectSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  image_url: z.string().url(),
  video_url: z.string().url().optional().nullable(),
  github_url: z.string().url().optional().nullable(),
  demo_url: z.string().url().optional().nullable(),
  tech_stack: z.string(),
  category: z.string().optional().nullable(),
  challenge: z.string().optional().nullable(),
  action: z.string().optional().nullable(),
  result: z.string().optional().nullable()
});

export const SkillSchema = z.object({
  name: z.string().min(1),
  category: z.string().optional().nullable(),
  level: z.number().min(1).max(100).optional().nullable()
});

export const ExperienceSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  period: z.string().min(1),
  description: z.string(),
  skills: z.string(),
  location: z.string().optional().nullable()
});

export const EducationSchema = z.object({
  institution: z.string().min(1),
  degree: z.string().min(1),
  period: z.string().min(1),
  description: z.string().optional().nullable()
});
