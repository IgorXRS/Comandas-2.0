
    //Seleção de Menu
    let menuItem = document.querySelectorAll('.item-menu');
  
    function selectLink() {
      menuItem.forEach(function(item) {
        item.classList.remove('ativo');
      });
      this.classList.add('ativo');
    }
  
    menuItem.forEach(function(item) {
      item.addEventListener('click', selectLink);
    });
  
    //Expandir o menu
    let btnExp = document.querySelector('#btn-exp');
    let menuSide = document.querySelector('.menu-lateral');
    let loginResp = document.getElementById('backLogin');
    let logadoResp = document.getElementById('backLogado');
    let pontoResp = document.getElementById('backPonto');
    let comandaResp = document.getElementById('backComanda');
    let homeResp = document.getElementById('backHome');

  
    btnExp.addEventListener('click', function() {
      menuSide.classList.toggle('expandir');
      loginResp.classList.toggle('expandir');
      logadoResp.classList.toggle('expandir');
      pontoResp.classList.toggle('expandir');
      comandaResp.classList.toggle('expandir');
      homeResp.classList.toggle('expandir');
    });

    //Seleção de Menu 02

    let menuAba = document.querySelectorAll('.btn-lateral');
  
    function selectLinkAba() {
        menuAba.forEach(function(item) {
        item.classList.remove('ativado');
      });
      this.classList.add('ativado');
    }
  
    menuAba.forEach(function(item) {
      item.addEventListener('click', selectLinkAba);
    });