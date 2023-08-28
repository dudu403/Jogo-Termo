import { palavras } from "./palavras.js";
import { jogo, resultado } from "./jogo-termo.js";
class telaTermo {
    constructor(jogo) {
        this.jogo = jogo;
        this.letras = [];
        this.maxCol = 5;
        this.maxRow = 5;
        this.coluna = 0;
        this.linha = 0;
        this.palavra = "";
        this.atribuirEventos();
        this.pnlTermo = document.getElementById('pnlTermo');
        this.pnlConteudo = document.getElementById('pnlConteudo');
    }
    atribuirEventos() {
        this.btnEnter = document.getElementById('btnEnter');
        this.btnEnter.addEventListener('click', () => this.verificarJogada());
        this.btnBack = document.getElementById('btnBackspace');
        this.btnBack.addEventListener('click', () => this.corrigirInput());
        this.pnlTeclado = document.getElementById('pnlTeclado');
        for (let i = 0; i < this.pnlTeclado.children.length; i++) {
            const tecla = this.pnlTeclado.children.item(i);
            if (tecla.textContent != 'Enter' && tecla.id != 'btnBackspace')
                tecla.addEventListener('click', (sender) => this.atribuirLetra(sender));
        }
    }
    atribuirLetra(sender) {
        if (this.palavra.length === this.maxCol)
            return;
        const tbLetra = this.pnlTermo
            .children[this.linha]
            .children[this.coluna];
        let letra = sender.target;
        tbLetra.textContent = letra.innerText;
        this.palavra += letra.innerText;
        this.letras.push(tbLetra);
        this.coluna++;
    }
    verificarJogada() {
        if (this.palavra.length !== this.maxCol)
            return;
        this.colorirletras();
        if (this.jogo.acertou(this.palavra)) {
            this.enviarMensagem(true);
        }
        else {
            this.linha++;
            if (this.linha === this.maxRow) {
                this.enviarMensagem(false);
            }
        }
        this.limparDados();
    }
    colorirletras() {
        let resultados = this.jogo.verificarJogada(this.palavra);
        for (let i = 0; i <= this.palavra.length; i++) {
            switch (resultados[i]) {
                case resultado.Acerto:
                    this.letras[i].style.backgroundColor = '#3aa394';
                    break;
                case resultado.Erro:
                    this.letras[i].style.backgroundColor = '#d3ad69';
                    break;
                case resultado.Inexistente:
                    this.letras[i].style.backgroundColor = '#312a2c';
                    break;
            }
        }
    }
    gerarElementosMsgFinal() {
        this.removerMsgFinal();
        let div = document.createElement('div');
        div.id = "divMensagemFinal";
        div.classList.add('group-mensagem');
        this.pnlConteudo.appendChild(div);
        let spanMsg = document.createElement('span');
        div.appendChild(spanMsg);
        let button = document.createElement('button');
        button.classList.add('btn-reiniciar');
        button.id = "btnReiniciar";
        button.innerText = "Recomeçar";
        button.addEventListener('click', () => this.reiniciarJogo());
        div.appendChild(button);
        this.alterarStatusTeclado();
        return spanMsg;
    }
    enviarMensagem(venceu) {
        let msg = this.gerarElementosMsgFinal();
        if (venceu) {
            msg.textContent = `Parabéns! Você acertou a palavra: ${this.jogo.getPalavra()}`;
        }
        else {
            msg.textContent = `Fim de Jogo! A palavra era: ${this.jogo.getPalavra()}`;
        }
    }
    corrigirInput() {
        if (this.coluna == 0)
            return;
        let letra = this.letras[this.coluna - 1];
        letra.textContent = "";
        this.letras.pop();
        this.coluna--;
        this.palavra = this.palavra.substring(0, this.palavra.length - 1);
    }
    alterarStatusTeclado() {
        for (let index = 0; index < this.pnlTeclado.children.length; index++) {
            let tecla = this.pnlTeclado.children[index];
            tecla.disabled = !tecla.disabled;
        }
    }
    limparDados() {
        this.coluna = 0;
        this.palavra = "";
        this.letras = [];
    }
    removerMsgFinal() {
        const mensagemFinal = document.getElementById('divMensagemFinal');
        if (mensagemFinal) {
            this.pnlConteudo.removeChild(mensagemFinal);
        }
    }
    reiniciarJogo() {
        this.limparDados();
        this.linha = 0;
        this.jogo = new jogo(new palavras());
        for (let i = 0; i < this.pnlTermo.children.length; i++) {
            const linha = this.pnlTermo.children.item(i);
            for (let index = 0; index < linha.children.length; index++) {
                const letra = linha.children.item(index);
                letra.style.backgroundColor = '#bebebe';
                letra.textContent = '';
            }
        }
        this.removerMsgFinal();
        this.alterarStatusTeclado();
    }
}
window.addEventListener("load", () => new telaTermo(new jogo(new palavras())));
//# sourceMappingURL=tela-termo.js.map