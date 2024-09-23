function telaCheia () {
    let containerHome01 = document.querySelector('.container-home-01');
    let containerHome02 = document.querySelector('.container-home-02');

    containerHome02.classList.toggle('telaCheia');
    containerHome01.classList.toggle('Ocultar');

};

document.addEventListener('DOMContentLoaded', function () {
    checkAlert();
    setInterval(checkAlert, 1800000); // Verifica a cada 30 minutos
});

function checkAlert() {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const dayOfMonth = today.getDate();
    const hours = today.getHours();

    // Verifica se é quarta-feira (3) entre 8h e 15h ou sábado (6) entre 8h e 10h
    if ((dayOfWeek === 3 && hours >= 8 && hours < 15) || (dayOfWeek === 6 && hours >= 8 && hours < 10)) {
        showOrHideAlert();
    }

    // Verifica se é dia 5 ou 6 de qualquer mês e entre 8h e 20h
    if ((dayOfMonth === 5 || dayOfMonth === 23) && hours >= 8 && hours < 20) {
        showOrHideAlert02();
    }
}

function showOrHideAlert() {
    const alertModal = document.getElementById('alertModal');

    // Verifica se o alerta já foi desativado para o dia atual
    if (isAlertDisabled()) {
        alertModal.style.display = 'none';
    } else {
        alertModal.style.display = 'flex';
    }
}

function showOrHideAlert02() {
    const alertModal02 = document.getElementById('alertModal02');

    // Verifica se o alerta já foi desativado para o dia atual
    if (isAlertDisabled()) {
        alertModal02.style.display = 'none';
    } else {
        alertModal02.style.display = 'flex';
    }
}

function closeAlert02() {
    const alertModal02 = document.getElementById('alertModal02');
    alertModal02.style.display = 'none';
}

function disableAlert02() {
    closeAlert02();

    // Armazena um indicador de que o alerta foi desativado para o dia atual
    const today = new Date();
    localStorage.setItem(getStorageKey(today), 'disabled');
}


function closeAlert() {
    const alertModal = document.getElementById('alertModal');
    alertModal.style.display = 'none';
}

function disableAlert() {
    closeAlert();

    // Armazena um indicador de que o alerta foi desativado para o dia atual
    const today = new Date();
    localStorage.setItem(getStorageKey(today), 'disabled');
}

function isAlertDisabled() {
    const today = new Date();
    return localStorage.getItem(getStorageKey(today)) === 'disabled';
}

function getStorageKey(date) {
    // Crie uma chave única com base na data (dia, mês e ano)
    return `alert_disabled_${date.getDate()}_${date.getMonth()}_${date.getFullYear()}`;
}