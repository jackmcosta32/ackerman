import type { Entity } from '@/features/shared/models/entity.model';

export interface User extends Entity {
  name: string;
  email: string;
}
