let canvas;
let ctx;
let frames = 0;
let total_pulos = 1;
let velocidade = 5;
let estado;


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
    x: 50,
    y: 0,
    altura: 50,
    largura: 50,
    cor: '#ff4e4e',
    gravidade: 1.5,
    velocidade: 0,
    puloforca: 20,
    quantidade_pulos: 0,

    atualiza: function() {
        this.velocidade += this.gravidade;
        this.y += this.velocidade;

        if (this.y > solo.y - this.altura) {
            this.y = solo.y - this.altura;
            this.quantidade_pulos = 0;
        }
    },

    pula: function() {
        if (this.quantidade_pulos < total_pulos) {
            this.velocidade = -this.puloforca;
            this.quantidade_pulos++;
        }
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
    document.addEventListener("mousedown", clicou);

    roda();
}

obstaculos = {
    _obs: [],
    cores: ["#ffbc1", "#ff1c1c", "#ff85e1", "#52a7ff", "#78ff5d"],
    tempoInsere: 0,

    insere: function() {
        this._obs.push({
            x:720,
            largura: 30 + Math.floor(20 * Math.random()),
            altura: 30 + Math.floor(120 * Math.random()),
            cor: this.cores[Math.floor(5 * Math.random())]
        });

        this.tempoInsere = 30 + Math.floor(21 * Math.random());
    },

    atualiza: function(){
        if (this.tempoInsere == 0)
            this.insere();
        else
            this.tempoInsere--;

        for (var i = 0, tam = this._obs.length; i < tam; i++) {
            let obs  = this._obs[i];
            obs.x -= velocidade

            if (obs.x <= -obs.largura) {
                this._obs.splice(i, 1);
                tam--;
                i--;
            }

        }
    },
    
    desenha: function() {
        for (var i = 0, tam = this._obs.length; i < tam; i++) {
            let obs = this._obs[i];
            ctx.fillStyle = obs.cor;
            ctx.fillRect(obs.x, solo.y - obs.altura, obs.largura, obs.altura);

        }
    }
};

function clicou(event) {
    //alert('pulo'); 
    ponpon.pula();
}

function roda() {
    atualiza();
    desenha();

    window.requestAnimationFrame(roda);
    
}

function atualiza() {
    frames++;
    ponpon.atualiza();
    obstaculos.atualiza();
}

function desenha() {
    ctx.fillStyle = "#50beff";
    ctx.fillRect(0, 0, 720, 400);

    solo.desenha();
    obstaculos.desenha();
    ponpon.desenha();
}

main();