export function ReciboSimples () {


        // Preenche os elementos de recibo com valores dos inputs
        document.getElementById('recibo_cliente').innerHTML = document.getElementById('cliente').value;
        document.getElementById('recibo_pagamento').innerHTML = document.getElementById('pagamento').value;
        document.getElementById('recibo_troco').innerHTML = document.getElementById('troco').value;
        document.getElementById('recibo_valor').innerHTML = parseFloat(document.getElementById('valor').value).toLocaleString('pt-br', {minimumFractionDigits: 2});
        document.getElementById('recibo_endereco').innerHTML = document.getElementById('endereco').value;
        document.getElementById('recibo_entregador').innerHTML = document.getElementById('entregador').value;
        document.getElementById('recibo_qtd').innerHTML = document.getElementById('qtd').value;

        // Remove a classe "active" do wrapper, se estiver presente
        const wrapper = document.querySelector(".wrapper");
        if (wrapper.classList.contains('active')) {
            wrapper.classList.remove('active');
        }

        // Obtém os valores de troco e valor
        var troco = parseFloat(document.getElementById('troco').value) || 0;
        var valor = parseFloat(document.getElementById('valor').value) || 0;

        // Calcula o troco
        var resultado = troco - valor;

        // Exibe o resultado na seção Print
        document.getElementById('resultadoTroco').innerText = ' Valor do troco: R$ ' + resultado.toFixed(2);

        window.print(); // Imprime o recibo

}
