// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
    apiKey: "AIzaSyA1nVmyUQLids8LyFahmDQirF-SMVzyBiM",
    authDomain: "sistema-drogaria-fc409.firebaseapp.com",
    projectId: "sistema-drogaria-fc409",
    storageBucket: "sistema-drogaria-fc409.appspot.com",
    messagingSenderId: "378296728372",
    appId: "1:378296728372:web:a298f4178c56098abbc361"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var usuario = null;

// Começamos aqui 

const db = firebase.firestore();



firebase.auth().onAuthStateChanged((val) => {

    if (val) {
        usuario = val;

        //Ouvir por mudanças no banco de dados.

        db.collection('registrosEntregas').where("userId", "==", usuario.uid).onSnapshot((data) => {
            let list = document.querySelector('#registrosEntregas');
            list.innerHTML = "";
            let registrosEntregas = data.docs;
            registrosEntregas = registrosEntregas.sort(function (a, b) {
                if (a.data().horario < b.data().horario)
                    return +1;
                else
                    return -1;
            })
            registrosEntregas.map((val) => {

                list.innerHTML += `
            <li>
            <div class="containerCard">
                <div class="deco01"><p>${val.data().codBarra}</p></div>
                <div class="card">
                    <div class="cardTop">
                    <a registrosEntregas-id="${val.id}" class="confirmar-reset-btn reset" href="javascript:void(0)">
                            <i style="color:${val.data().color}" class="bi bi-geo-alt-fill"></i>
                    </a>
                        <h4>${val.data().cliente}</h4>
                    </div>
                    <div class="cardQuite">
                        <div class="val">
                        <label>VALOR: </label>
                        <p>R$ ${val.data().valor}</p>
                        </div>
                        <div class="pag">
                            <label>PAGAMENTO:</label>
                            <p>${val.data().pagamento}</p>
                        </div>
                    </div>
                    <div class="cardLow">
                        <div class="hora">
                        <a registrosEntregas-id="${val.id}" class="confirmar-inicio-btn inicio" href="javascript:void(0)">
                            <i class="bi bi-box-arrow-right"></i>
                        </a>
                        <p>${val.data().hora01} hr</p>
                        </div>
                        <div class="hora">
                        <a registrosEntregas-id="${val.id}" class="confirmar-entrega-btn complete" href="javascript:void(0)">
                            <i class="bi bi-clipboard-check"></i>
                        </a>
                        <p>${val.data().hora02} hr</p>
                        </div>
                        <h6>${val.data().entregador}</h6>
                    </div>
                </div>
                <div class="deco02">
                <div class="excluirPonto"><a registrosEntregas-id="${val.id}" class="excluir-btn" href="javascript:void(0)"><i class="bi bi-trash"></i></a></div></div>
            </div>`
            })

            //---------------------------------------------------------------------------------------------------
            // Adicione um ouvinte de eventos ao botão de confirmação de início
            var confirmarInicioBtn = document.querySelectorAll('.confirmar-inicio-btn');

            confirmarInicioBtn.forEach(element => {
                element.addEventListener('click', function (e) {
                    e.preventDefault();

                    // Obtém o docId do atributo personalizado
                    let docId = element.getAttribute('registrosEntregas-id');

                    // Obtém o registro correspondente no banco de dados
                    let registroRef = db.collection('registrosEntregas').doc(docId);

                    // Obter os dados do registro
                    registroRef.get().then((doc) => {
                        if (doc.exists) {
                            // Verifica se hora02 é igual a "--:--" e hora01 é igual a "--:--"
                            if (doc.data().hora02 === "--:--" && doc.data().hora01 === "--:--") {
                                // Se a condição for atendida, exibe a confirmação
                                const confirmacao = confirm("Deseja realmente iniciar esta entrega?");
                                if (confirmacao) {
                                    // Atualiza informações no banco de dados
                                    const dataAtual = new Date();
                                    const hora = dataAtual.getHours();
                                    const minutos = dataAtual.getMinutes();

                                    const horaFormatada = `${hora < 10 ? '0' + hora : hora}:${minutos < 10 ? '0' + minutos : minutos}`;

                                    // Atualiza o registro com a nova informação
                                    registroRef.update({
                                        color: 'yellow',
                                        hora01: horaFormatada
                                    });
                                }
                            } else {
                                alert("A entrega não pode ser iniciada. Saida já registrada ou entrega já finalizada.");
                            }
                        } else {
                            console.log("Registro não encontrado");
                        }
                    }).catch((error) => {
                        console.log("Erro ao obter registro:", error);
                    });
                });
            });
            //---------------------------------------------------------------------------------------------------
            // Adicione um ouvinte de eventos ao botão de confirmação de entrega
            var confirmarEntregaBtn = document.querySelectorAll('.confirmar-entrega-btn');

            confirmarEntregaBtn.forEach(element => {
                element.addEventListener('click', function (e) {
                    e.preventDefault();

                    // Obtém o docId do atributo personalizado
                    let docId = element.getAttribute('registrosEntregas-id');

                    // Obtém o registro correspondente no banco de dados
                    let registroRef = db.collection('registrosEntregas').doc(docId);

                    // Obter os dados do registro
                    registroRef.get().then((doc) => {
                        if (doc.exists) {
                            // Verifica se hora01 é diferente de "--:--"
                            if (doc.data().hora01 !== "--:--") {
                                // Se a condição for atendida, exibe a confirmação
                                const confirmacao = confirm("Deseja realmente confirmar esta entrega?");
                                if (confirmacao) {
                                    // Atualiza informações no banco de dados
                                    const dataAtual = new Date();
                                    const hora = dataAtual.getHours();
                                    const minutos = dataAtual.getMinutes();

                                    const horaFormatada = `${hora < 10 ? '0' + hora : hora}:${minutos < 10 ? '0' + minutos : minutos}`;

                                    // Atualiza o registro com a nova informação
                                    registroRef.update({
                                        color: 'green',
                                        hora02: horaFormatada
                                    });
                                }
                            } else {
                                alert("A entrega não pode ser confirmada. Saida não registrada.");
                            }
                        } else {
                            console.log("Registro não encontrado");
                        }
                    }).catch((error) => {
                        console.log("Erro ao obter registro:", error);
                    });
                });
            });
            //---------------------------------------------------------------------------------------------------
            // Adicione um ouvinte de eventos ao botão de confirmação de reset
            var confirmarInicioBtn = document.querySelectorAll('.confirmar-reset-btn');

            confirmarInicioBtn.forEach(element => {
                element.addEventListener('click', function (e) {
                    e.preventDefault();

                    const confirmacao = confirm("Deseja realmente resetar esta entrega?");

                    // Verificar se a senha está correta
                    if (confirmacao) {
                        const senhaDigitada = prompt("Digite a senha para confirmar o reset:");
                        if (senhaDigitada === "9797") {
                            // Se o usuário confirmar, atualizar informações no banco de dados
                            const dataAtual = new Date();
                            const hora = dataAtual.getHours();
                            const minutos = dataAtual.getMinutes();

                            const horaFormatada = `${hora < 10 ? '0' + hora : hora}:${minutos < 10 ? '0' + minutos : minutos}`;

                            let docId = element.getAttribute('registrosEntregas-id');
                            db.collection('registrosEntregas').doc(docId).update({
                                color: 'red',
                                hora01: '--:--',
                                hora02: '--:--'
                            });
                        }
                    } else {
                        alert("Senha incorreta. Operação cancelada.");
                    }
                });
            });
            //---------------------------------------------------------------------------------------------------
            //Filtro para pesquisar item

            const filtroProdutoInput = document.getElementById('filtroProduto2');

            filtroProdutoInput.addEventListener('input', function () {
                const termoFiltro = filtroProdutoInput.value.toLowerCase();
                const listaRegistros = document.querySelector('#registrosEntregas');

                // Itera sobre os itens da lista e mostra ou esconde com base no filtro
                Array.from(listaRegistros.children).forEach(item => {
                    const textoItem = item.textContent.toLowerCase();
                    const correspondeAoFiltro = textoItem.includes(termoFiltro);

                    item.style.display = correspondeAoFiltro ? 'block' : 'none';
                });
            });
            //--------------------------  Excluir Elemento -------------------------------------------------------------------------
            var excluiRegistros = document.querySelectorAll('.excluir-btn');

            excluiRegistros.forEach(element => {
                element.addEventListener('click', function (e) {
                    e.preventDefault();

                    const confirmacao = confirm("Deseja realmente excluir esta entrega?");

                    if (confirmacao) {
                        let docId = element.getAttribute('registrosEntregas-id');
                        db.collection('registrosEntregas').doc(docId).delete();
                    }
                })
            });
            //---------------------------------------------------------------------------------------------------
            const filtroDataInput = document.getElementById('filtroData');

            // Função para aplicar o filtro de acordo com a data especificada
            function aplicarFiltro(dataFiltro) {
                // Limpar o conteúdo atual da tabela
                tabelaRegistros.innerHTML = "";

                // Iterar sobre os documentos recuperados do Firestore
                data.forEach((doc) => {
                    const registro = doc.data();

                    // Verificar se a data do registro corresponde à data do filtro ou se não há filtro
                    if (!dataFiltro || new Date(registro.horario).toLocaleDateString() === dataFiltro) {
                        // Criar uma nova linha na tabela
                        const novaLinha = document.createElement('tr');

                        // Preencher as células da linha com os dados do documento
                        novaLinha.innerHTML = `
                        <td>${registro.cliente}</td>
                        <td>${registro.pagamento}</td>
                        <td>${registro.qtd}</td>
                        <td>R$ ${registro.valor}</td>
                        <td>${new Date(registro.horario).toLocaleDateString()}</td>
                        <td>${registro.entregador}</td>
                    `;

                        // Adicionar a nova linha à tabela
                        tabelaRegistros.appendChild(novaLinha);
                    }
                });
            }

            //---------------------------------------------------------------------------------------------------

            function somaTotal(dataFiltro) {
                // Inicialize a variável para armazenar a soma
                let somaQtd = 0;
                let somaValor = 0;

                // Itere sobre os registros e calcule a soma da quantidade
                registrosEntregas.forEach((registro) => {
                    // Verifique se o registro é do dia atual
                    const dataRegistro = new Date(registro.data().horario).toLocaleDateString();

                    if (dataRegistro === dataFiltro) {
                        // Converta o valor para número antes de somar
                        somaQtd += parseInt(registro.data().qtd, 10);
                        somaValor += parseInt(registro.data().valor, 10);
                    }
                });
                const contagemTotal = document.getElementById('contagemTotal');
                const valorTotal = document.getElementById('valorTotal');

                contagemTotal.textContent = somaQtd;
                valorTotal.textContent = 'R$ ' + somaValor;
            };

            //-------------------------------------------------------------------------------------------------
            // Obtenha a data atual formatada
            const dataAtualFormatada = new Date().toLocaleDateString();

            //---------------------------------------------------------------------------------------------------
            function somaDinheiro(dataFiltro) {
                let somaQtdDinheiro = 0;
                let somaValorDinheiro = 0;

                // Itere sobre os registros e calcule a soma da quantidade para pagamento "Dinheiro" ou "Dinheiro Trocado"
                registrosEntregas.forEach((registro) => {
                    // Converta o horário do registro para uma data
                    const dataRegistro = new Date(registro.data().horario).toLocaleDateString();

                    // Verifique se o registro é do dia atual e a forma de pagamento inclui "Dinheiro"
                    if (dataRegistro === dataFiltro && (registro.data().pagamento.includes('Dinheiro') || registro.data().pagamento.includes('Dinheiro Trocado'))) {
                        // Converta o valor da quantidade para número antes de somar
                        somaQtdDinheiro += parseInt(registro.data().qtd, 10);
                        somaValorDinheiro += parseInt(registro.data().valor, 10);
                    }
                });

                const contagemDinheiro = document.getElementById('contagemDinheiro');
                const valorDinheiro = document.getElementById('valorDinheiro');

                contagemDinheiro.textContent = somaQtdDinheiro;
                valorDinheiro.textContent = 'R$ ' + somaValorDinheiro;
            };

            //---------------------------------------------------------------------------------------------------
            function somaPix(dataFiltro) {
                let somaQtdPix = 0;
                let somaValorPix = 0;

                // Itere sobre os registros e calcule a soma da quantidade para pagamento "Dinheiro"
                registrosEntregas.forEach((registro) => {
                    // Converta o horário do registro para uma data
                    const dataRegistro = new Date(registro.data().horario).toLocaleDateString();

                    // Verifique se o registro é do dia atual e o pagamento é "Dinheiro"
                    if (dataRegistro === dataFiltro && registro.data().pagamento === 'Pix') {
                        // Converta o valor da quantidade para número antes de somar
                        somaQtdPix += parseInt(registro.data().qtd, 10);
                        somaValorPix += parseInt(registro.data().valor, 10);
                    }
                });

                const contagemPix = document.getElementById('contagemPix');
                const valorPix = document.getElementById('valorPix');
                //console.log('Soma da quantidade do dia atual:', somaQtd);
                contagemPix.textContent = somaQtdPix;
                valorPix.textContent = 'R$ ' + somaValorPix;
            };
            //---------------------------------------------------------------------------------------------------
            function somaCartao(dataFiltro) {
                let somaQtdCartao = 0;
                let somaValorCartao = 0;

                // Itere sobre os registros e calcule a soma da quantidade para pagamento "Dinheiro"
                registrosEntregas.forEach((registro) => {
                    // Converta o horário do registro para uma data
                    const dataRegistro = new Date(registro.data().horario).toLocaleDateString();

                    // Verifique se o registro é do dia atual e o pagamento é "Dinheiro"
                    if (dataRegistro === dataFiltro && registro.data().pagamento === 'Cartão') {
                        // Converta o valor da quantidade para número antes de somar
                        somaQtdCartao += parseInt(registro.data().qtd, 10);
                        somaValorCartao += parseInt(registro.data().valor, 10);
                    }
                });

                const contagemCartao = document.getElementById('contagemCartao');
                const valorCartao = document.getElementById('valorCartao');
                //console.log('Soma da quantidade do dia atual:', somaQtd);
                contagemCartao.textContent = somaQtdCartao;
                valorCartao.textContent = 'R$ ' + somaValorCartao;
            };

            // -------------------------------------------Evento de filtro inicial ---------------------------------------------------------

            function filterInital() {
                // Obtenha a data atual
                const dataAtual = new Date();

                // Formate a data atual para o valor esperado no input (por exemplo, "yyyy-mm-dd")
                const formatoData = { year: 'numeric', month: '2-digit', day: '2-digit' };
                const dataAtualFormatada = dataAtual.toLocaleDateString(undefined, formatoData);

                // Defina o valor padrão no input filtroData
                filtroDataInput.value = dataAtualFormatada;

                // Aplicar o filtro inicialmente
                aplicarFiltro(dataAtualFormatada);
                somaTotal(dataAtualFormatada);
                somaDinheiro(dataAtualFormatada);
                somaPix(dataAtualFormatada);
                somaCartao(dataAtualFormatada);
            };

            filterInital();

            // Evento de escuta ao input filtroData para aplicar o filtro quando a data é alterada--------
            filtroDataInput.addEventListener('change', function () {
                // Obtenha o valor do input filtroData
                const dataFiltro = filtroDataInput.value;

                // Aplicar o filtro quando a data é alterada
                aplicarFiltro(dataFiltro);
                somaTotal(dataFiltro);
                somaDinheiro(dataFiltro);
                somaPix(dataFiltro);
                somaCartao(dataFiltro);
            });
            //-------------------------------------------------------------------------------------------------------


            document.getElementById('imprimirRelatorio').addEventListener('click', function () {
                // Lógica para gerar e exibir o relatório
                gerarRelatorio();
            });

            function gerarRelatorio() {
                // Obtenha as datas selecionadas (você pode usar um modal para a entrada de datas)
                const dataInicio = document.getElementById('dataInicio').value; // Substitua 'dataInicio' pelo ID real do campo
                const dataFim = document.getElementById('dataFim').value; // Substitua 'dataFim' pelo ID real do campo

                // Ajuste para incluir o último dia corretamente
                const dataFimAjustada = new Date(dataFim);
                dataFimAjustada.setDate(dataFimAjustada.getDate() + 1);

                // Consulte o Firestore para obter dados entre as datas selecionadas
                db.collection('registrosEntregas')
                    .where('horario', '>=', new Date(dataInicio).getTime())
                    .where('horario', '<=', dataFimAjustada.getTime())
                    .get()
                    .then((querySnapshot) => {
                        // Processar os resultados da consulta e gerar relatório
                        const relatorioData = processarDados(querySnapshot);

                        // Exibir relatório em um modal
                        exibirRelatorioNoModal(relatorioData);
                    })
                    .catch((error) => {
                        console.error('Erro ao obter dados do Firestore:', error);
                    });
            }

            function processarDados(querySnapshot) {
                let relatorioData = {
                    total: 0,
                    totalQtd: 0,
                    totalDinheiro: 0,
                    totalCartao: 0,
                    totalPix: 0,
                    dadosPorDia: [],
                };

                querySnapshot.forEach((doc) => {
                    const registro = doc.data();
                    const valor = parseInt(registro.valor, 10);
                    const qtd = parseInt(registro.qtd, 10);

                    relatorioData.total += valor;
                    relatorioData.totalQtd += qtd;

                    if (registro.pagamento.includes('Dinheiro')) {
                        relatorioData.totalDinheiro += valor;
                    } else if (registro.pagamento === 'Cartão') {
                        relatorioData.totalCartao += valor;
                    } else if (registro.pagamento === 'Pix') {
                        relatorioData.totalPix += valor;
                    }

                    const dataRegistro = new Date(registro.horario).toLocaleDateString();

                    // Verifique se já existe uma entrada para este dia
                    const diaExistente = relatorioData.dadosPorDia.find((dia) => dia.data === dataRegistro);

                    if (diaExistente) {
                        diaExistente.valorTotal += valor;
                        diaExistente.qtdTotal += qtd;
                    } else {
                        relatorioData.dadosPorDia.push({ data: dataRegistro, valorTotal: valor, qtdTotal: qtd });
                    }

                });


                console.log(relatorioData)

                return relatorioData;

            }

            // Função para exibir o relatório no modal
            function exibirRelatorioNoModal(relatorioData) {
                // Atualiza o conteúdo do modal com o HTML do relatório
                const modalContent = document.getElementById('relatorioConteudo');

                // Monta o HTML do relatório
                const relatorioHTML = `
            <div class="relatorioHTML">
                <h2>Relatório de Vendas</h2>
                <p><strong>Valor Total:</strong> R$ ${relatorioData.total.toFixed(2)}</p>
                <p><strong>Quantidade Total:</strong> ${relatorioData.totalQtd}</p>
                <div class="Container-SPL">
                    <div class="bloco-SPL"><p><strong>Total em Dinheiro:</strong> </br> R$ ${relatorioData.totalDinheiro.toFixed(2)}</p></div>
                    <div class="bloco-SPL"><p><strong>Total em Cartão:</strong> </br> R$ ${relatorioData.totalCartao.toFixed(2)}</p></div>
                    <div class="bloco-SPL"><p><strong>Total em Pix:</strong> </br> R$ ${relatorioData.totalPix.toFixed(2)}</p></div>
                </div>
            </div>
            <div>
                <h3>Dados por Dia</h3>
                <ul>
                    ${relatorioData.dadosPorDia.map((dia) => `
                        <li>
                            <strong>${dia.data}:</strong> 
                            R$ ${dia.valorTotal.toFixed(2)} (Quantidade: ${dia.qtdTotal})
                            <p style="width: calc(${dia.qtdTotal}px + 20px);" class="barra"></p>
                        </li>`
                ).join('')}
                </ul>
            </div>
        `;

                // Atualiza o conteúdo do modal com o HTML do relatório
                modalContent.innerHTML = relatorioHTML;


            }

            // Evento de clique no botão para abrir o modal
            document.getElementById('abrirRelatorioBtn').addEventListener('click', function () {

                const alertModalRel = document.getElementById('relatorioModal');
                alertModalRel.style.display = 'flex';

                // Chama a função para exibir o relatório no modal
                exibirRelatorioNoModal(relatorioHTML);
            });

            // Função para imprimir o relatório
            document.getElementById('PrintRelatorio').addEventListener('click', function () {
                const conteudoParaImprimir = document.getElementById('relatorioConteudo').innerHTML;
                const periodoRelatorio = `Período do Relatório: ${document.getElementById('dataInicio').value} a ${document.getElementById('dataFim').value}`;
                const janelaImprimir = window.open('', '', 'width=800,height=600');
                janelaImprimir.document.write('<html><head><title>Relatório</title></head><body>');
                janelaImprimir.document.write(`<h4>${periodoRelatorio}</h4>`);
                janelaImprimir.document.write(conteudoParaImprimir);
                janelaImprimir.document.write('</body></html>');
                janelaImprimir.document.close();
                janelaImprimir.print();
            });
        })
    }
})





export function registrarComanda() {

    // Chame a função de registro aqui (a mesma lógica que no submit do formulário)
    let cliente = document.getElementById('cliente').value;
    let pagamento = document.getElementById('pagamento').value;
    let valor = document.getElementById('valor').value;
    let entregador = document.getElementById('entregador').value;
    let codBarra = document.getElementById('numberBarCode').innerText;
    let qtd = document.getElementById('qtd').value;



    if (cliente != "") {
        // Inserir e criar coleção caso não exista.
        db.collection('registrosEntregas').add({
            color: 'red',
            cliente: cliente,
            pagamento: pagamento,
            horario: new Date().getTime(),
            userId: usuario.uid,
            valor: valor,
            hora01: "--:--",
            hora02: "--:--",
            entregador: entregador,
            qtd: qtd,
            codBarra: codBarra
        });
    } else {
        alert("Cliente Vazio");
    }

};
