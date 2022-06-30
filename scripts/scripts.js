const urlAPI = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes/";
let quizes = []; 

const promessa = axios.get(urlAPI);
promessa.then(processarResposta);

function processarResposta(jogos){
    console.log(jogos.data);
    quizes = jogos.data;

    renderizarQuizzes();
}

function renderizarQuizzes(){

    const ul = document.querySelector('.quizzes');

    for(let i = 0; i < 6; i++){

        ul.innerHTML += `
            <div class="quizz" onclick="selecionarQuiz(this)">
                <img src="${quizes[i].image}">
                <p class="id-quiz">${quizes[i].id}</p>
                <div><h3>${quizes[i].title}</h3></div>
            </div>
        `;
    }
}

renderizarQuizzes();




/*SCRIPTS PARA A PÁGINA 2*/


/*FUNÇÃO QUE SELECIONA UM QUIZ DA PÁGINA 1*/
function selecionarQuiz (elemento) {

    console.log("clicou");
    console.log(elemento.querySelector(".id-quiz").innerHTML);
    quizID = elemento.querySelector(".id-quiz").innerHTML;

    const requisicao = axios.get(`${urlAPI}${quizID}`);

    requisicao.then (checarQuiz);
    requisicao.catch(erroAbrirQuiz);
}

/*SE A REQUISIÇÃO DO AXIOS DEU CERTO, EXECUTA ESSA FUNÇÃO*/
function checarQuiz(resposta) {
    const codigo = resposta.status; //variável para visualizar o código de retorno que ta dando
    const objQuiz = resposta.data;
    console.log(codigo);
    console.log(objQuiz);

    esconderTela1();
    abrirQuiz(objQuiz);
}


/*FUNÇÃO MALANDRA PARA MUDAR DE TELAS*/
function esconderTela1 () {
    const pagina1 = document.querySelector(".pagina1");
    const pagina2 = document.querySelector(".pagina2");

    pagina1.classList.add("escondido");
    pagina2.classList.remove("escondido");

}

/*FUNÇÃO PARA RENDERIZAR A PÁGINA DO QUIZ (TELA 2)*/
function abrirQuiz (vetor) {
    const pagina = document.querySelector(".pagina2");

    let qtdPerguntas = vetor.questions.length;
    let perguntas = vetor.questions;
    console.log(perguntas);
    console.log(`quantidade de perguntas: ${qtdPerguntas}`);


    //RASCUNHO DE COMO É O FOR
    // for (let i=0; i<qtdPerguntas; i++) {
    //     for (let j=0; j < perguntas[i].answers.length; j++) {
    //         console.log(perguntas[i].answers[j].text);
    //     }
    // }

    pagina.innerHTML = "";

    pagina.innerHTML = `
        <div class="capa-quiz">
            <p>${vetor.title}</p>
        </div>
        `;
    for (let i=0; i < qtdPerguntas; i++) {
        

        pagina.innerHTML += `
        <div class="caixa-pergunta">
            <div class="titulo-pergunta">
                <h2>${perguntas[i].title}</h2>
            </div>
            ${renderizarRespostas(perguntas,i,pagina)}
        </div>
        `
        
    }
}


function renderizarRespostas (perguntas,i,pagina) {

    for (let j=0; j < perguntas[i].answers.length; j++) {
        pagina.innerHTML += `
        <div class="respostas">
            <div class="resposta">
                <img src="${perguntas[i].answers[j].image}" alt="">
                <p>${perguntas[i].answers[j].text}</p>
            </div>
        </div>
    `
    }
    return pagina.innerHTML;
}

/*CASO DÊ ALGUM PROBLEMA NA REQUISIÇÃO GET, ESSA FUNÇÃO RODA*/
function erroAbrirQuiz(erro) {
    const codigo = erro.response.status;
    if (codigo !== 200) {
        alert("mano, deu ruim ao abrir esse quiz.");
    }
    //renderiza mais uma vez os quizes para o usuário escolher.
    renderizarQuizzes();
}