import { Carrinho } from '../../src/domain/Carrinho.js';
import { Item } from '../../src/domain/Item.js';
import { User } from '../../src/domain/User.js';

describe('Domínio: Carrinho', () => {
  test('calcularTotal deve retornar 0 quando não há itens', () => {
    const user = new User(1, 'Ana', 'ana@example.com');
    const carrinho = new Carrinho(user, []);
    expect(carrinho.calcularTotal()).toBe(0);
  });

  test('calcularTotal deve somar corretamente múltiplos itens', () => {
    const user = new User(2, 'Bruno', 'bruno@example.com');
    const itens = [
      new Item('A', 10),
      new Item('B', 25),
      new Item('C', 5.5),
    ];
    const carrinho = new Carrinho(user, itens);
    expect(carrinho.calcularTotal()).toBeCloseTo(40.5);
  });

  test('calcularTotal não aplica desconto (regra fica no serviço)', () => {
    const userPremium = new User(3, 'Clara', 'clara@example.com', 'PREMIUM');
    const itens = [new Item('Produto', 100)];
    const carrinho = new Carrinho(userPremium, itens);
    // No domínio, sem desconto: 100
    expect(carrinho.calcularTotal()).toBe(100);
  });
});
