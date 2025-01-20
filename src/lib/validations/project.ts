import * as z from 'zod';

export const projectSchema = z.object({
  name: z.string().min(3, 'Project name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  tags: z.string().transform((str) => 
    str.split(',').map((tag) => tag.trim()).filter(Boolean)
  ),
  status: z.enum(['planning', 'in-progress', 'completed']),
  image_url: z.string().url().optional(),
});