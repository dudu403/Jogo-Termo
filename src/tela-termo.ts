import { palavras } from "./palavras";
import { jogo, resultado } from "./jogo-termo";

class telaTermo {
    pnlTeclado: HTMLElement;
    btnEnter: HTMLButtonElement;
    pnlConteudo: HTMLElement;
    pnlTermo: HTMLElement;
    letras: HTMLElement[] = [];
    maxCol: number = 5;
    maxRow: number = 5;
    coluna: number = 0;
    linha: number = 0;
    palavra: string = "";

    constructor(private jogo: jogo) {
        this.pnlTermo = document.getElementById('pnlTermo') as HTMLElement;
        this.pnlConteudo = document.getElementById('pnlConteudo') as HTMLElement;
        this.atribuirEventos();
    }

    private atribuirEventos() {
        this.btnEnter = document.getElementById('btnEnter') as HTMLButtonElement;
        this.btnEnter.addEventListener('click', () => this.verificarJogada());

        this.pnlTeclado = document.getElementById('pnlTeclado') as HTMLElement;

        for (let i = 0; i < this.pnlTeclado.children.length; i++) {
            const tecla = this.pnlTeclado.children.item(i) as HTMLButtonElement;
            if (tecla.textContent !== 'Enter') {
                tecla.addEventListener('click', (event) => this.atribuirLetra(event));
            }
        }
    }

    private atribuirLetra(event: Event): void {
        if (this.palavra.length === this.maxCol) {
            return;
        }

        const tbLetra = this.pnlTermo
            .children[this.linha]
            .children[this.coluna] as HTMLElement;

        const letra = event.target as HTMLButtonElement;
        tbLetra.textContent = letra.innerText;
        this.palavra += letra.innerText;
        this.letras.push(tbLetra);
        this.coluna++;
    }

    private verificarJogada(): void {
        if (this.palavra.length !== this.maxCol) {
            return;
        }

        this.colorirLetras();

        if (this.jogo.acertou(this.palavra)) {
            this.enviarMensagem(true);
        } else {
            this.linha++;
            if (this.linha === this.maxRow) {
                this.enviarMensagem(false);
            }
        }

        this.limparDados();
    }

    private colorirLetras() {
        let resultados: resultado[] = this.jogo.verificarJogada(this.palavra);

        for (let i = 0; i < this.palavra.length; i++) {
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

    private enviarMensagem(venceu: boolean) {
        const msg = this.gerarElementosMsgFinal();

        if (venceu) {
            msg.textContent = `Parabéns! Você acertou a palavra: ${this.jogo.getPalavra()}`;
        } else {
            msg.textContent = `Fim de Jogo! A palavra era: ${this.jogo.getPalavra()}`;
        }
    }

    private gerarElementosMsgFinal(): HTMLSpanElement {
        this.removerMsgFinal();

        const div = document.createElement('div');
        div.id = "divMensagemFinal";
        div.classList.add('group-mensagem');
        this.pnlConteudo.appendChild(div);

        const spanMsg = document.createElement('span');
        div.appendChild(spanMsg);

        const button = document.createElement('button');
        button.classList.add('btn-reiniciar');
        button.id = "btnReiniciar";
        button.innerText = "Recomeçar";
        button.addEventListener('click', () => this.reiniciarJogo());
        div.appendChild(button);

        this.alterarStatusTeclado();

        return spanMsg;
    }

    private corrigirInput(): void {
        if (this.coluna == 0) {
            return;
        }

        const letra = this.letras[this.coluna - 1];
        letra.textContent = "";
        this.letras.pop();
        this.coluna--;
        this.palavra = this.palavra.substring(0, this.palavra.length - 1);
    }

    private alterarStatusTeclado() {
        for (let index = 0; index < this.pnlTeclado.children.length; index++) {
            const tecla = this.pnlTeclado.children[index] as HTMLButtonElement;
            tecla.disabled = !tecla.disabled;
        }
    }

    private limparDados() {
        this.coluna = 0;
        this.palavra = "";
        this.letras = [];
    }

    private removerMsgFinal() {
        const mensagemFinal = document.getElementById('divMensagemFinal');
        if (mensagemFinal) {
            this.pnlConteudo.removeChild(mensagemFinal);
        }
    }

    private reiniciarJogo() {
        this.limparDados();
        this.linha = 0;

        this.jogo = new jogo(new palavras());

        for (let i = 0; i < this.pnlTermo.children.length; i++) {
            const linha = this.pnlTermo.children.item(i) as HTMLElement;
            for (let index = 0; index < linha.children.length; index++) {
                const letra = linha.children.item(index) as HTMLElement;
                letra.style.backgroundColor = '#bebebe';
                letra.textContent = '';
            }
        }
        this.removerMsgFinal();
        this.alterarStatusTeclado();
    }
}

window.addEventListener("load", () => {
    const jogoInstance = new jogo(new palavras());
    new telaTermo(jogoInstance);
});
