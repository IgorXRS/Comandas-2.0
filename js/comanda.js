import { ReciboSimples } from '../Modulos/ReciboSimples.js';
import { ReciboLocaliz } from '../Modulos/ReciboLocaliz.js';
import { ReciboContato } from '../Modulos/ReciboContato.js';
import { registrarComanda } from '../Modulos/controle.js';


document.addEventListener('DOMContentLoaded', function () {
    // Selecione o botão
    const botaoGeraRecibo = document.getElementById('botao-gerar-recibo');

    // Adicione um ouvinte de eventos de clique ao botão
    botaoGeraRecibo.addEventListener('click', geraRecibo);
});

function padZero(valor) {
    return valor < 10 ? '0' + valor : valor;
}


function CodBarra() {
    // Obtém a div #barcode
    const barcodeDiv = document.getElementById('barcode');

    // Limpa a div #barcode antes de adicionar uma nova imagem
    barcodeDiv.innerHTML = '';

    // Obtém a data e hora atual
    const dataHoraAtual = new Date();
    const numeroAleatorio = Math.floor(Math.random() * 9) + 1;

    // Cria uma string única para a comanda
    const codBarraHora = `${dataHoraAtual.getFullYear()}${padZero(dataHoraAtual.getMonth() + 1)}${padZero(dataHoraAtual.getDate())}${padZero(dataHoraAtual.getHours())}${padZero(dataHoraAtual.getMinutes())}`;

    const codigoComanda = codBarraHora + numeroAleatorio;

    // Cria um elemento img para renderizar o código de barras
    const barcodeElement = document.createElement('img');
    barcodeElement.id = 'barcode';

    // Verifica se o elemento #barcode existe antes de chamar a função JsBarcode
    if (barcodeElement) {
        JsBarcode(barcodeElement, codigoComanda, {
            format: "CODE128",
            displayValue: false
        });


        const numberBarCode = document.getElementById('numberBarCode');
        numberBarCode.innerHTML = codigoComanda;


        //console.log(codigoComanda);

        // Obtém a representação base64 da imagem gerada pelo JsBarcode
        const base64ImageData = barcodeElement.src.split(',')[1];

        // Cria um novo elemento img e define o atributo src com a representação base64
        const barcodeImageElement = document.createElement('img');
        barcodeImageElement.src = `data:image/png;base64,${base64ImageData}`;

        // Adiciona o elemento img à div #barcode
        barcodeDiv.appendChild(barcodeImageElement);

        // Exibe a seção de impressão
        document.getElementById('imprecao').style.display = 'block';
    } else {
        console.error('Elemento #barcode não encontrado.');
    }
}



function gerarNumero() {
    // Verifica se já existe um contador armazenado no localStorage para hoje
    let hoje = new Date().toLocaleDateString();
    let contador = parseInt(localStorage.getItem('contador_' + hoje)) || 0;

    // Determina o valor de x baseado na hora atual
    let horaAtual = new Date().getHours();
    let x;
    if (horaAtual < 9) {
        x = 10;
    } else if (horaAtual < 12) {
        x = 30;
    } else if (horaAtual < 18) {
        x = 60;
    } else if (horaAtual < 22) {
        x = 90;
    } else {
        // Se passar das 22hrs, reinicia o contador e x
        contador = 0;
        x = 0;
    }

    // Incrementa o contador
    contador++;

    // Guarda o contador atualizado no localStorage
    localStorage.setItem('contador_' + hoje, contador);

    // Retorna o resultado
    return contador + x;
}


// Função geraRecibo
async function geraRecibo() {

    // Obtém o elemento span onde o número do pedido será exibido
    const numeroPedidoSpan = document.getElementById('NPedido');

    // Atualiza o número do pedido
    numeroPedidoSpan.textContent = gerarNumero();


    // Adicione a classe de carregamento ao botão
    const botaoGeraRecibo = document.getElementById('botao-gerar-recibo');
    botaoGeraRecibo.classList.add('loading');

    // Aguarde um atraso (por exemplo, 1 segundo)
    await new Promise(resolve => setTimeout(resolve, 1000));

    const input = document.getElementById('link');
    const linkValue = input.value.trim(); // Obtém o valor do input e remove espaços em branco extras

    if (linkValue === '') {

        ReciboSimples();

    } else {

        var checkbox = document.getElementById("checkboxRecibo");

        if (checkbox.checked) {
            ReciboContato();
        } else {
            ReciboLocaliz();
        }

    }

    registrarComanda();
    // Remova a classe de carregamento após a conclusão da lógica
    botaoGeraRecibo.classList.remove('loading');
}

// Função para exibir a hora atual
function mostrarHora() {
    const elementoHora = document.getElementById('horaAtual');

    if (elementoHora) {
        const agora = new Date(); // Obtém a data e hora atuais
        const hora = agora.toLocaleTimeString(); // Formata a hora para o formato HH:MM:SS

        elementoHora.textContent = 'Hora do registro: ' + hora; // Atualiza o conteúdo do elemento com a hora atual
    } else {
        console.error('Elemento com ID "horaAtual" não encontrado.');
    }
}


function mostrarOcultarTroco() {
    var formaPagamento = document.getElementById("pagamento").value;
    var caixaTroco = document.getElementById("caixaTroco");
    var trocoResult = document.getElementById("troco_result");
    var resultadoTroco = document.getElementById("resultadoTroco");

    var formaPagamento01 = document.getElementById("pagamento01").value;
    var caixaTroco01 = document.getElementById("caixaTroco01");
    var trocoResult01 = document.getElementById("troco_result01");
    var resultadoTroco01 = document.getElementById("resultadoTroco01");

    var formaPagamento02 = document.getElementById("pagamento02").value;
    var caixaTroco02 = document.getElementById("caixaTroco02");
    var trocoResult02 = document.getElementById("troco_result02");
    var resultadoTroco02 = document.getElementById("resultadoTroco02");



    // Se a forma de pagamento for "Dinheiro", mostra o campo de troco, caso contrário, oculta
    if (formaPagamento === "Dinheiro") {
        caixaTroco.style.display = "block";
        trocoResult.style.display = "block";
        resultadoTroco.style.display = "block";
    } else {
        caixaTroco.style.display = "none";
        trocoResult.style.display = "none";
        resultadoTroco.style.display = "none";
        if (formaPagamento === "MultFormPag") {
            if (formaPagamento01 === "Dinheiro") {
                caixaTroco01.style.display = "block";
                trocoResult01.style.display = "block";
                resultadoTroco01.style.display = "block";
            } else {
                caixaTroco01.style.display = "none";
                trocoResult01.style.display = "none";
                resultadoTroco01.style.display = "none";

            } 
            if (formaPagamento02 === "Dinheiro") {
                caixaTroco02.style.display = "block";
                trocoResult02.style.display = "block";
                resultadoTroco02.style.display = "block";
            } else {
                caixaTroco02.style.display = "none";
                trocoResult02.style.display = "none";
                resultadoTroco02.style.display = "none";

            }
        }

    }




}

function mostrarOcultarMultFormPag() {
    var formaPagamento = document.getElementById("pagamento").value;
    var MultFormPag = document.getElementById("MultFormPag");
    var rotuloValor = document.getElementById("rotuloValor");
    var valor = document.getElementById("valor");
    var valorPedidoComandaMultFormPag = document.getElementById("valorPedidoComandaMultFormPag");
    var valorPedidoComanda = document.getElementById("valorPedidoComanda");

    // Se a forma de pagamento for "Dinheiro", mostra o campo de troco, caso contrário, oculta
    if (formaPagamento === "MultFormPag") {
        MultFormPag.style.display = "flex";
        valor.style.display = "none";
        rotuloValor.style.display = "none";
        valorPedidoComandaMultFormPag.style.display = "flex";
        valorPedidoComanda.style.display = "none";
    } else {
        MultFormPag.style.display = "none";
        valor.style.display = "block";
        rotuloValor.style.display = "block";
        valorPedidoComandaMultFormPag.style.display = "none";
        valorPedidoComanda.style.display = "block";
    }
}

// Verifica se o documento está pronto antes de executar o código
document.addEventListener('DOMContentLoaded', function () {

    // Chama a função inicialmente para exibir a hora atual
    mostrarHora();
    mostrarOcultarTroco();
    mostrarOcultarMultFormPag()
    CodBarra();

    // Atualiza a hora a cada segundo
    setInterval(mostrarHora, 1000);
    setInterval(mostrarOcultarTroco, 1000);
    setInterval(mostrarOcultarMultFormPag, 1000);
    setInterval(CodBarra, 10000);
});
