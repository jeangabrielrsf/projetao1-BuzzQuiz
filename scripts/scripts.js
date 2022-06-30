const urlAPI = "https://mock-api.driven.com.br/api/v7/buzzquizz/quizzes/";
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


//renderizarQuizzes();




/*SCRIPTS PARA A PÁGINA 2*/


/*FUNÇÃO QUE SELECIONA UM QUIZ DA PÁGINA 1*/
function selecionarQuiz (elemento) {

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
    if (codigo === 200) {
        esconderTela1();
        abrirQuiz(objQuiz);
    }
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
    const pagina = document.querySelector(".pagina2 .caixa-pergunta");
    let capa = document.querySelector(".pagina2")

    let qtdPerguntas = vetor.questions.length;
    let perguntas = vetor.questions;
    
    console.log(`quantidade de perguntas: ${qtdPerguntas}`);


    //RASCUNHO DE COMO É O FOR
    // for (let i=0; i<qtdPerguntas; i++) {
    //     for (let j=0; j < perguntas[i].answers.length; j++) {
    //         console.log(perguntas[i].answers[j].text);
    //     }
    // }

    capa.innerHTML = "";
    pagina.innerHTML = "";

    capa.innerHTML += `
        <div class="capa-quiz" style="background-image: linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${vetor.image})">
            <p>${vetor.title}</p>
        </div>
        `;
    for (let i=0; i < qtdPerguntas; i++) {
        
        console.log(`pergunta ${i}`);
        pagina.innerHTML += `
            <div class="caixa-pergunta">
                <div class="titulo-pergunta" style="background-color: ${perguntas[i].color}">
                    <h2>${perguntas[i].title}</h2>
                </div>
                <div class="respostas">
                    ${renderizarRespostas(perguntas,i)}
                </div>
            </div>
        `;
    }
    capa.innerHTML += pagina.innerHTML;
}


function renderizarRespostas (perguntas,i) {
    let respostas = "";
    console.log(respostas);
    let qtdRespostas = perguntas[i].answers.length;
    console.log(`quantidade de respostas: ${qtdRespostas}`);
    for (let j=0; j < qtdRespostas; j++) {
        console.log(`resposta ${j}`);
        respostas += `
            <div class="resposta">
                <p class="escondido">${perguntas[i].answers[j].isCorrectAnswer}</p>
                <img src="${perguntas[i].answers[j].image}" alt="">
                <p>${perguntas[i].answers[j].text}</p>
            </div>
        `;
    }
    return respostas;
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


function selecionarResposta(elemento) {
    console.log(elemento.innerHTML);
    console.log(elemento);

}