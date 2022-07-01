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
            <div class="quizz" style="background-image: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 65.1%, #000000 100%), url(${quizes[i].image})" onclick="selecionarQuiz(this)">
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



function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}



function renderizarRespostas (perguntas,i) {
    let respostas = "";
    console.log(respostas);
    let qtdRespostas = perguntas[i].answers.length;
    console.log(`quantidade de respostas: ${qtdRespostas}`);
    perguntas[i].answers.sort(shuffleArray(perguntas[i].answers));
    for (let j=0; j < qtdRespostas; j++) {
        console.log(`resposta ${j}`);
        respostas += `
            <div class="resposta" onclick="selecionarResposta(this)">
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
    console.log(elemento);
    const ehCorreta = elemento.querySelector(".escondido").innerHTML;
    const outras = document.querySelectorAll(".respostas")
    console.log(outras);
    let ehCorreta = elemento.querySelector(".escondido").innerHTML;
    let anterior = elemento.previousElementSibling;
    let proxima = elemento.nextElementSibling;
    console.log(ehCorreta);
    console.log(`anterior: ${anterior}`);
    console.log(`próxima: ${proxima}`);


    if (anterior === null) {
        if (proxima.classList.contains("opaco")) {
            alert("é o primeiro e já tem");
            return;
        }
    } else if (proxima === null) {
        if (anterior.classList.contains("opaco")) {
            alert("é o último e já tem ");
            return;
        }
    } else if (proxima.classList.contains("opaco") || anterior.classList.contains("opaco")) {
        console.log("já tem");
        return;
    }

}
    
    if (ehCorreta === "true") { /*se ele acertou*/
        elemento.classList.add("acertou");
        if (proxima !== null) {
            while (proxima !== null)  {
                console.log(proxima);
                if(!proxima.classList.contains("opaco")) {
                    proxima.classList.add("opaco");
                }
                if(!proxima.classList.contains("errou")) {
                    proxima.classList.add("errou");
                }
                proxima = proxima.nextElementSibling;
            }
        }

        if (anterior !== null) {
            while(anterior !== null) {
                console.log(anterior);
                if (!anterior.classList.contains("opaco")) {
                    anterior.classList.add("opaco");
                }
                if (!anterior.classList.contains("errou")) {
                    anterior.classList.add("errou");
                }
                anterior = anterior.previousElementSibling;
            }
        }

        } else { /*se ele errou a resposta*/
            elemento.classList.add("errou");
            if (proxima !== null) {
                while (proxima !== null)  {
                    if(!proxima.classList.contains("opaco")) {
                        proxima.classList.add("opaco");
                    
                        ehCorreta = proxima.querySelector(".escondido").innerHTML;
                        console.log(ehCorreta);
                        if(ehCorreta === "true") {
                            proxima.classList.add("acertou");
                        } else {
                            proxima.classList.add("errou");
                        }
                    }
                    proxima = proxima.nextElementSibling;
                }
            }
            if (anterior !== null) {
                while(anterior !== null) {
                    if (!anterior.classList.contains("opaco")) {
                        anterior.classList.add("opaco");
                        
                        ehCorreta = anterior.querySelector(".escondido").innerHTML;
                        if (ehCorreta === "true") {
                            anterior.classList.add("acertou");
                        } else {
                            anterior.classList.add("errou");
                        }
                    }
                    anterior = anterior.previousElementSibling;
                }
            }
        }



function scrollarPagina () {
    /* só deus sabe farei isso */
}
