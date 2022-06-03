var tabuleiroOriginal;
const jogador = 'O';
const ia = 'X';
const vitorias = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const celulas = document.querySelectorAll('.cell');
startGame();

function startGame() {
	document.querySelector(".mensagem").style.display = "none";
	tabuleiroOriginal = Array.from(Array(9).keys());
	for (var i = 0; i < celulas.length; i++) {
		celulas[i].innerText = '';
		celulas[i].style.removeProperty('color');
		celulas[i].addEventListener('click', marcarCasa, false);
	}
}

function marcarCasa(casa) {
	if (typeof tabuleiroOriginal[casa.target.id] == 'number') {
		turno(casa.target.id, jogador)
		if (!verificarVitoria(tabuleiroOriginal, jogador) && !verificarEmpate()) turno(minimax(tabuleiroOriginal, ia).index, ia);
	}
}

function turno(casaId, player) {
	tabuleiroOriginal[casaId] = player;
	document.getElementById(casaId).innerText = player;
	let ganhou = verificarVitoria(tabuleiroOriginal, player)
	if (ganhou) gameOver(ganhou)
}

function verificarVitoria(tabuleiro, jogador) {
	
	let ganhou = null;
    for (let i = 0; i <= 7; i++) {
        const vitoria = vitorias[i];
        let a = tabuleiro[vitoria[0]];
        let b = tabuleiro[vitoria[1]];
        let c = tabuleiro[vitoria[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c && c === jogador) {
			ganhou = {index: i, player: jogador};

            break
        }
    }
	return ganhou;
}

function gameOver(ganhou) {
	for (let index of vitorias[ganhou.index]) {
		document.getElementById(index).style.color =
		ganhou.player == jogador ? "blue" : "red";
	}
	for (var i = 0; i < celulas.length; i++) {
		celulas[i].removeEventListener('click', marcarCasa, false);
	}
	const msg = ganhou.player == jogador ? "Você Ganhou!" : "Você perdeu.";
	document.querySelector(".mensagem").style.display = "block";
	document.querySelector(".mensagem .text").innerText = msg;
}


function casasVazias() {
	return tabuleiroOriginal.filter(s => typeof s == 'number');
}


function verificarEmpate() {
	if (casasVazias().length == 0) {
		for (var i = 0; i < celulas.length; i++) {
			celulas[i].style.color = "green";
			celulas[i].removeEventListener('click', marcarCasa, false);
		}
		document.querySelector(".mensagem").style.display = "block";
		document.querySelector(".mensagem .text").innerText = "Empate!";
		return true;
	}
	return false;
}

function minimax(novoTabuleiro, jogadorAtual){
	var casasDisponiveis = casasVazias();

	if(verificarVitoria(novoTabuleiro, jogador))
		return {score: -1};
	else if(verificarVitoria(novoTabuleiro, ia))
		return {score: 1};
	else if(casasDisponiveis.length === 0)
		return {score: 0};
	
	let movimentos = [];

	for(let i = 0; i < casasDisponiveis.length; i++){
		let movimento = {};

		movimento.index = novoTabuleiro[casasDisponiveis[i]];
		novoTabuleiro[casasDisponiveis[i]] = jogadorAtual;

		if(jogadorAtual == ia){
			let resultado = minimax(novoTabuleiro, jogador);
			movimento.score = resultado.score;
		}else{
			let resultado = minimax(novoTabuleiro, ia);
			movimento.score = resultado.score;
		}

		novoTabuleiro[casasDisponiveis[i]] = movimento.index;
		movimentos.push(movimento);
	}

	let melhorMovimento;

	if(jogadorAtual === ia){
		let melhorPontuacao = -10000;
		for(let i = 0; i < movimentos.length; i++){
			if(movimentos[i].score > melhorPontuacao){
				melhorPontuacao = movimentos[i].score;
				melhorMovimento = i;
			}
			
		}
	}else{
		let melhorPontuacao = 10000;
		for(let i = 0; i < movimentos.length; i++){
			if(movimentos[i].score < melhorPontuacao){
				melhorPontuacao = movimentos[i].score;
				melhorMovimento = i;
			}
			
		}
	}

	return movimentos[melhorMovimento];
}
