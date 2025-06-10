document.addEventListener('DOMContentLoaded', () => {

    // --- LÓGICA DA PÁGINA DE CADASTRO ---
    if (document.getElementById('cadastroForm')) {
        document.getElementById('cadastroForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email-cadastro').value;
            const senha = document.getElementById('senha-cadastro').value;
            const confirmarSenha = document.getElementById('confirmar-senha').value;

            if (senha !== confirmarSenha) {
                alert('As senhas não coincidem!');
                return;
            }

            // Salva o perfil do usuário no localStorage
            const userProfile = { nome: nome, email: email };
            localStorage.setItem('userProfile', JSON.stringify(userProfile));

            alert('Cadastro realizado com sucesso! Agora preencha alguns dados sobre seus hábitos.');
            window.location.href = 'dados.html';
        });
    }

    // --- LÓGICA DA PÁGINA DE LOGIN ---
    if (document.getElementById('loginForm')) {
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Login bem-sucedido! Redirecionando...');
            window.location.href = 'progresso.html';
        });
    }

    // --- LÓGICA DA PÁGINA DE RECUPERAR SENHA ---
    if (document.getElementById('recoveryForm')) {
        document.getElementById('recoveryForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email-recuperacao').value;
            if (email) {
                alert(`Se o e-mail ${email} estiver cadastrado, um link de recuperação foi enviado!`);
                window.location.href = 'index.html';
            } else {
                alert('Por favor, insira um e-mail.');
            }
        });
    }

    // --- LÓGICA DA PÁGINA DE DADOS (LÓGICA DE CÁLCULO ALTERADA) ---
    if (document.getElementById('dataForm')) {
        document.getElementById('dataForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const inputs = document.querySelectorAll('#dataForm input');
            const dailyCigarettes = inputs[0].value;
            const packPrice = inputs[1].value;
            const packSize = inputs[2].value;
            const daysSmokeFree = parseInt(inputs[3].value, 10); // Nova pergunta

            if (dailyCigarettes && packPrice && packSize && (daysSmokeFree >= 0)) {
                // CALCULA A DATA DE INÍCIO COM BASE NA RESPOSTA DO USUÁRIO
                const today = new Date();
                const startDate = new Date(today.setDate(today.getDate() - daysSmokeFree));

                const smokingHabits = {
                    dailyCigarettes: parseFloat(dailyCigarettes),
                    packPrice: parseFloat(packPrice.replace(',', '.')),
                    packSize: parseInt(packSize),
                    startDate: startDate.toISOString() // Salva a data de início calculada
                };
                localStorage.setItem('smokingData', JSON.stringify(smokingHabits));

                const feedbackContainer = document.getElementById('feedback-container');
                const successMessage = document.createElement('div');
                successMessage.className = 'success-message';
                successMessage.textContent = 'Dados Salvos com Sucesso!';
                feedbackContainer.innerHTML = ''; // Limpa mensagens antigas
                feedbackContainer.appendChild(successMessage);
                document.querySelector('.btn-save').disabled = true;

                setTimeout(() => {
                    window.location.href = 'progresso.html';
                }, 1500);

            } else {
                alert('Por favor, preencha todos os campos corretamente.');
            }
        });
    }

    // --- LÓGICA DA PÁGINA DE PROGRESSO (CÁLCULO ATUALIZADO) ---
    if (document.body.classList.contains('app-background-light') && document.querySelector('.progress-card')) {
        const storedData = localStorage.getItem('smokingData');
        if (storedData) {
            const data = JSON.parse(storedData);
            const startDate = new Date(data.startDate);
            const today = new Date();

            // Garante que a hora não interfira no cálculo de dias
            const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
            const todayDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            
            const daysWithoutSmoking = Math.round((todayDay - startDay) / (1000 * 60 * 60 * 24));
            
            const pricePerCigarette = data.packPrice / data.packSize;
            const totalCigarettesAvoided = daysWithoutSmoking * data.dailyCigarettes;

            // Cigarros Evitados
            document.querySelector('.progress-card:nth-of-type(1) p:nth-of-type(1) span').textContent = data.dailyCigarettes.toFixed(0);
            document.querySelector('.progress-card:nth-of-type(1) p:nth-of-type(2) span').textContent = (data.dailyCigarettes * 7).toFixed(0);
            document.querySelector('.progress-card:nth-of-type(1) p:nth-of-type(3) span').textContent = (data.dailyCigarettes * 30).toFixed(0);

            // Dinheiro Economizado
            const formatCurrency = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            document.querySelector('.progress-card:nth-of-type(2) p:nth-of-type(1) span').textContent = formatCurrency(data.dailyCigarettes * pricePerCigarette);
            document.querySelector('.progress-card:nth-of-type(2) p:nth-of-type(2) span').textContent = formatCurrency(data.dailyCigarettes * pricePerCigarette * 7);
            document.querySelector('.progress-card:nth-of-type(2) p:nth-of-type(3) span').textContent = formatCurrency(data.dailyCigarettes * pricePerCigarette * 30);

            // Tempo Recuperado (Ex: 5 minutos por cigarro)
            const minutesRecovered = totalCigarettesAvoided * 5;
            const hoursRecovered = Math.floor(minutesRecovered / 60);
            const daysRecovered = Math.floor(hoursRecovered / 24);
            const monthsRecovered = Math.floor(daysRecovered / 30);
            
            document.querySelector('.progress-card:nth-of-type(3) p:nth-of-type(1) span').textContent = `${(hoursRecovered % 24).toFixed(0)} horas`;
            document.querySelector('.progress-card:nth-of-type(3) p:nth-of-type(2) span').textContent = `${Math.floor(daysRecovered % 30 / 7)} semanas e ${daysRecovered % 7} dias`;
            document.querySelector('.progress-card:nth-of-type(3) p:nth-of-type(3) span').textContent = `${monthsRecovered} meses e ${Math.floor(daysRecovered % 30)} dias`;
        }
    }

    // --- LÓGICA DA PÁGINA DA COMUNIDADE (COM PERSONALIZAÇÃO) ---
    if (document.querySelector('.community-tabs')) {
        // Personalização da menção
        const userProfile = JSON.parse(localStorage.getItem('userProfile'));
        if (userProfile && document.getElementById('mentionName')) {
            document.getElementById('mentionName').textContent = `@${userProfile.nome}`;
        }
    
        const tabs = document.querySelectorAll('.tab-link');
        const contents = document.querySelectorAll('.tab-content');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetId = tab.dataset.target;
                const targetContent = document.getElementById(targetId);
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => { c.classList.remove('active'); c.style.display = 'none'; });
                tab.classList.add('active');
                targetContent.classList.add('active');
                targetContent.style.display = 'block';
            });
        });

        const messageInputArea = document.querySelector('.message-input-area');
        if (messageInputArea) {
            const chatWindow = document.querySelector('#chatContent .chat-window');
            const messageInput = messageInputArea.querySelector('input');
            const sendButton = messageInputArea.querySelector('button');
            sendButton.addEventListener('click', () => {
                const messageText = messageInput.value.trim();
                if (messageText && chatWindow) {
                    const messageElement = document.createElement('div');
                    messageElement.classList.add('chat-message');
                    messageElement.innerHTML = `<div class="avatar" style="background-color: #FFA726; color: white;">${userProfile ? userProfile.nome.charAt(0) : 'V'}</div><div class="message-content"><strong>${userProfile ? userProfile.nome : 'Você'}</strong><p>${messageText}</p></div>`;
                    chatWindow.appendChild(messageElement);
                    messageInput.value = '';
                    chatWindow.scrollTop = chatWindow.scrollHeight;
                }
            });
        }
        
        const addFriendButton = document.getElementById('addFriendBtn');
        if (addFriendButton) {
            addFriendButton.addEventListener('click', () => {
                alert('Funcionalidade de adicionar amigos em desenvolvimento!');
            });
        }
    }
});