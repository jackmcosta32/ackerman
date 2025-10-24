import type { Literal } from '@workspace/shared';
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface MockDatabaseConnectionModuleOptions {
  entities?: TypeOrmModuleOptions['entities'];
  type?: Literal<'better-sqlite3' | 'postgres'>;
}

export const mockDatabaseConnectionModule = (
  options?: MockDatabaseConnectionModuleOptions,
) => {
  const databaseType = options?.type ?? 'better-sqlite3';

  switch (databaseType) {
    case 'better-sqlite3':
      return TypeOrmModule.forRoot({
        logging: false,
        dropSchema: true,
        synchronize: true,
        autoLoadEntities: true,
        database: ':memory:',
        ...options,
        type: 'better-sqlite3',
      });
    case 'postgres':
      return TypeOrmModule.forRoot({
        logging: false,
        dropSchema: true,
        synchronize: true,
        autoLoadEntities: true,
        host: 'localhost',
        port: 5432,
        username: 'test_user',
        password: 'test_password',
        database: 'test_db',
        ...options,
        type: 'postgres',
      });
    default:
      throw new Error(`Unsupported database type: ${databaseType}`);
  }
};
