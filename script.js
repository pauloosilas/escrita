function renderizarFrases() {
    const app = document.getElementById('app');
    const idioma = document.getElementById('langSelect').value;
    app.innerHTML = '';
    
    // Pega as frases do idioma selecionado no bancodedados.js
    const frasesIdioma = basededados[idioma] || [];
    
    // Embaralha e seleciona até 10
    const sorteadas = [...frasesIdioma].sort(() => Math.random() - 0.5).slice(0, 10);

    sorteadas.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="header-card">
                <div class="frase-pt">${index + 1}. ${item.frase}</div>
                <button class="btn-traducao" onclick="toggleTraducao(${index})">👁️ Ver Tradução</button>
            </div>
            <div id="trad-text-${index}" class="traducao-texto">${item.traducao}</div>
            <canvas id="canvas-${index}"></canvas>
            <div class="controls">
                <button class="clear" onclick="limparCanvas(${index})">Limpar</button>
            </div>
        `;
        app.appendChild(card);
        inicializarCanvas(index);
    });
}

function toggleTraducao(index) {
    const el = document.getElementById(`trad-text-${index}`);
    el.classList.toggle('show');
}

function inicializarCanvas(index) {
    const canvas = document.getElementById(`canvas-${index}`);
    const ctx = canvas.getContext('2d');
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let desenhando = false;

    const start = (e) => { desenhando = true; ctx.beginPath(); draw(e); };
    const stop = () => { desenhando = false; ctx.beginPath(); };
    const draw = (e) => {
        if (!desenhando) return;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#2980b9';
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.moveTo(x, y);
    };

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stop);
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); start(e); });
    canvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); });
    canvas.addEventListener('touchend', stop);
}

function limparCanvas(index) {
    const canvas = document.getElementById(`canvas-${index}`);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

window.onload = renderizarFrases;