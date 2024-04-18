export function ReciboContato() {


    // Obtém referências aos elementos HTML
    const wrapper = document.querySelector(".wrapper"),
        linkInput = document.getElementById("link"),
        generateBtn = document.getElementById("botao-gerar-recibo"),
        qrImg = wrapper.querySelector(".qr-code img");

    // Obtém o número do WhatsApp do input
    let numeroWhatsapp = linkInput.value;

    // Se o número estiver vazio, interrompe a execução da função
    if (!numeroWhatsapp) return;

    // Atualiza o texto do botão para indicar que o QR Code está sendo gerado
    generateBtn.innerText = "Aguarde...";

    // Cria um link do WhatsApp com o número fornecido
    let qrValue = `https://wa.me/55${numeroWhatsapp}`;

    // Define a fonte da imagem QR Code
    qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=170x170&data=${qrValue}`;

    // Adiciona um ouvinte de evento para quando a imagem do QR Code terminar de carregar
    qrImg.addEventListener("load", () => {
        // Restaura o texto do botão e adiciona a classe 'active' ao wrapper
        generateBtn.innerText = "Gerar Comando";
        wrapper.classList.add("active");
    });

    // Adiciona um atraso de 2 segundos antes de executar o código a seguir
    setTimeout(() => {
        // Insere os valores nos elementos do recibo
        document.getElementById('recibo_cliente').innerHTML = document.getElementById('cliente').value;
        document.getElementById('recibo_pagamento').innerHTML = document.getElementById('pagamento').value;
        document.getElementById('recibo_troco').innerHTML = document.getElementById('troco').value;
        document.getElementById('recibo_valor').innerHTML = parseFloat(document.getElementById('valor').value).toLocaleString('pt-br', { minimumFractionDigits: 2 });
        document.getElementById('recibo_endereco').innerHTML = document.getElementById('endereco').value;
        document.getElementById('recibo_entregador').innerHTML = document.getElementById('entregador').value;
        document.getElementById('recibo_qtd').innerHTML = document.getElementById('qtd').value;
        
            // Obtém os valores de troco e valor
            var troco = parseFloat(document.getElementById('troco').value) || 0;
            var valor = parseFloat(document.getElementById('valor').value) || 0;
    
            // Calcula o troco
            var resultado = troco - valor;
    
            // Exibe o resultado na seção Print
            document.getElementById('resultadoTroco').innerText = ' Valor do troco: R$ ' + resultado.toFixed(2);

        // Chama a função de impressão
        window.print();
    }, 2000);
}
