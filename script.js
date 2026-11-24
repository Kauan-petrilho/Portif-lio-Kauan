'use strict';

/* Menu hambúrguer (abre/fecha o menu no celular) */
function iniciarMenu() {
  const botao = document.querySelector('.menu-toggle');
  const menu = document.getElementById('main-nav');
  if (!botao || !menu) return;

  const definirEstado = (aberto) => {
    menu.classList.toggle('is-open', aberto);
    botao.setAttribute('aria-expanded', String(aberto));
    botao.setAttribute('aria-label', aberto ? 'Fechar menu' : 'Abrir menu');
  };

  botao.addEventListener('click', () => definirEstado(!menu.classList.contains('is-open')));
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => definirEstado(false)));
  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape') definirEstado(false);
  });
}

/* Ano atual no rodapé */
function atualizarAno() {
  const ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
}

/* Se a foto não carregar, mostra as iniciais no lugar */
function iniciarFotoPerfil() {
  const foto = document.querySelector('.hero-photo img');
  if (!foto) return;

  const mostrarIniciais = () => {
    const substituto = document.createElement('div');
    substituto.className = 'avatar-fallback';
    substituto.setAttribute('role', 'img');
    substituto.setAttribute('aria-label', foto.alt);
    substituto.textContent = 'KP';
    foto.replaceWith(substituto);
  };

  if (foto.complete && foto.naturalWidth === 0) mostrarIniciais();
  else foto.addEventListener('error', mostrarIniciais, { once: true });
}

/* Seções aparecem ao rolar a página */
function iniciarRevelacao() {
  const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduzir || !('IntersectionObserver' in window)) return;

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('is-visible');
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('main > section:not(.hero)').forEach((secao) => {
    secao.classList.add('reveal');
    observador.observe(secao);
  });
}

/* Filtro de projetos por categoria */
function iniciarFiltroProjetos() {
  const botoes = document.querySelectorAll('.filter-btn');
  const cartoes = document.querySelectorAll('#projects-list .project-card');
  const contador = document.getElementById('project-count');
  if (!botoes.length) return;

  botoes.forEach((botao) => {
    botao.addEventListener('click', () => {
      const filtro = botao.dataset.filter;
      let visiveis = 0;

      cartoes.forEach((cartao) => {
        const mostrar = filtro === 'todos' || cartao.dataset.category === filtro;
        cartao.hidden = !mostrar;
        if (mostrar) visiveis++;
      });

      botoes.forEach((outro) => outro.setAttribute('aria-pressed', String(outro === botao)));
      if (contador) contador.textContent = `Mostrando ${visiveis} de ${cartoes.length} projetos`;
    });
  });
}

/* Validação do formulário de contato e envio por e-mail */
function iniciarFormularioContato() {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  const regras = [
    { id: 'nome', valido: (v) => v.trim().length >= 2, mensagem: 'Informe seu nome.' },
    { id: 'email', valido: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), mensagem: 'Informe um e-mail válido.' },
    { id: 'mensagem', valido: (v) => v.trim().length >= 10, mensagem: 'Escreva ao menos 10 caracteres.' },
  ];

  form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    let primeiroErro = null;

    regras.forEach((regra) => {
      const campo = form.elements[regra.id];
      const erro = document.getElementById(`erro-${regra.id}`);
      const ok = regra.valido(campo.value);
      erro.textContent = ok ? '' : regra.mensagem;
      campo.setAttribute('aria-invalid', String(!ok));
      if (!ok && !primeiroErro) primeiroErro = campo;
    });

    if (primeiroErro) {
      status.textContent = 'Corrija os campos destacados.';
      status.className = 'form-status is-error';
      primeiroErro.focus();
      return;
    }

    const nome = form.elements.nome.value.trim();
    const email = form.elements.email.value.trim();
    const texto = form.elements.mensagem.value.trim();
    const assunto = encodeURIComponent(`Contato pelo portfólio - ${nome}`);
    const corpo = encodeURIComponent(`${texto}\n\nDe: ${nome} (${email})`);

    status.textContent = 'Abrindo seu aplicativo de e-mail...';
    status.className = 'form-status';
    window.location.href = `mailto:kauanpetrilho@gmail.com?subject=${assunto}&body=${corpo}`;
    form.reset();
  });
}

iniciarMenu();
atualizarAno();
iniciarFotoPerfil();
iniciarRevelacao();
iniciarFiltroProjetos();
iniciarFormularioContato();
