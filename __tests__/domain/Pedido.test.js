import { Pedido } from '../../src/domain/Pedido.js';
import { Carrinho } from '../../src/domain/Carrinho.js';
import { User } from '../../src/domain/User.js';
import { Item } from '../../src/domain/Item.js';

describe('Domínio: Pedido', () => {
  test('deve armazenar campos básicos', () => {
    const user = new User(1, 'Teste', 't@example.com');
    const carrinho = new Carrinho(user, [new Item('X', 10)]);
    const pedido = new Pedido(123, carrinho, 10, 'PROCESSADO');
    expect(pedido.id).toBe(123);
    expect(pedido.carrinho).toBe(carrinho);
    expect(pedido.totalFinal).toBe(10);
    expect(pedido.status).toBe('PROCESSADO');
  });
});
