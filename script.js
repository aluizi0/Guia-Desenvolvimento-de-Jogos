// Espera o documento HTML ser completamente carregado antes de executar o script.
// Isso é uma boa prática para garantir que todos os elementos que queremos manipular já existem na página.
document.addEventListener('DOMContentLoaded', function() {

    // 1. Pegar referências para todos os elementos que vamos manipular
    const parte1 = document.getElementById('parte1');
    const parte2 = document.getElementById('parte2');
    const parte3 = document.getElementById('parte3');
    const final = document.getElementById('final');

    const btnParte1 = document.getElementById('btn-parte1');
    const btnParte2 = document.getElementById('btn-parte2');
    const btnParte3 = document.getElementById('btn-parte3');

    // 2. Adicionar o "ouvinte de evento" para o clique no primeiro botão
    btnParte1.addEventListener('click', function() {
        console.log("Etapa 1 concluída! Desbloqueando a Parte 2.");

        // Remove a classe 'bloqueado' da seção 2
        parte2.classList.remove('bloqueado');
        
        // Remove o atributo 'disabled' do botão 2, permitindo que ele seja clicado
        btnParte2.removeAttribute('disabled');

        // Foca a visualização na parte recém-desbloqueada para uma melhor experiência do usuário
        parte2.scrollIntoView({ behavior: 'smooth' });
    });

    // 3. Adicionar o "ouvinte de evento" para o clique no segundo botão
    btnParte2.addEventListener('click', function() {
        console.log("Etapa 2 concluída! Desbloqueando a Parte 3.");

        // Remove a classe 'bloqueado' da seção 3
        parte3.classList.remove('bloqueado');

        // Remove o atributo 'disabled' do botão 3
        btnParte3.removeAttribute('disabled');

        // Foca a visualização na parte recém-desbloqueada
        parte3.scrollIntoView({ behavior: 'smooth' });
    });

    // 4. Adicionar o "ouvinte de evento" para o clique no terceiro (e último) botão
    btnParte3.addEventListener('click', function() {
        console.log("Guia finalizado! Mostrando mensagem de parabéns.");
        
        // Mostra a seção final mudando seu estilo 'display' de 'none' para 'block'
        final.style.display = 'block';

        // Foca na mensagem final
        final.scrollIntoView({ behavior: 'smooth' });
    });

});