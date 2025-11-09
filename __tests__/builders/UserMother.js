import { User } from '../../src/domain/User.js';

export class UserMother {
  static padrao(overrides = {}) {
    const base = new User(
      overrides.id ?? 1,
      overrides.nome ?? 'Usuário Padrão',
      overrides.email ?? 'padrao@example.com',
      'PADRAO'
    );
    return base;
  }

  static premium(overrides = {}) {
    const base = new User(
      overrides.id ?? 2,
      overrides.nome ?? 'Usuário Premium',
      overrides.email ?? 'premium@example.com',
      'PREMIUM'
    );
    return base;
  }
}
