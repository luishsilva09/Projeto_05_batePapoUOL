let nomeUsuario = {}


//pego dados que o usuario me passa
function entrarSala() {

    let nome = document.querySelector(".nome").value;

    nomeUsuario = {
        'name': nome
    };

    esperando();

}
//gero uma pagina de espera
function esperando() {
    document.querySelector(".nome").classList.add("esconde");
    document.querySelector(".botao").classList.add("esconde");
    document.querySelector(".load").classList.remove("esconde");
    document.querySelector(".telaInicial > h2").classList.remove("esconde");

    setTimeout(entrando, 2000);

}
//faço a request para entrar no servidor
function entrando() {
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants ', nomeUsuario);
    promise.then(usuarioAceito);
    promise.catch(usuarioRecusado);

}
//trato os dados caso servidor me responda ok
function usuarioAceito(response) {
    const tela = document.querySelector(".telaInicial");
    tela.classList.add("esconde");
    let idInterval = setInterval(statusUsuario, 4000);
    let atualizaMsg = setInterval(buscarMensagens, 3000);
    let statusCode = response.status;
    buscarMensagens();
}
//trato caso o nome ja esteja sendo usado
function usuarioRecusado(error) {
    let statusCode = error.response.status;
    if (statusCode === 400) {
        alert("Nome de usuario já utilizado escolha outro")
        window.location.reload();
    }
}
// para manter o usuario conectado usando o interval 
function statusUsuario() {
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', nomeUsuario);

}
//atualização e busca das mensagens


function buscarMensagens() {

    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages');
    promise.then(mensagens);
}
// faz a filtragem das mensagens
function mensagens(response) {
    let dados = response.data;

    let mensagens = document.querySelector(".container");

    mensagens.innerHTML = ''
    for (let i = 0; i < dados.length; i++) {
        if (dados[i].type === "message" && dados[i].to === "Todos") {
            mensagens.innerHTML +=
                `<div class="todos">(${dados[i].time}) <b>${dados[i].from}</b> para <b>${dados[i].to}</b>: ${dados[i].text}</div>`
        };
        if (dados[i].type === "status") {
            mensagens.innerHTML +=
                `<div class="status">( ${dados[i].time} ) <b>${dados[i].from}</b> ${dados[i].text}</div>`

        };
        if (dados[i].type === "private_message" && dados[i].to === nomeUsuario.name) {
            mensagens.innerHTML +=
                `<div class="reservadas">( ${dados[i].time} ) ${dados[i].from}: ${dados[i].text}</div>`

        };
        mensagens.scrollIntoView(false);

    }
}
//enviar mensagem
function enviarMensagem() {
    let texto = document.querySelector(".mensagem").value;
    if(texto !== ""){
        let mensagem = {
            'from': nomeUsuario.name,
            'to': "Todos",
            'text': texto,
            'type': "message"
        };
        console.log(mensagem);
        const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', mensagem);
        promise.then(function () {
            document.querySelector(".mensagem").value = ''
        });
        promise.catch(function () {
            alert("Você ficou offline ");
            window.location.reload();
        });
    };
    

};
function participantes() {
    document.querySelector(".lateral").classList.remove("esconde");
    setInterval(atualizaLista, 10000);
    atualizaLista();
};
function retornaMensagem() {
    document.querySelector(".lateral").classList.add("esconde");
};
function atualizaLista(){
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/participants')
    promise.then(function (response) {
        document.querySelector(".listaParticipantes").innerHTML = '<div class="participante"><ion-icon name="people" ></ion-icon>Todos</div>';
        let dadosNome = response.data;
        for (let i = 0; i < dadosNome.length; i++) {
            document.querySelector(".listaParticipantes").innerHTML +=
                `<div class="participante"><ion-icon name="person-circle"></ion-icon>${dadosNome[i].name}</div>`
        };
    });
};
// fazer enviar mensagem com enter
const inputEle = document.querySelector(".mensagem");
inputEle.addEventListener('keyup', function (e) {
    let key = e.keyCode;
    if (key == 13) {
        enviarMensagem();
    }
});
//entrar apertando enter
document.querySelector(".nome").value = '';
let inputNome = document.querySelector(".nome");
inputNome.addEventListener('keyup', function (e) {
    let key = e.keyCode;
    if (key == 13) {
        entrarSala();
    }
});


