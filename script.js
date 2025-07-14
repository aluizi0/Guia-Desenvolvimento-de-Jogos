document.addEventListener('DOMContentLoaded', function() {
    console.log('JavaScript carregado com sucesso!');

    // --- FUNÇÃO GLOBAL DE NAVEGAÇÃO ---
    /**
     * Esconde todas as seções com a classe '.tela' e mostra apenas a desejada com animação.
     * @param {string} idDaTelaParaMostrar - O ID da tela a ser exibida.
     */
    function mostrarTela(idDaTelaParaMostrar) {
        console.log('Tentando mostrar tela:', idDaTelaParaMostrar);
        
        // Primeiro esconde todas as telas
        document.querySelectorAll('.tela').forEach(tela => {
            tela.classList.add('escondido');
        });
        
        // Mostra a tela desejada
        const telaParaMostrar = document.getElementById(idDaTelaParaMostrar);
        if (telaParaMostrar) {
            console.log('Tela encontrada:', telaParaMostrar);
            telaParaMostrar.classList.remove('escondido');
            
            // Scroll suave para o topo da nova tela
            setTimeout(() => {
                telaParaMostrar.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
                
                // Desbloqueia o primeiro tópico da nova tela
                desbloquearPrimeiroTopico(telaParaMostrar);
            }, 100);
        } else {
            console.log('ERRO: Tela não encontrada:', idDaTelaParaMostrar);
        }
    }

    // --- FUNÇÃO PARA DESBLOQUEAR O PRIMEIRO TÓPICO ---
    function desbloquearPrimeiroTopico(tela) {
        // Apenas desbloqueia o primeiro tópico do primeiro dilema
        const primeiroDilema = tela.querySelector('.dilema-container');
        if (primeiroDilema) {
            const primeiroTopico = primeiroDilema.querySelector('.topico-item');
            if (primeiroTopico && primeiroTopico.classList.contains('bloqueado')) {
                primeiroTopico.classList.remove('bloqueado');
                const iconeCadeado = primeiroTopico.querySelector('.icone-cadeado');
                if (iconeCadeado) {
                    iconeCadeado.classList.add('desbloqueado');
                }
            }
        }
    }

    // --- MAPEAMENTO DOS BOTÕES E EVENTOS DE NAVEGAÇÃO ---
    const btnIniciar = document.getElementById('btn-iniciar');
    const btnParte1 = document.getElementById('btn-parte1');
    const btnParte2 = document.getElementById('btn-parte2');
    const btnParte3 = document.getElementById('btn-parte3');
    const btnReiniciar = document.getElementById('btn-reiniciar');

    if (btnIniciar) {
        console.log('Botão "Vamos Começar" encontrado!');
        btnIniciar.addEventListener('click', () => {
            console.log('Botão "Vamos Começar" foi clicado!');
            mostrarTela('parte1');
        });
    } else {
        console.log('ERRO: Botão "Vamos Começar" NÃO encontrado!');
    }
    if (btnParte1) {
        btnParte1.addEventListener('click', () => mostrarTela('parte2'));
    }
    if (btnParte2) {
        btnParte2.addEventListener('click', () => mostrarTela('parte3'));
    }
    if (btnParte3) {
        btnParte3.addEventListener('click', () => mostrarTela('final'));
    }
    if (btnReiniciar) {
        btnReiniciar.addEventListener('click', () => {
            resetarTodoOGuia();
            mostrarTela('tela-inicio');
        });
    }

    // --- LÓGICA DE DESBLOQUEIO DOS TÓPICOS (ACORDEÃO) ---
    const todosOsTopicos = document.querySelectorAll('.topico-item');

    todosOsTopicos.forEach(topico => {
        const cabecalhoTopico = topico.querySelector('h4');
        if (cabecalhoTopico) {
            cabecalhoTopico.addEventListener('click', function() {
                // Se o tópico clicado estiver bloqueado, não faz nada
                if (topico.classList.contains('bloqueado')) {
                    return;
                }

                // Mostra ou esconde o conteúdo do tópico clicado
                const conteudo = topico.querySelector('.conteudo-topico');
                if (conteudo) {
                    conteudo.classList.toggle('visivel');
                    conteudo.classList.toggle('escondido');
                }
            });
        }
    });

    // --- LÓGICA DOS CHECKBOXES ---
    const todosOsCheckboxes = document.querySelectorAll('.topico-checkbox');
    
    todosOsCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const topicoAtual = this.closest('.topico-item');
            
            if (this.checked) {
                // Marca o tópico como concluído
                topicoAtual.classList.add('concluido');
                
                // Desbloqueia o próximo tópico DENTRO DA MESMA SEÇÃO
                const proximoTopico = topicoAtual.nextElementSibling;
                if (proximoTopico && proximoTopico.classList.contains('topico-item') && proximoTopico.classList.contains('bloqueado')) {
                    proximoTopico.classList.remove('bloqueado');
                    const iconeCadeado = proximoTopico.querySelector('.icone-cadeado');
                    if (iconeCadeado) {
                        iconeCadeado.classList.add('desbloqueado');
                    }
                } else {
                    // Se não há próximo tópico na mesma seção, verifica o próximo dilema
                    const dilemaAtual = topicoAtual.closest('.dilema-container');
                    const proximoDilema = dilemaAtual.nextElementSibling;
                    if (proximoDilema && proximoDilema.classList.contains('dilema-container')) {
                        const primeiroTopicoProximoDilema = proximoDilema.querySelector('.topico-item');
                        if (primeiroTopicoProximoDilema && primeiroTopicoProximoDilema.classList.contains('bloqueado')) {
                            primeiroTopicoProximoDilema.classList.remove('bloqueado');
                            const iconeCadeado = primeiroTopicoProximoDilema.querySelector('.icone-cadeado');
                            if (iconeCadeado) {
                                iconeCadeado.classList.add('desbloqueado');
                            }
                        }
                    }
                }
                
                // Verifica se todos os tópicos da tela foram concluídos
                verificarConclusaoEtapa(topicoAtual);
            } else {
                // Se desmarcou o checkbox, remove a classe concluído
                topicoAtual.classList.remove('concluido');
                
                // Verifica novamente se pode manter o botão habilitado
                verificarConclusaoEtapa(topicoAtual);
            }
        });
    });

    // --- FUNÇÃO AUXILIAR PARA HABILITAR BOTÃO DE CONCLUSÃO ---
    /**
     * Verifica se todos os checkboxes de uma tela foram marcados para habilitar o botão de avançar.
     * @param {HTMLElement} topicoClicado - O elemento de tópico que acabou de ser clicado.
     */
    function verificarConclusaoEtapa(topicoClicado) {
        const telaAtual = topicoClicado.closest('.tela');
        if (!telaAtual) return;

        let todosCheckboxesMarcados = true;
        const todosOsCheckboxesDaTela = telaAtual.querySelectorAll('.topico-checkbox');

        todosOsCheckboxesDaTela.forEach(checkbox => {
            if (!checkbox.checked) {
                todosCheckboxesMarcados = false;
            }
        });

        const botaoConcluir = telaAtual.querySelector('button[id^="btn-parte"]');
        if (botaoConcluir) {
            if (todosCheckboxesMarcados && todosOsCheckboxesDaTela.length > 0) {
                // Habilita o botão se todos os checkboxes estão marcados
                botaoConcluir.removeAttribute('disabled');
                botaoConcluir.style.backgroundColor = '#27ae60';
                botaoConcluir.style.opacity = '1';
                if (!botaoConcluir.textContent.includes('✓')) {
                    botaoConcluir.textContent = '✓ ' + botaoConcluir.textContent;
                }
            } else {
                // Desabilita o botão se nem todos os checkboxes estão marcados
                botaoConcluir.setAttribute('disabled', 'true');
                botaoConcluir.style.backgroundColor = '#5f677a';
                botaoConcluir.style.opacity = '0.5';
                botaoConcluir.textContent = botaoConcluir.textContent.replace('✓ ', '');
            }
        }
    }

    // --- FUNÇÃO PARA RESETAR TODO O GUIA ---
    function resetarTodoOGuia() {
        console.log('Resetando todo o guia...');
        
        // 1. Desmarca todos os checkboxes
        const todosOsCheckboxes = document.querySelectorAll('.topico-checkbox');
        todosOsCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // 2. Remove classe 'concluido' de todos os tópicos
        const todosOsTopicos = document.querySelectorAll('.topico-item');
        todosOsTopicos.forEach(topico => {
            topico.classList.remove('concluido');
        });
        
        // 3. Bloqueia todos os tópicos (exceto o primeiro da Parte 1)
        todosOsTopicos.forEach((topico, index) => {
            const dilemaContainer = topico.closest('.dilema-container');
            const primeiroTopicoDoDilema = dilemaContainer.querySelector('.topico-item');
            const tela = topico.closest('.tela');
            
            // Se não é o primeiro tópico do primeiro dilema da Parte 1, bloqueia tudo
            if (!(tela.id === 'parte1' && topico === primeiroTopicoDoDilema && dilemaContainer === tela.querySelector('.dilema-container'))) {
                topico.classList.add('bloqueado');
                const iconeCadeado = topico.querySelector('.icone-cadeado');
                if (iconeCadeado) {
                    iconeCadeado.classList.remove('desbloqueado');
                }
            } else {
                // Apenas o primeiro tópico do primeiro dilema da Parte 1 fica desbloqueado
                topico.classList.remove('bloqueado');
                const iconeCadeado = topico.querySelector('.icone-cadeado');
                if (iconeCadeado) {
                    iconeCadeado.classList.add('desbloqueado');
                }
            }
        });
        
        // 4. Fecha todos os conteúdos dos tópicos
        const todosOsConteudos = document.querySelectorAll('.conteudo-topico');
        todosOsConteudos.forEach(conteudo => {
            conteudo.classList.remove('visivel');
            conteudo.classList.add('escondido');
        });
        
        // 5. Desabilita todos os botões de conclusão
        const todosOsBotoes = document.querySelectorAll('button[id^="btn-parte"]');
        todosOsBotoes.forEach(botao => {
            botao.setAttribute('disabled', 'true');
            botao.style.backgroundColor = '#5f677a';
            botao.style.opacity = '0.5';
            // Remove o ✓ do texto
            botao.textContent = botao.textContent.replace('✓ ', '');
        });
        
        console.log('Reset completo realizado!');
    }

    // Executa reset inicial e desbloqueia apenas o primeiro tópico da Parte 1
    resetarTodoOGuia();
    const parte1 = document.getElementById('parte1');
    if (parte1) {
        desbloquearPrimeiroTopico(parte1);
    }
});