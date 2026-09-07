import type { UserRole } from '../../users/entities/user.entity';

const ROLES_THAT_BYPASS_OWNERSHIP: readonly UserRole[] = ['editor', 'admin'];

export function canBypassOwnership(roles: UserRole[]): boolean {
  return roles.some((role) => ROLES_THAT_BYPASS_OWNERSHIP.includes(role));
}
