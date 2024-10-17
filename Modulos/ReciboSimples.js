export function ReciboSimples() {

    // Adiciona um atraso de 2 segundos antes de executar o código a seguir
    setTimeout(() => {
        // Preenche os elementos de recibo com valores dos inputs
        document.getElementById('recibo_cliente').innerHTML = document.getElementById('cliente').value;
        document.getElementById('recibo_celular').innerHTML = document.getElementById('telefone').value;
        document.getElementById('recibo_pagamento').innerHTML = document.getElementById('pagamento').value;
        document.getElementById('recibo_troco').innerHTML = document.getElementById('troco').value;
        document.getElementById('recibo_valor').innerHTML = parseFloat(document.getElementById('valor').value).toLocaleString('pt-br', { minimumFractionDigits: 2 });
        document.getElementById('recibo_endereco').innerHTML = document.getElementById('endereco').value;
        document.getElementById('recibo_entregador').innerHTML = document.getElementById('entregador').value;

        var formaPagamento = document.getElementById('pagamento').value;

        if (formaPagamento === "MultFormPag") {

            document.getElementById('recibo_pagamento01').innerHTML = document.getElementById('pagamento01').value;
            document.getElementById('recibo_troco01').innerHTML = document.getElementById('troco01').value;
            document.getElementById('recibo_valor01').innerHTML = parseFloat(document.getElementById('valor01').value).toLocaleString('pt-br', { minimumFractionDigits: 2 });

            document.getElementById('recibo_pagamento02').innerHTML = document.getElementById('pagamento02').value;
            document.getElementById('recibo_troco02').innerHTML = document.getElementById('troco02').value;
            document.getElementById('recibo_valor02').innerHTML = parseFloat(document.getElementById('valor02').value).toLocaleString('pt-br', { minimumFractionDigits: 2 });

        } else {

            document.getElementById('recibo_pagamento').innerHTML = document.getElementById('pagamento').value;
            document.getElementById('recibo_troco').innerHTML = document.getElementById('troco').value;
            document.getElementById('recibo_valor').innerHTML = parseFloat(document.getElementById('valor').value).toLocaleString('pt-br', { minimumFractionDigits: 2 });

        }

        // Remove a classe "active" do wrapper, se estiver presente
        const wrapper = document.querySelector(".wrapper");
        if (wrapper.classList.contains('active')) {
            wrapper.classList.remove('active');
        }

        // Obtém os valores de troco e valor
        var troco = parseFloat(document.getElementById('troco').value) || 0;
        var valor = parseFloat(document.getElementById('valor').value) || 0;

        // Obtém os valores de troco e valor
        var troco01 = parseFloat(document.getElementById('troco01').value) || 0;
        var valor01 = parseFloat(document.getElementById('valor01').value) || 0;

        // Obtém os valores de troco e valor
        var troco02 = parseFloat(document.getElementById('troco02').value) || 0;
        var valor02 = parseFloat(document.getElementById('valor02').value) || 0;

        // Calcula o troco
        var resultado = troco - valor;
        // Calcula o troco
        var resultado01 = troco01 - valor01;
        // Calcula o troco
        var resultado02 = troco02 - valor02;

        // Exibe o resultado na seção Print
        document.getElementById('resultadoTroco').innerText = ' Valor do troco: R$ ' + resultado.toFixed(2);

        document.getElementById('resultadoTroco01').innerText = ' Valor do troco: R$ ' + resultado01.toFixed(2);

        document.getElementById('resultadoTroco02').innerText = ' Valor do troco: R$ ' + resultado02.toFixed(2);

        window.print(); // Imprime o recibo
    }, 2000);
}
