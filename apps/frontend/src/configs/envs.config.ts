import { z } from 'zod';

const envsSchema = z.object({
  VITE_API_URL: z.url(),
});

export const envs = envsSchema.parse(import.meta.env);
