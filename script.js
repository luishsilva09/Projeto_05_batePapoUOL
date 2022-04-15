let nomeUsuario = {}

let idInterval = setInterval(statusUsuario, 4000)

function entrarSala() {
    nomeUsuario = { name: prompt("Digite seu nome:") };
    console.log(nomeUsuario)

    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants ', nomeUsuario)
    promise.then(usuarioAceito)
    promise.catch(usuarioRecusado)
}
function usuarioAceito(response) {
    let statusCode = response.status;
}
//trato caso o nome ja esteja sendo usado
function usuarioRecusado(error) {
    let statusCode = error.response.status;
    if (statusCode === 400) {
        alert('o nome que escolheu já está sendo usado, escolha outro')
        entrarSala()
    }
}
// para manter o usuario conectado usando o interval 
function statusUsuario() {
    const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', nomeUsuario)

}
//atualização e busca das mensagens
let atualizaMsg = setInterval(buscarMensagens, 3000)

function buscarMensagens() {
    const promise = axios.get('https://mock-api.driven.com.br/api/v6/uol/messages')
    promise.then(mensagens)
}
function mensagens(response) {
    let dados = response.data

    let mensagens = document.querySelector(".container");

    mensagens.innerHTML = ''
    for (let i = 0; i < dados.length; i++) {
        if (dados[i].type === "message") {
            mensagens.innerHTML +=
                `<div class="todos">(${dados[i].time}) ${dados[i].from} ${dados[i].text}</div>`
        }
        if (dados[i].type === "status") {
            mensagens.innerHTML +=
                `<div class="status">(${dados[i].time}) ${dados[i].from} ${dados[i].text}</div>`

        }
        if (dados[i].type === "private_message" && dados[i].to === nomeUsuario.name) {
            mensagens.innerHTML +=
                `<div class="reservadas">(${dados[i].time}) ${dados[i].from} ${dados[i].text}</div>`

        }
        mensagens.scrollIntoView(false)

    }}

    function enviarMensagem() {
        let texto = document.querySelector(".mensagem").value
        let mensagem = {
            'from': nomeUsuario.name,
            'to': "Todos",
            'text': texto,
            'type': "message"
        }
        console.log(mensagem)
        const promise = axios.post('https://mock-api.driven.com.br/api/v6/uol/messages', mensagem)
        promise.then(function(){
            document.querySelector(".mensagem").value = ''
        });
        
    }

entrarSala()
buscarMensagens()
