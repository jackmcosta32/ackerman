import type { QueryRunner } from 'typeorm';

export type WithQueryRunner<T> = T & { queryRunner?: QueryRunner };
