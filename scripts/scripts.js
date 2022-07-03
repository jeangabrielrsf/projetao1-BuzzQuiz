const urlAPI = "https://mock-api.driven.com.br/api/v7/buzzquizz/quizzes/";
let quizes = quizesCriados = []; 
let escolhido; //variável para guardar o objeto de um quiz.
let erros = 0;
let acertos = 0;
let resultado = 0;


const promessa = axios.get(urlAPI);
promessa.then(processarResposta);

function processarResposta(jogos){
    console.log(jogos.data);
    quizes = jogos.data;

    renderizarQuizzes();
}

function renderizarQuizzes(){

    const ul = document.querySelector('.quizzes');

    for(let i = 0; i < 12; i++){

        ul.innerHTML += `
            <div class="quizz" style="background-image: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 65.1%, #000000 100%), url(${quizes[i].image})" onclick="selecionarQuiz(this)">
                <p class="id-quiz">${quizes[i].id}</p>
                <div><h3>${quizes[i].title}</h3></div>
            </div>
        `
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
    escolhido = resposta.data;
    
    if (codigo === 200) {
        esconderTela1();
        abrirQuiz();
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
function abrirQuiz () {
    erros = 0;
    acertos = 0;
    const pagina = document.querySelector(".pagina2 .caixa-pergunta");
    let capa = document.querySelector(".pagina2")

    let qtdPerguntas = escolhido.questions.length;
    let perguntas = escolhido.questions;
    
    


    //RASCUNHO DE COMO É O FOR
    // for (let i=0; i<qtdPerguntas; i++) {
    //     for (let j=0; j < perguntas[i].answers.length; j++) {
    //         console.log(perguntas[i].answers[j].text);
    //     }
    // }

    capa.innerHTML = "";
    pagina.innerHTML = "";

    capa.innerHTML += `
        <div class="capa-quiz" style="background-image: linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${escolhido.image})">
            <p>${escolhido.title}</p>
        </div>
        `;
    for (let i=0; i < qtdPerguntas; i++) {
        
        //console.log(`pergunta ${i}`);
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
    document.querySelector(".capa-quiz").scrollIntoView(true);
}



function renderizarFimQuizz(nivel) {
    let pagina = document.querySelector(".pagina2");
    let string = "";
    string = `
        <div class="fim-quizz">
            <div class="titulo-fim-quizz">
                <p>${resultado}% de acertos: ${nivel.title}</p>
            </div>
            <div class="caixa-texto-fim">
                <div class="imagem-fim">
                    <img src="${nivel.image}" alt="">
                </div>
                <div class="texto-fim">
                    <p>${nivel.text}</p>
                </div>
            </div>
        </div>
        <div class="botao-reiniciar" onclick="reiniciarQuizz()">
            <p>Reiniciar Quizz</p>
        </div>

        <div class="botao-voltar" onclick="voltarHomePg2()">
            <p>Voltar pra home</p>
        </div>
        
        `;
    pagina.innerHTML += string;
}


function reiniciarQuizz() {
    const titulo = document.querySelector(".capa-quiz");
    let fim = document.querySelector(".fim-quizz");
    let respostas = document.querySelectorAll(".resposta");

    fim.innerHTML = "";
    acertos = 0;
    erros = 0;
    resultado = 0;


    for (let i=0; i < respostas.length; i++) {
        if (respostas[i].classList.contains("opaco")) {
            respostas[i].classList.remove("opaco");
        }
        if (respostas[i].classList.contains("acertou")) {
            respostas[i].classList.remove("acertou");
        }
        if (respostas[i].classList.contains("errou")) {
            respostas[i].classList.remove("errou");
        }
    }

    titulo.scrollIntoView({behavior: "smooth", block:"start"});
    abrirQuiz();
}

function voltarHomePg2 () {
    pagina2 = document.querySelector(".pagina2");
    pagina1 = document.querySelector(".pagina1");
    pai = document.querySelector(".pai");

    pagina2.classList.add("escondido");
    pagina1.classList.remove("escondido");
    renderizarQuizzes();
    pai.scrollIntoView(true);
}


function calcularAcertos() {
    let niveis = escolhido.levels;
    console.log(niveis);
    let perguntas = escolhido.questions.length;
    let respondidas = acertos + erros;
    let nivel;
    let aux = 0;

    if (respondidas < perguntas) {
        console.log("ainda tem pergunta pra responder");
        return;
    } else {
        resultado = Math.round((acertos/perguntas) * 100);
        console.log(resultado);
        for (let i=0; i < niveis.length; i++) {
            if (resultado >= niveis[i].minValue) {
                if (niveis[i].minValue >= aux) {
                    nivel = niveis[i];
                    aux = nivel.minValue;
                }
            } 
        }
        
    }
    renderizarFimQuizz(nivel);
    mostrarFimQuizz();   
}



/* FUNÇAO PARA EMBARALHAR UM VETOR */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


/* FUNÇAO PARA RENDERIZAR AS RESPOSTAS DE UMA PERGUNTA.
   RECEBE COMO PARÂMETRO UM VETOR E O ÍNDICE ATUAL DELE. */

function renderizarRespostas (perguntas,i) {
    let respostas = "";
    //console.log(respostas);
    let qtdRespostas = perguntas[i].answers.length;
    //console.log(`quantidade de respostas: ${qtdRespostas}`);
    perguntas[i].answers.sort(shuffleArray(perguntas[i].answers));
    for (let j=0; j < qtdRespostas; j++) {
        //console.log(`resposta ${j}`);
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


/*FUNÇÃO PARA ESCOLHER UMA RESPOSTA CLICADA.
PODE MELHORAR MUITO, ENTÃO ESSA É A VERSÃO 1.0 */
function selecionarResposta(elemento) {
    console.log(elemento);
    const outras = document.querySelectorAll(".respostas")
    console.log(outras);
    //console.log(elemento);
    let ehCorreta = elemento.querySelector(".escondido").innerHTML;
    let anterior = elemento.previousElementSibling;
    let proxima = elemento.nextElementSibling;
    //console.log(ehCorreta);
    //console.log(`anterior: ${anterior}`);
    //console.log(`próxima: ${proxima}`);


    //se ele for o primeiro da lista e a próxima resposta já tiver a classe opaco : faz nada
    if (anterior === null) {
        if (proxima.classList.contains("opaco") || proxima.classList.contains("clicado")) {
            console.log("é o primeiro e já tem");
            return;
        }
    } else if (proxima === null) {
        //se ele for o último da lista e resposta anterior já tiver a classe opaco : faz nada.
        if (anterior.classList.contains("opaco") || anterior.classList.contains("clicado")) {
            console.log("é o último e já tem ");
            return;
        }
    } else if (proxima.classList.contains("opaco") || anterior.classList.contains("opaco")) {
        //se o elemento estiver no meio e ou a anterior ou a próxima resposta já tem opaco: faz nada.
        console.log("já tem");
        return;
    }

    
    if (ehCorreta === "true") { /*se ele acertou*/
        acertos += 1;
        elemento.classList.add("acertou");
        elemento.classList.add("clicado");

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
        erros += 1;
        elemento.classList.add("errou");
        elemento.classList.add("clicado");
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

    //criei uma função anônima para scrollar a tela depois de dois segundos.
    setTimeout(function () {
                            elementoPai = elemento.parentElement;
                            elementoVo = elementoPai.parentElement;
                            proxima = elementoVo.nextElementSibling;

                            if (proxima === null) {
                                console.log("função scroll: não tem mais pergunta");
                                return;
                            } else {
                                console.log("tem próxima");
                                proxima.scrollIntoView({block:"start", behavior:"smooth", inline:"center"});
                            }
                        },2000);
    calcularAcertos();
}




function mostrarFimQuizz() {
    /*implementando*/
    setTimeout(function () {
        fim = document.querySelector(".fim-quizz");        
        fim.scrollIntoView({block:"start", behavior:"smooth", inline:"nearest"});
    },2000);
}



// FUNÇÃO PARA POSTAR TITULO E A IMAGEM DO QUIZZ
function criarQuizz(){
    const pagina1 = document.querySelector('.pagina1');
    const pagina3 = document.querySelector('.pagina3');

    pagina1.classList.add("escondido");
    pagina3.classList.remove("escondido");
    criandoQuizz();
    
}

function postarTituloQuiz(){

    const tituloQuizz = document.querySelector("input:nth-child(1)").value;
    const imagemQuizz = document.querySelector("input:nth-child(2)").value;
    
    quizesCriados.push({
        title: tituloQuizz,
        image: imagemQuizz
    });
    console.log(quizesCriados);
}

// QUANTIDADE DE PERGUNTAS A SEREM CRIADAS
function quantidadePerguntas(){
    numeroPerguntas = 3
    const numeroPerguntas = document.querySelector("input:nth-child(3)").value
    console.log(numeroPerguntas);
}

// QUANTIDADE DE NÍVES A SEREM CRIADOS
function quantidadeNiveis(){

    const numeroNiveis = document.querySelector("input:nth-child(4)").value
    console.log(numeroNiveis);
}


function enviaTituloQuizz(){
    const grade1 = document.querySelector(".grade-1");
    const grade2 = document.querySelector(".grade-2");

    grade1.classList.add("escondido");
    grade2.classList.remove("escondido");
    postarTituloQuiz();
    criarPerguntas();
}

function prosseguiPraCriarNiveis(){
    const grade2 = document.querySelector(".grade-2");
    const grade3 = document.querySelector(".grade-3");

    grade2.classList.add("escondido");
    grade3.classList.remove("escondido");
    adicionandoRespostas();


}

function voltarPraHome(){
    const pagina3 = document.querySelector(".pagina3");
    const pagina1 = document.querySelector(".pagina1");

    pagina3.classList.add("escondido");
    pagina1.classList.remove("escondido");
}
// grade1
function criandoQuizz(){

    const infoQuizz = document.querySelector(".cx-dados-quizz");
    
    infoQuizz.innerHTML = `
    <form>
    <input type="text" class="cx-input" placeholder="Título do seu quizz" pattern="[A-Za-z].{1,20}">
    <input type="text" class="cx-input" placeholder="URL da imagem do seu quizz">
    <input type="text" class="cx-input" placeholder="Quantidade de perguntas do quizz">
    <input type="text" class="cx-input" placeholder="Quantidade de níveis do quizz">
    </form>
    `;

}

function criarPerguntas(){

    const perguntaQuizz = document.querySelector(".pergunta");

    perguntaQuizz.innerHTML = `
    <form>
    <input type="text" class="cx-input" placeholder="Texto da pergunta" pattern="[A-Za-z].{20,65}">
    <input type="color" class="cx-input" placeholder="Cor de fundo da pergunta">
    </form>
    `;

    const respostaTrue = document.querySelector(".resposta-correta")

    respostaTrue.innerHTML += `
    <form>
    <input type="text" class="cx-input" placeholder="Resposta correta">
    <input type="url" class="cx-input" placeholder="URL da imagem" pattern="https?://.+" title="Include http://">
    </form>
    `;



    const respostaFalse = document.querySelector(".resposta-incorreta")

    for(let i = 0; i < 3; i ++){
        respostaFalse.innerHTML += `    
        <form>
        <input type="text" class="cx-input" placeholder="Resposta incorreta">
        <input type="url" class="cx-input" placeholder="URL da imagem" pattern="https?://.+" title="Include http://">
        </form>
        `;
    
    }
  

}

    
function adicionandoRespostas(){

    const perguntadoQuizz = document.querySelector("input:nth-child(5)").value;
    const corQuizz = document.querySelector("input:nth-child(6)").value;
    
    quizesCriados[0][0].push({
        title: perguntadoQuizz,
        image: corQuizz
    });
    
    const respostaCorreta = document.querySelector("input:nth-child(7)").value;
    const imageRespostaCorreta = document.querySelector("input:nth-child(8)").value;

    quizesCriados[0][0][0].push({
        text: respostaCorreta,
        image: imageRespostaCorreta,
        isCorrectAnswer: true
    });

    const respostaIncorreta = document.querySelector("input:nth-child(9)").value;
    const imageRespostaIncorreta = document.querySelector("input:nth-child(10)").value;

    quizesCriados[0][0][1].push({
        text: respostaIncorreta,
        image: imageRespostaIncorreta
        isCorrectAnswer: false
    });

    const respostaIncorreta2 = document.querySelector("input:nth-child(11)").value;
    const imageRespostaIncorreta2 = document.querySelector("input:nth-child(12)").value;

    if((respostaIncorreta2 !== "") && (imageRespostaIncorreta2 !== "")){
        quizesCriados[0][0][2].push({
            text: respostaIncorreta2,
            image: imageRespostaIncorreta2,
            isCorrectAnswer: false
        });
    };

    const respostaIncorreta3 = document.querySelector("input:nth-child(13)").value;
    const imageRespostaIncorreta3 = document.querySelector("input:nth-child(14)").value;

    if((respostaIncorreta3 !== "") && (imageRespostaIncorreta3 !== "")){
        quizesCriados[0][0][3].push({
            text: respostaIncorreta3,
            image: imageRespostaIncorreta3,
            isCorrectAnswer: false
        });
    };
}