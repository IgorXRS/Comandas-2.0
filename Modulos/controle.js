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

        // Armazenando o email no localStorage
        localStorage.setItem('emailUsuarioLogado', usuario.email); // Armazena o email

        // Obter a data atual
        const hoje = new Date();
        const anoAtual = hoje.getFullYear().toString().padStart(4, '0');
        const mesAtual = (hoje.getMonth() + 1).toString().padStart(2, '0');
        const diaAtual = hoje.getDate().toString().padStart(2, '0');
        const dataAtual = anoAtual + mesAtual + diaAtual;

        //Ouvir por mudanças no banco de dados.

        db.collection('registrosEntregas')
            .where("userId", "==", usuario.uid)
            .where("codBarra", ">=", dataAtual + "0000") // maior ou igual ao começo do dia atual
            .where("codBarra", "<=", dataAtual + "9999") // menor ou igual ao final do dia atual
            .onSnapshot((data) => {
                let list = document.querySelector('#registrosEntregas');
                list.innerHTML = "";
                let registrosEntregas = data.docs;
                registrosEntregas = registrosEntregas.sort(function (a, b) {
                    if (a.data().horario < b.data().horario)
                        return +1;
                    else
                        return -1;
                });
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
                        <div class="tempBloco">
                            <h5><i class="bi bi-clock-history"></i> Espera: ${val.data().tempoEspera || 0} min</h5>
                            <h5><i class="bi bi-clock-history"></i> Entrega: ${val.data().tempoEntrega || 0} min</h5>
                        </div>
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

                                        const dataAtualHora0 = new Date(doc.data().horario);
                                        const horaHora0 = dataAtualHora0.getHours();
                                        const minutosHora0 = dataAtualHora0.getMinutes();

                                        const horaFormatadaHora0 = `${horaHora0 < 10 ? '0' + horaHora0 : horaHora0}:${minutosHora0 < 10 ? '0' + minutosHora0 : minutosHora0}`;


                                        // Converter as strings para objetos de data
                                        let hora1 = new Date(`2000-01-01T${doc.data().hora01}:00`);
                                        let hora2 = new Date(`2000-01-01T${horaFormatada}:00`);
                                        let hora0 = new Date(`2000-01-01T${horaFormatadaHora0}:00`);

                                        // Calcular a diferença em milissegundos
                                        let tempoEntrega = hora2 - hora1;
                                        let tempoEspera = hora1 - hora0;

                                        // Converter a diferença de milissegundos para minutos
                                        let tempoEntregaFormatado = Math.floor(tempoEntrega / (1000 * 60));
                                        let tempoEsperaFormatado = Math.floor(tempoEspera / (1000 * 60));
                                        let tempoAtendimento = tempoEntregaFormatado + tempoEsperaFormatado;

                                        // Atualiza o registro com a nova informação
                                        registroRef.update({
                                            color: 'green',
                                            tempoEntrega: tempoEntregaFormatado,
                                            tempoEspera: tempoEsperaFormatado,
                                            tempoAtendimento: tempoAtendimento,
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

/*

db.collection('registrosEntregas')
            .onSnapshot((data) => {
                // Tempo medio de entregas

                let tempoMedioPorBairro = {};
                let registrosEntregas = data.docs;

                const MIN_TEMPO_ENTREGA = 3;

                registrosEntregas.forEach(entrega => {

                    let bairro = entrega.data().bairro;
                    let tempoEntrega = entrega.data().tempoEntrega || 0;;
                    let tempoEspera = entrega.data().tempoEspera || 0;;
                    let tempoAtendimento = entrega.data().tempoAtendimento || 0;;

                    
                    if (!tempoMedioPorBairro[bairro]) {
                        tempoMedioPorBairro[bairro] = {
                            totalTempoEntrega: 0,
                            totalTempoEspera: 0,
                            totalTempoAtendimento: 0,
                            quantidade: 0
                        };
                    }
                    tempoMedioPorBairro[bairro].totalTempoEntrega += tempoEntrega;
                    tempoMedioPorBairro[bairro].totalTempoEspera += tempoEspera;
                    tempoMedioPorBairro[bairro].totalTempoAtendimento += tempoAtendimento;
                    if (tempoEntrega >= MIN_TEMPO_ENTREGA & tempoEspera >= MIN_TEMPO_ENTREGA & tempoAtendimento >= MIN_TEMPO_ENTREGA) {
                    tempoMedioPorBairro[bairro].quantidade++;
                    }
                    console.log(bairro);
                });

                // Calcular o tempo médio para cada bairro
                for (let bairro in tempoMedioPorBairro) {
                    let totalEntrega = tempoMedioPorBairro[bairro].totalTempoEntrega;
                    let totalEspera = tempoMedioPorBairro[bairro].totalTempoEspera;
                    let totalAtendimento = tempoMedioPorBairro[bairro].totalTempoAtendimento;
                    let quantidade = tempoMedioPorBairro[bairro].quantidade;
                    console.log(quantidade)

                    tempoMedioPorBairro[bairro].tempoMedioEntrega = totalEntrega / quantidade || 0;
                    tempoMedioPorBairro[bairro].tempoMedioEspera = totalEspera / quantidade  || 0;
                    tempoMedioPorBairro[bairro].tempoMedioAtendimento = totalAtendimento / quantidade  || 0;
                }

                let graficoAnalise = document.querySelector('#graficoAnalise');
                graficoAnalise.innerHTML = "";

                let bairros = new Set();
                registrosEntregas.forEach(entrega => {
                    let bairro = entrega.data().bairro;
                    bairros.add(bairro); // Adiciona o bairro ao Set, garantindo que não haja repetições
                });
                let bairrosUnicos = Array.from(bairros);

                bairrosUnicos.forEach(bairro => {
                
                     // Verificar se o bairro já foi exibido
                        let tempoMedioDeEspera = Math.round((tempoMedioPorBairro[bairro].tempoMedioEspera * 100) / 100);
                        let tempoMedioDeEntrega = Math.round((tempoMedioPorBairro[bairro].tempoMedioEntrega * 100) / 100);
                        let tempoMedioDeAtendimento = Math.round((tempoMedioPorBairro[bairro].tempoMedioAtendimento * 100) / 100);
                        console.log(tempoMedioDeAtendimento)
                
                        graficoAnalise.innerHTML += `
                            <div class="bairroBloco">
                                <div class="barrasBloco">
                                    <div class="barraEspera" style="height: ${tempoMedioDeEspera + 20}px;"><p>${isFinite(tempoMedioDeEspera) ? `${tempoMedioDeEspera} min` : '0 min'}</p></div>
                                    <div class="barraEntrega" style="height: ${tempoMedioDeEntrega + 20}px;"><p>${isFinite(tempoMedioDeEntrega) ? `${tempoMedioDeEntrega} min` : '0 min'}</p></div>
                                    <div class="barraAtendimento" style="height: ${tempoMedioDeAtendimento + 20}px;"><p>${isFinite(tempoMedioDeAtendimento) ? `${tempoMedioDeAtendimento} min` : '0 min'}</p></div>
                                </div>
                                <div class="bairroText">
                                    <h4>${bairro}</h4>
                                </div>
                            </div>
                        `;
                
                    
                });




                //---------------------------------------------------------------------------------------------------
            })

*/

export function registrarComanda() {

    // Chame a função de registro aqui (a mesma lógica que no submit do formulário)
    let cliente = document.getElementById('cliente').value;
    let pagamento = document.getElementById('pagamento').value;
    let pagamento01 = document.getElementById('pagamento01').value;
    let pagamento02 = document.getElementById('pagamento02').value;
    let valor = document.getElementById('valor').value;
    let valor01 = document.getElementById('valor01').value;
    let valor02 = document.getElementById('valor02').value;
    let entregador = document.getElementById('entregador').value;
    let codBarra = document.getElementById('numberBarCode').innerText;
    let qtd = document.getElementById('qtd').value;



    if (pagamento === "MultFormPag") {
        var pagamentoForm = pagamento01;
        var valorform = parseFloat(valor01) + parseFloat(valor02);
    } else {
        if (pagamento === "Pago") {
            var pagamentoForm = "Dinheiro";
            var valorform = valor;
        } else {
            var pagamentoForm = pagamento;
            var valorform = valor;
        }
    }



    if (cliente != "") {
        // Inserir e criar coleção caso não exista.
        db.collection('registrosEntregas').add({
            color: 'red',
            cliente: cliente,
            pagamento: pagamentoForm,
            horario: new Date().getTime(),
            userId: usuario.uid,
            valor: valorform,
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


//---------------------------------------------------------------------------------------------------
// Lista de vendedores
const vendedores01 = ['Carla', 'Carlos', 'Gilson', 'Gislaine', 'Igor', 'Mário'];
const vendedores02 = ['Alex', 'Adílio', 'Carol', 'Érica', 'Ivan', 'Rivaldo', 'Stella'];

function obterEmailUsuarioLogado() {
    const email = localStorage.getItem('emailUsuarioLogado'); // Obtém o email do localStorage
    if (email) {
        return email; // Retorna o email se existir
    } else {
        console.log("Nenhum usuário logado.");
        return null; // Retorna null se não houver email armazenado
    }
}

// Uso da função
const emailUsuarioLogado = obterEmailUsuarioLogado();
console.log(emailUsuarioLogado); // Exibe o email do us
// Selecionar o grupo de vendedores com base no email
let vendedores;
if (emailUsuarioLogado === 'embaixadordoscosmeticos@gmail.com') {
    vendedores = vendedores01;
} else if (emailUsuarioLogado === 'drogariabrasil1maisvoce@gmail.com') {
    vendedores = vendedores02;
} else {
    // Tratamento caso o email não corresponda a nenhum grupo
    console.error("Email do usuário não reconhecido.");
}

function aplicarFiltro02(data) {
    // Obter a data do primeiro dia do mês e a data atual
    const dataAtual = new Date();
    const primeiroDiaDoMes = new Date(dataAtual.getFullYear(), dataAtual.getMonth(), 1);

    // Limpar a tabela de atendimentos
    const tbody = document.querySelector('tbody');
    tbody.innerHTML = "";

    // Objeto para armazenar dados dos vendedores
    const atendimentosPorVendedor = {};

    // Inicializar contadores para cada vendedor
    vendedores.forEach(vendedor => {
        atendimentosPorVendedor[vendedor] = {
            total: 0,
            finalizados: 0,
            aguardando: 0
        };
    });

    // Iterar sobre os documentos recuperados do Firestore
    data.forEach((doc) => {
        const registro = doc.data();
        const dataRegistro = new Date(registro.horario);

        // Verificar se a data do registro está entre o primeiro dia do mês e a data atual
        if (dataRegistro >= primeiroDiaDoMes && dataRegistro <= dataAtual) {
            const vendedor = registro.entregador;

            // Atualizar contadores para o vendedor
            if (atendimentosPorVendedor[vendedor]) {
                atendimentosPorVendedor[vendedor].total++;

                if (registro.hora02 !== "--:--") {
                    atendimentosPorVendedor[vendedor].finalizados++;
                } else {
                    atendimentosPorVendedor[vendedor].aguardando++;
                }
            }
        }
    });

    // Criar um array de vendedores e ordenar por atendimentos finalizados
    const vendedoresOrdenados = Object.entries(atendimentosPorVendedor).sort((a, b) => {
        return b[1].finalizados - a[1].finalizados; // Ordenar do maior para o menor
    });

    // Preencher a tabela com os dados dos vendedores ordenados
    vendedoresOrdenados.forEach(([vendedor, { total, finalizados, aguardando }]) => {
        const novaLinha = document.createElement('tr');

        novaLinha.innerHTML = `
        <td>${vendedor}</td>
        <td>${finalizados}</td>
        <td>${aguardando}</td>
        <td>${total}</td>
    `;

        tbody.appendChild(novaLinha);
    });
}



// Função para buscar os dados do Firestore e depois aplicar o filtro
function carregarDados() {
    // Obter a data atual
    const hoje = new Date();
    // Obtenha as datas selecionadas (você pode usar um modal para a entrada de datas)
    const dataInicio = document.getElementById('dataInicioAtend').value; // Substitua 'dataInicio' pelo ID real do campo
    const dataFim = document.getElementById('dataFimAtend').value; // Substitua 'dataFim' pelo ID real do campo
    // Ajuste para incluir o último dia corretamente
    const dataFimAjustada = new Date(dataFim);
    dataFimAjustada.setDate(dataFimAjustada.getDate() + 1);
    // Supondo que você tenha um método para buscar os dados do Firestore
    db.collection('registrosEntregas')
        .where('horario', '>=', new Date(dataInicio).getTime())
        .where('horario', '<=', dataFimAjustada.getTime())
        .get()
        .then((snapshot) => {
            const data = snapshot.docs;
            aplicarFiltro02(data);  // Chamar a função com os dados
        })
        .catch((error) => {
            console.error("Erro ao carregar dados: ", error);
        });
}



function atualizarAtendimentosIgor() {
    const vendedor = 'Igor'; // Nome do vendedor a ser buscado

    // Consulta para buscar atendimentos do vendedor Igor
    db.collection('registrosEntregas') // Substitua 'atendimentos' pelo nome da sua coleção
        .where('entregador', '==', vendedor)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // Atualiza os campos hora01 e hora02
                db.collection('registrosEntregas').doc(doc.id).update({
                    hora01: '12:00',
                    hora02: '12:20'
                })
                    .then(() => {
                        console.log(`Atendimento ${doc.id} atualizado com sucesso.`);
                    })
                    .catch((error) => {
                        console.error("Erro ao atualizar atendimento: ", error);
                    });
            });
        })
        .catch((error) => {
            console.error("Erro ao buscar atendimentos: ", error);
        });
}

// Adicione um listener ao botão
document.getElementById('AtualizarInfos').addEventListener('click', carregarDados);


//--------------------------------------------------------------------------------------------------------

function alternarDisplay01() {
    const frenteContainer = document.querySelector('.frenteContainer');
    const fundoContainer = document.querySelector('.fundoContainer');

    frenteContainer.style.display = 'none';
    fundoContainer.style.display = 'flex';
}

function alternarDisplay02() {
    const frenteContainer = document.querySelector('.frenteContainer');
    const fundoContainer = document.querySelector('.fundoContainer');

    frenteContainer.style.display = 'flex';
    fundoContainer.style.display = 'none';
}


// Adicione um listener ao botão
document.getElementById('toggleButton01').addEventListener('click', alternarDisplay01);
// Adicione um listener ao botão
document.getElementById('toggleButton02').addEventListener('click', alternarDisplay02);