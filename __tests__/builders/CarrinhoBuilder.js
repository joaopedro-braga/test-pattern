import { Carrinho } from '../../src/domain/Carrinho.js';
import { Item } from '../../src/domain/Item.js';

export class CarrinhoBuilder {
  constructor() {
    this._user = null;
    this._itens = [];
  }

  comUsuario(user) {
    this._user = user;
    return this;
  }

  adicionarItem(nome = 'Item Genérico', preco = 10) {
    this._itens.push(new Item(nome, preco));
    return this;
  }

  adicionarItens(lista) {
    lista.forEach(i => this._itens.push(new Item(i.nome, i.preco)));
    return this;
  }

  build() {
    if (!this._user) throw new Error('CarrinhoBuilder requer um usuário');
    return new Carrinho(this._user, this._itens);
  }
}
