import { Item } from '../../src/domain/Item.js';

describe('Domínio: Item', () => {
  test('deve criar item com nome e preço', () => {
    const item = new Item('Caneta', 3.5);
    expect(item.nome).toBe('Caneta');
    expect(item.preco).toBe(3.5);
  });
});
