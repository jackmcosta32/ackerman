import { Reflector } from '@nestjs/core';
import type { ExecutionContext } from '@nestjs/common';
import { Role } from '@/constants/roles.constant';
import { RolesGuard } from './roles.guard';

const createExecutionContext = (role?: Role): ExecutionContext =>
  ({
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({
      getRequest: () => ({
        user: role
          ? {
              role,
            }
          : undefined,
      }),
    }),
  }) as unknown as ExecutionContext;

describe('RolesGuard', () => {
  it('allows access when no roles are required', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue(undefined),
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);

    expect(guard.canActivate(createExecutionContext())).toBe(true);
  });

  it('allows access when user has required role', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue([Role.ADMIN]),
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);

    expect(guard.canActivate(createExecutionContext(Role.ADMIN))).toBe(true);
  });

  it('rejects access when user does not have required role', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue([Role.ADMIN]),
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);

    expect(() => guard.canActivate(createExecutionContext(Role.USER))).toThrow(
      'Insufficient permissions',
    );
  });
});
