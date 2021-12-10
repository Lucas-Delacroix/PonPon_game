let canvas;
let ctx;
let frames = 0;
let total_pulos = 1;
let velocidade = 4;
let estado_atual; 
let moedas = 0;


estados = {
    jogar: 0,
    jogando: 1,
    perdeu: 2
},

solo = {
    y: 350,
    altura: 50,
    cor: "#ffdf70",

    desenha: function() {
        ctx.fillStyle = this.cor;
        ctx.fillRect(0, this.y, 720, this.altura);
    }
}

ponpon = {
    x: 30,
    y: 0,
    altura: 50,
    largura: 50,
    cor: '#ff4e4e',
    gravidade: 1.5,
    velocidade: 0,
    puloforca: 30,
    quantidade_pulos: 0,

    atualiza: function() {
        this.velocidade += this.gravidade;
        this.y += this.velocidade;

        if (this.y > solo.y - this.altura && estado_atual != estados.perdeu) {
            this.y = solo.y - this.altura;
            this.quantidade_pulos = 0;
            this.velocidade = 0;
        }
    },

    pula: function() {
        if (this.quantidade_pulos < total_pulos) {
            this.velocidade = -this.puloforca;
            this.quantidade_pulos++;
        }
    },

    reset: function() {
        this.velocidade = 0;
        this.y = 0;

    },

    desenha: function() {
        ctx.fillStyle = this.cor;
        ctx.fillRect(this.x, this.y, this.largura, this.altura);
    }
};

function main() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);
    document.addEventListener('mousedown', clicou);

    estado_atual = estados.jogar;

    roda();
}

obstaculos = {
    _obs: [],
    cores: ["#ffbc1", "#ff1c1c", "#ff85e1", "#52a7ff", "#78ff5d"],
    tempoInsere: 0,

    insere: function() {
        this._obs.push({
            x:720,
            
            //largura: 30 + Math.floor(20 * Math.random()),
            largura: 30,
            altura: 30 + Math.floor(120 * Math.random()),
            cor: this.cores[Math.floor(5 * Math.random())]
        });

        this.tempoInsere = 100 + Math.floor(21 * Math.random()); //definir a distância dos obstaculos 
    },

    atualiza: function(){
        if (this.tempoInsere == 0)
            this.insere();
        else
            this.tempoInsere--;

        for (var i = 0, tam = this._obs.length; i < tam; i++) {
            let obs  = this._obs[i];
            obs.x -= velocidade

            if (ponpon.x < obs.x + obs.largura && ponpon.x + ponpon.largura >= obs.x && ponpon.y + ponpon.altura >= solo.y - obs.altura) {
                estado_atual = estados.perdeu;
            }

            if (obs.x <= -obs.largura) {
                this._obs.splice(i, 1);
                tam--;
                i--;
            }

        }
    },

    limpa: function() {
        this._obs = [];
    },
    
    desenha: function() {
        for (var i = 0, tam = this._obs.length; i < tam; i++) {
            let obs = this._obs[i];
            ctx.fillStyle = obs.cor;
            ctx.fillRect(obs.x, solo.y - obs.altura, obs.largura, obs.altura);

        }
    }
};

moedas = {
    moeda: [],
    altura: 30,
    largura: 30,
    cor: 'yellow',

    insere_moedas: function() {

    },
    
    desenha: function() {
        ctx.fillStyle = this.cor;
        ctx.fillRect(40, 20, this.largura, this.altura);
    },
};

function clicou(event) {
    if (estado_atual == estados.jogando) 
        ponpon.pula();
    

    else if (estado_atual == estados.jogar) {
        estado_atual = estados.jogando; 
    }

    else if (estado_atual == estados.perdeu) {
        estado_atual = estados.jogar
        obstaculos.limpa()
        ponpon.reset 
        ponpon.y = 0;
    }
}

function roda() {
    atualiza(); 
    desenha();

    window.requestAnimationFrame(roda);
    
}

function atualiza() {
    frames++;
    ponpon.atualiza();
    if (estado_atual == estados.jogando) 
        obstaculos.atualiza();
    
}

function desenha() {
    ctx.fillStyle = "#50beff";
    ctx.fillRect(0, 0, 720, 400);

    if (estado_atual == estados.jogar) {
        ctx.fillStyle = "green";
        ctx.fillRect(720 / 2 - 50, 400 / 2 - 50, 100, 100);
    }

    else if (estado_atual == estados.perdeu) {
        ctx.fillStyle = "red";
        ctx.fillRect(720 / 2 - 50, 400 / 2 - 50, 100, 100);
    }

    else if (estado_atual == estados.jogando) {
        moedas.desenha();
        obstaculos.desenha();
    }

    solo.desenha();
    ponpon.desenha();
}

main();