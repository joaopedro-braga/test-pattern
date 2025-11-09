import { CheckoutService } from '../src/services/CheckoutService.js';
import { CarrinhoBuilder } from './builders/CarrinhoBuilder.js';
import { UserMother } from './builders/UserMother.js';

// Test Doubles utilitários
const criarGatewayStub = (resultado) => ({
  cobrar: jest.fn().mockResolvedValue(resultado),
});

const criarGatewayMock = () => ({
  cobrar: jest.fn(),
});

const criarRepoStub = (pedidoComId) => ({
  salvar: jest.fn().mockResolvedValue(pedidoComId),
});

const criarRepoMock = () => ({
  salvar: jest.fn(),
});

const criarEmailMock = () => ({
  enviarEmail: jest.fn().mockResolvedValue(true),
});

describe('CheckoutService', () => {
  test('deve retornar null se o pagamento falhar (gateway retorna success=false)', async () => {
    const usuario = UserMother.padrao();
    const carrinho = new CarrinhoBuilder().comUsuario(usuario).adicionarItem('A', 50).build();
    const gatewayStub = criarGatewayStub({ success: false, error: 'Cartão recusado' });
    const repoMock = criarRepoMock();
    const emailMock = criarEmailMock();

    const service = new CheckoutService(gatewayStub, repoMock, emailMock);
    const resultado = await service.processarPedido(carrinho, { numero: '123' });

    expect(resultado).toBeNull();
    // comportamento: não deve chamar salvar nem enviarEmail
    expect(repoMock.salvar).not.toHaveBeenCalled();
    expect(emailMock.enviarEmail).not.toHaveBeenCalled();
  });

  test('deve retornar pedido salvo para usuário padrão sem desconto', async () => {
    const usuario = UserMother.padrao();
    const carrinho = new CarrinhoBuilder()
      .comUsuario(usuario)
      .adicionarItem('Produto1', 30)
      .adicionarItem('Produto2', 20)
      .build();
    const totalEsperado = 50; // sem desconto

    // Gateway deve ser chamado com totalEsperado
    const gatewayStub = criarGatewayStub({ success: true });
    const pedidoSalvoFake = { id: 99, carrinho, totalFinal: totalEsperado, status: 'PROCESSADO' };
    const repoStub = criarRepoStub(pedidoSalvoFake);
    const emailStub = criarEmailMock();

    const service = new CheckoutService(gatewayStub, repoStub, emailStub);
    const resultado = await service.processarPedido(carrinho, { numero: '123' });

    expect(resultado).toEqual(pedidoSalvoFake);
    expect(gatewayStub.cobrar).toHaveBeenCalledWith(totalEsperado, { numero: '123' });
  });

  test('deve aplicar 10% de desconto para usuário premium ao cobrar', async () => {
    const usuario = UserMother.premium();
    const carrinho = new CarrinhoBuilder().comUsuario(usuario).adicionarItem('Prod caro', 100).build();
    const gatewayMock = criarGatewayMock();
    gatewayMock.cobrar.mockResolvedValue({ success: true });
    const pedidoSalvoFake = { id: 1, carrinho, totalFinal: 90, status: 'PROCESSADO' }; // 10% off
    const repoStub = criarRepoStub(pedidoSalvoFake);
    const emailMock = criarEmailMock();

    const service = new CheckoutService(gatewayMock, repoStub, emailMock);
    await service.processarPedido(carrinho, { numero: '999' });

    expect(gatewayMock.cobrar).toHaveBeenCalledWith(90, { numero: '999' });
  });

  test('deve chamar EmailService com os parâmetros corretos após pagamento bem-sucedido', async () => {
    const usuario = UserMother.padrao({ email: 'cliente@example.com' });
    const carrinho = new CarrinhoBuilder().comUsuario(usuario).adicionarItem('X', 40).build();
    const gatewayStub = criarGatewayStub({ success: true });
    const pedidoSalvoFake = { id: 7, carrinho, totalFinal: 40, status: 'PROCESSADO' };
    const repoStub = criarRepoStub(pedidoSalvoFake);
    const emailMock = criarEmailMock();

    const service = new CheckoutService(gatewayStub, repoStub, emailMock);
    await service.processarPedido(carrinho, { numero: '000' });

    expect(emailMock.enviarEmail).toHaveBeenCalledTimes(1);
    expect(emailMock.enviarEmail).toHaveBeenCalledWith(
      'cliente@example.com',
      'Seu Pedido foi Aprovado!',
      expect.stringContaining('Pedido 7 no valor de R$40')
    );
  });

  test('não deve interromper processamento se envio de e-mail falhar', async () => {
    const usuario = UserMother.padrao();
    const carrinho = new CarrinhoBuilder().comUsuario(usuario).adicionarItem('Y', 25).build();
    const gatewayStub = criarGatewayStub({ success: true });
    const pedidoSalvoFake = { id: 55, carrinho, totalFinal: 25, status: 'PROCESSADO' };
    const repoStub = criarRepoStub(pedidoSalvoFake);
    const emailMock = { enviarEmail: jest.fn().mockRejectedValue(new Error('SMTP DOWN')) };

    const service = new CheckoutService(gatewayStub, repoStub, emailMock);
    const resultado = await service.processarPedido(carrinho, { numero: '111' });

    expect(resultado).toEqual(pedidoSalvoFake); // pedido ainda retorna
    expect(emailMock.enviarEmail).toHaveBeenCalledTimes(1);
  });
});
