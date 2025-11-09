import { User } from '../../src/domain/User.js';

describe('Domínio: User', () => {
  test('isPremium deve ser false por padrão (tipo PADRAO)', () => {
    const user = new User(1, 'João', 'joao@example.com');
    expect(user.tipo).toBe('PADRAO');
    expect(user.isPremium()).toBe(false);
  });

  test('isPremium deve ser true quando tipo for PREMIUM', () => {
    const user = new User(2, 'Maria', 'maria@example.com', 'PREMIUM');
    expect(user.isPremium()).toBe(true);
  });
});
