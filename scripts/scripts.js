const urlAPI = "https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes";
let quizes = []; 

const promessa = axios.get(urlAPI);
promessa.then(processarResposta);

function processarResposta(jogos){
    console.log(jogos.data);
    quizes = jogos.data;

    renderizarQuizzes()
}

function renderizarQuizzes(){

    const ul = document.querySelector('.quizzes');

    for(let i = 0; i < 6; i++){

        ul.innerHTML += `
            <div class="quizz">
                <img src="${quizes[i].image}">
                <div><h3>${quizes[i].title}</h3></div>
            </div>
        `
    }
}

renderizarQuizzes();