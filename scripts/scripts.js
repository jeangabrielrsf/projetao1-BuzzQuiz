const urlAPI = "https://mock-api.driven.com.br/api/vs/buzzquizz/quizzes/";
let quizes = quizesCriados = []; 
let escolhido; //variável para guardar o objeto de um quiz.
let erros = 0;
let acertos = 0;
let resultado = 0;
let qtdNiveis = 0;

let quizzEnviado = {
	title: "",
	image: "",
	questions: [],
	levels: []
}; 


function requisitarQuizzes() {
    const promessa = axios.get(urlAPI);
    promessa.then(processarResposta);
    promessa.catch (erroRequisitarQuizzes);
}

function erroRequisitarQuizzes(erro) {
    const code = erro.response.status;
    if (code !== 200) {
        alert("Erro ao requisitar o quizz clicado. Reiniciando a página.");
        window.reload();
    }
}

function processarResposta(jogos){
    //console.log(jogos.data);
    const code = jogos.status;
    if (code === 200) {
        quizes = jogos.data;
        renderizarQuizzes();
    }
}


function iniciarPagina () {
    let pagina = document.querySelector(".pagina");

    pagina.innerHTML = ""; //zerando a página
    pagina.innerHTML = `
        <div class="criar-quizz ">
            <p>Você não criou nenhum</br> quizz ainda :(</p>
            <div class="criar-quiz-botao" onclick="criarQuizz()">
                <p>Criar Quizz</p>
            </div>
        </div>
        <div class="seus-quizz-criar escondido">
            <p>Seus Quizzes</p>
            <img src="img/Group 22.png" onclick="criarQuizz()">
        </div>
        <div class="seus-quizzes escondido">
            <div class="quizzes-criados escondido">
                <div class="quizz" style="background-image: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 65.1%, #000000 100%), url(img/Rectangle\ 34.png)">
                    <div>
                        <h3>Titulo quizz</h3>
                    </div>
                </div>
            </div>
        </div>
        <div class="todos-quizzes">
        <div><h3>Todos os Quizzes</h3></div>
            <div class="quizzes">

            </div>
        </div>   
    `;
    requisitarQuizzes();
}

function renderizarQuizzes(){

    let quizzes  = document.querySelector(".quizzes");

    for(let i = 0; i < quizes.length; i++){

        quizzes.innerHTML += `
            <div class="quizz" style="background-image: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 65.1%, #000000 100%), url(${quizes[i].image})" onclick="selecionarQuiz(this)">
                <p class="id-quiz">${quizes[i].id}</p>
                <div><h3>${quizes[i].title}</h3></div>
            </div>
        `
    }
}

iniciarPagina();





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
   
    
    if (codigo === 200) {
        escolhido = resposta.data;
        abrirQuiz();
    }
}




function abrirQuiz () {
    erros = 0;
    acertos = 0;
    let stringPagina2 = "";
    let capa = document.querySelector(".pagina")

    let qtdPerguntas = escolhido.questions.length;
    let perguntas = escolhido.questions;

    capa.innerHTML = "";

    capa.innerHTML += `
        <div class="capa-quiz" style="background-image: linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${escolhido.image})">
            <p>${escolhido.title}</p>
        </div>
        `;
    for (let i=0; i < qtdPerguntas; i++) {
        
        stringPagina2 += `
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
    capa.innerHTML += stringPagina2;
    document.querySelector(".pagina").scrollIntoView({behavior:"smooth", block:"start", inline:"nearest"});
}



function renderizarFimQuizz(nivel) {
    let pagina = document.querySelector(".pagina");
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

        <div class="botao-voltar" onclick="iniciarPagina()">
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
    requisitarQuizzes();
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
    const pagina = document.querySelector('.pagina');
    
    pagina.innerHTML = ""; //zerando a página


    pagina.innerHTML = `
        
        <div class="cx-dados-quizz">
            <h3>Comece pelo começo</h3>
            <form>
                <input type="text" class="titulo-quizz" placeholder="Título do seu quizz" pattern="[A-Za-z].{1,20}">
                <input type="text" class="imagem-quizz" placeholder="URL da imagem do seu quizz">
                <input type="text" class="quantidade-perguntas" placeholder="Quantidade de perguntas do quizz">
                <input type="text" class="quantidade-niveis" placeholder="Quantidade de níveis do quizz">
            </form>
        </div>
        <button class="prosseguir-criar-perguntas" onclick="pegarInfosQuizz()">
            <p>Prosseguir criar perguntas</p>
        </button>
    `;    
}



function pegarInfosQuizz(){

    quizzEnviado.title = document.querySelector(".titulo-quizz").value;
    quizzEnviado.image = document.querySelector(".imagem-quizz").value;
    qtdNiveis = document.querySelector(".quantidade-niveis").value;
    criarPerguntasQuizz();
}


function criarPerguntasQuizz () {
    let pagina = document.querySelector(".pagina");
    let numPerguntas = quantidadePerguntas();

    pagina.innerHTML = "";
    pagina.innerHTML = `
        <h3>Crie suas perguntas</h3>
    `;
    for (let i=0; i < numPerguntas; i++) {
        //falta implementar o loop das respostas
        pagina.innerHTML += `
        <div class="pergunta">
            <h4>Pergunta ${i+1}</h4>
            <form>
                <input type="text" class="texto-pergunta" placeholder="Texto da pergunta" pattern="[A-Za-z].{20,65}">
                <h5>Escolha a cor de fundo da pergunta:</h5>
                <input type="color" class="cor-pergunta" placeholder="Cor de fundo da pergunta">
            </form>
           
            <div class="resposta-correta">
                <h4>Resposta Correta</h4>
                <form>
                    <input type="text" class="texto-respostaCerta-pergunta${i+1}" placeholder="Resposta correta">
                    <input type="url" class="imagem-respostaCerta-pergunta${i+1}" placeholder="URL da imagem" pattern="https?://.+" title="Include http://">
                </form>
            </div>
            <div class="resposta-incorreta">
                <h4>Resposta incorreta</h4>
                <form>
                    <input type="text" class="texto-respostaErrada-pergunta${i+1}" placeholder="Resposta incorreta">
                    <input type="url" class="imagem-respostaErrada-pergunta${i+1}" placeholder="URL da imagem" pattern="https?://.+" title="Include http://">
                </form>
            </div>
        </div>
        `
    }

    pagina.innerHTML += `
        <div class="prosseguir-pra-niveis" onclick="prosseguiPraCriarNiveis()">
            <p>Prosseguir pra criar níveis</p>
        </div>
    `;
}

// QUANTIDADE DE PERGUNTAS A SEREM CRIADAS
function quantidadePerguntas(){
    
    const numeroPerguntas = document.querySelector(".quantidade-perguntas").value
    console.log(numeroPerguntas);
    return numeroPerguntas;
}



function prosseguiPraCriarNiveis(){
    let pagina = document.querySelector(".pagina");

    pagina.innerHTML = "";

    for (let i=0; i < qtdNiveis; i++) {
        pagina.innerHTML += `
            
                <div class="nivel">
                    <form >
                        <h3>Nível ${i+1}</h3>
                        <input type="text" class="titulo-nivel" placeholder="Título do nível" required>
                        <input type="number" class="porcentagem-nivel" placeholder="% de acerto mínima" required>
                        <input type="url" class="url-nivel" placeholder="URL da imagem do nível" required>
                        <input type="text" class="descricao-nivel" placeholder="Descrição do nível" required>
                    </form>
                </div>

        `;
    }

    pagina.innerHTML += `
            <div class="botao-finalizar" onclick="finalizarQuizz()">
                <p>Finalizar Quizz</p>
            </div>
        
    `;
}



function finalizarQuizz() {
    
    let nivel = document.querySelector(".nivel");
    let tituloNivel;
    let porcentagem;
    let urlNivel;
    let textoNivel;
    let objetoNivel = {
        title: "",
        image: "",
        text: "",
        minValue: 0
    };

    for (let i=0; i < qtdNiveis; i++) {
        tituloNivel = nivel.querySelector(".titulo-nivel").value;
        porcentagem = nivel.querySelector(".porcentagem-nivel").value;
        urlNivel = nivel.querySelector(".url-nivel").value;
        textoNivel = nivel.querySelector(".descricao-nivel").value;

        objetoNivel.title = tituloNivel;
        objetoNivel.minValue = porcentagem;
        objetoNivel.image = urlNivel;
        objetoNivel.text = textoNivel;

        console.log(objetoNivel);
        quizzEnviado.levels.push(objetoNivel);
        nivel = nivel.nextElementSibling;
    }
    
    renderizarFimQuizzCriado();
    console.log(quizzEnviado);
}

function renderizarFimQuizzCriado () {
    let pagina = document.querySelector(".pagina");
    pagina.innerHTML = "";
    pagina.innerHTML = `
        <h3>Seu quizz está pronto!</h3>
        <div class="quizz" style="background-image: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.5) 65.1%, #000000 100%), url(${quizzEnviado.image})">
            <div><h3>${quizzEnviado.title}</h3></div>
        </div>
        <div class="acessar-quizz" onclick="acessarQuizzCriado()"><p>Acessar Quizz</p></div>
        <div class="voltar-pra-home" onclick="iniciarPagina()"><p>Voltar pra home</p></div> 
        `;
}

function acessarQuizzCriado () {
    let pagina = document.querySelector(".pagina");
    let perguntaStr = "";
    let qtdPerguntas = quizzEnviado.questions.length;
    let perguntas = quizzEnviado.questions;
    erros = 0;
    acertos = 0;
    escolhido = quizzEnviado;
    pagina.innerHTML = "";

    pagina.innerHTML += `
        <div class="capa-quiz" style="background-image: linear-gradient(180deg, rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${quizzEnviado.image})">
            <p>${quizzEnviado.title}</p>
        </div>
        `;
    for (let i=0; i < qtdPerguntas; i++) {
        
        //console.log(`pergunta ${i}`);
        perguntaStr += `
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
    pagina.innerHTML += perguntaStr;
    document.querySelector(".capa-quiz").scrollIntoView(true);
}



function criarPerguntas(){

    let perguntaQuizz = document.querySelector(".pergunta");
    
    perguntaQuizz.innerHTML = "";

    perguntaQuizz.innerHTML += `
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
            <input type="text" class="pergunta${i+1}-resp1" placeholder="Resposta correta">
            <input type="url" class="pergunta${i+1}-respImagem1" placeholder="URL da imagem" pattern="https?://.+" title="Include http://">
        </form>
    </div>
    `;


    for(let j = 1; j < 4; j ++){

        estrutura.innerHTML += `    
        <div class="resposta-incorreta">
            <h4>Respostas incorretas</h4>
            <form>
                <input type="text" class="pergunta${i+1}-resp${j+1}" placeholder="Resposta incorreta">
                <input type="url" class="pergunta${i+1}-respImagem${j+1}" placeholder="URL da imagem" pattern="https?://.+" title="Include http://">
            </form>
        </div>
        `;
    
    }
  

}
}
