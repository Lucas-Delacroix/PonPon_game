let canvas;
let ctx;
let frames = 0;
let total_pulos = 1;
let velocidade = 4;
let estado_atual; 
let saldo = 0;
let multiplicador_moedas = 1;
let multiplicador_pontos = 1;
let pontuacao = 0; 
let recorde = 0;
let poder;
let preco_item; 
let melhoria; 
let altura_tela = document.getElementById('canvas').clientHeight;
let largura_tela = document.getElementById('canvas').clientWidth;


function mudar_velocidade() {
    if (estado_atual == estados.jogando) {
        alert('Não é possível alterar enquanto está jogando!');
        return
    }
    recebervelocidade = document.getElementById('vel').value;
    velocidade = recebervelocidade;
    document.getElementById('vel').value = '';
}

function hack_saldo() {
    if (estado_atual == estados.jogando) {
        alert('Não é possível alterar enquanto está jogando!');
        return
    }
    valor_extra = parseInt(document.getElementById('hacksaldo').value);
    saldo += valor_extra;
    document.getElementById('hacksaldo').value = '';
}

function comprar_1() {
    preco_retirar = 10;
    if (estado_atual == estados.jogando) {
        alert('Não é possível comprar enquanto está jogando!');
        return
    }
    if (saldo >= preco_retirar) {
        alert('A força do seu pulo foi aumentada!');
        ponpon.puloforca += 1;
        saldo -= preco_retirar;
    }
    else {
        alert('Você não tem moedas o suficiente para comprar esse item!');
    }
}

function comprar_2() {
    preco_retirar = 20;
    if (estado_atual == estados.jogando) {
        alert('Não é possível comprar enquanto está jogando!');
        return
    }
    if (saldo >= preco_retirar) {
        alert('Você agora pode pular duas vezes!');
        ponpon.puloforca = 23;
        total_pulos = 2;
        saldo -= preco_retirar;
    }
    else {
        alert('Você não tem moedas o suficiente para comprar esse item!');
    }
}

function comprar_4() {
    preco_retirar = 20; 
    if (estado_atual == estados.jogando) {
        alert('Não é possível comprar enquanto está jogando!');
        return
    }
    if (saldo >= preco_retirar) {
        alert('Você agora ganhará o dobro de moedas!');
        multiplicador_moedas = 2;
        saldo -= preco_retirar;
    }
    else {
        alert('Você não tem moedas o suficiente para comprar esse item!');
    }
}


function comprar_3() {
    preco_retirar = 50;
    if (estado_atual == estados.jogando) {
        alert('Não é possível comprar enquanto está jogando!');
        return
    }
    if (saldo >= preco_retirar) {
        alert('Você agora pode pular até 3 vezes!!!');
        ponpon.puloforca = 20;
        total_pulos = 3;
        saldo -= preco_retirar;
    }
    else {
        alert('Você não tem moedas o suficiente para comprar esse item!');
    }
}

function comprar(id) {
    if (id == 1) {
        comprar_1(); 
    }

    else if (id == 2) {
        comprar_2();
    }

    else if (id == 3) {
        comprar_3();
    }

    else if (id == 4) {
        comprar_4();
    }
}

function tutorial() {
    alert('PonPon The Game\nArtista das pixel art preferiu não se identificar.\n-Tente conseguir sua pontuação mais alta!\n-Clique na tela ou aperta a tecla "espaço" para fazer PonPon pular.\n-Colete moedas para poder comprar itens na loja que te ajudarão a conseguir uma pontuação mais alta.\n-Se enconstar nos obstaculos você morre, mas seu saldo permanece!\n')
}


estados = {
    jogar: 0,
    jogando: 1,
    perdeu: 2
},

solo = {
    y: 350,
    altura: 50,
    cor: "#4e2424",

    desenha: function() {
        ctx.fillStyle = this.cor;
        ctx.fillRect(0, this.y, largura_tela, this.altura);
    }
}

ponpon = {
    x: 30,
    y: 0,
    altura: 50,
    largura: 50,
    cor: '#7E195E',
    gravidade: 1.5,
    velocidade: 0,
    puloforca: 27,
    quantidade_pulos: 0,
    pontuacao: 0,

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
        this.pontuacao = 0;

    },

    desenha: function() {
        let ponpon_sprite = new Image();
        ponpon_sprite.src = 'img/ponpon.png';
        ctx.drawImage(ponpon_sprite, this.x, this.y, this.largura, this.altura);
    },

};

function main() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);
    canvas.addEventListener('mousedown', clicou);
    
    estado_atual = estados.jogar;
    roda();
}



obstaculos = {
    _obs: [],
    cores: ["#3A4466", "#357579", "#7E195E", "#68386C", "#68386C"],
    tempoInsere: 0,

    insere: function() {
        this._obs.push({
            x:largura_tela,
            
            //largura: 30 + Math.floor(20 * Math.random()),
            largura: 30,
            altura: 25 + Math.floor(100 * Math.random()),
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

            /*ponpon.x < obs.x + obs.largura && ponpon.x + ponpon.largura >= obs.x && ponpon.y + ponpon.altura >= solo.y - obs.altura) {
                estado_atual = estados.perdeu;*/
            if (ponpon.x < obs.x + obs.largura && ponpon.x + ponpon.largura >= obs.x && ponpon.y + ponpon.altura >= solo.y - obs.altura) {
                estado_atual = estados.perdeu;
            }

            else if (obs.x == 0) {
                ponpon.pontuacao++;
            }



            else if (obs.x <= -obs.largura) {
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
    _moeda: [],
    cor: 'yellow',
    tempoInsere: 0,

    insere: function() {
        this._moeda.push({
            x:largura_tela,
            y: Math.floor(Math.random() * 300),
            
            
            //largura: 30 + Math.floor(20 * Math.random()),
            largura: 50,
            altura: 50,
            
        });

        this.tempoInsere = 250 + Math.floor(21 * Math.random()); //definir a distância dos obstaculos 
    },

    atualiza: function(){
        if (this.tempoInsere == 0)
            this.insere();
        else
            this.tempoInsere--;

        for (var i = 0, tam = this._moeda.length; i < tam; i++) {
            let moeda  = this._moeda[i];
            moeda.x -= velocidade

            if (ponpon.x == moeda.x + moeda.largura && ponpon.y <= moeda.y + moeda.altura && estado_atual == estados.jogando) {
                saldo += 1 * multiplicador_moedas;
            }

            if (moeda.x <= -moeda.largura) {
                this._moeda.splice(i, 1);
                tam--;
                i--;
            }

        }
    },

    limpa: function() {
        this._moeda = [];
    },
    
    desenha: function() {
        let moeda_sprite = new Image();
        moeda_sprite.src = 'img/moeda.png';

        for (var i = 0, tam = this._moeda.length; i < tam; i++) {
            let moeda = this._moeda[i];
            ctx.drawImage(moeda_sprite, moeda.x, moeda.y, moeda.largura, moeda.altura);
            //ctx.fillRect(moeda.x, moeda.y, moeda.largura, moeda.altura);

        }
    }
};

function registrar_recorde() {
    let texto_recorde = document.getElementById('recorde_valor');
    texto_recorde.textContent=recorde;
}

function clicou(event) {
    if (estado_atual == estados.jogando) 
        ponpon.pula();
    

    else if (estado_atual == estados.jogar) {
        estado_atual = estados.jogando; 
    }

    else if (estado_atual == estados.perdeu) {
        if (ponpon.pontuacao > recorde) {
            recorde = ponpon.pontuacao;
            registrar_recorde();
        }
        ponpon.pontuacao = 0;
        estado_atual = estados.jogar
        obstaculos.limpa()
        moedas.limpa()
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
        moedas.atualiza();
    
}

function desenha() {

    //ctx.fillStyle = "#50beff";
    
    let fundo = new Image();
    fundo.src = 'img/fundo.png';
    ctx.drawImage(fundo, 0, 0, largura_tela, altura_tela);
    //ctx.fillRect(0, 0, largura_tela, altura_tela);

    ctx.fillStyle = "#fff";
    ctx.font = '25px Courier New';
    ctx.fillText("Saldo:" + saldo, 565, 68);
    ctx.fillText("Pontos:" + ponpon.pontuacao, 565, 38)

    if (estado_atual == estados.jogar) {
        ctx.fillStyle = "green";
        ctx.font = '60px Courier New';
        ctx.fillText("Clique para jogar!", 50, altura_tela / 2 + 25);
    }

    else if (estado_atual == estados.perdeu) {
        ctx.fillStyle = "red";
        ctx.font = '60px Courier New';
        ctx.fillText("Você perdeu!", 135, altura_tela / 2 + 25);
        //ctx.fillRect(largura_tela / 2 - 50, altura_tela / 2 - 50, 100, 100);
    }

    else if (estado_atual == estados.jogando) {
        moedas.desenha();
        obstaculos.desenha();
    }

    solo.desenha();
    ponpon.desenha();
}

main();