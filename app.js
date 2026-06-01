
document.addEventListener('DOMContentLoaded', () => {
    const btnRun = document.getElementById('btn-run-benchmark');
    const resultMatch = document.getElementById('perfect-match-result');
    const timeBruteForce = document.getElementById('time-brute-force');
    const timeDivideConquer = document.getElementById('time-divide-conquer');

    const barBF = document.getElementById('bar-brute-force');
    const barDC = document.getElementById('bar-divide-conquer');

    // Mapeia o ranking do perfil para os índices do vetor de teste
    const createRelativeRanking = (profileRanking, testRanking) => {
        const testMap = new Map();
        testRanking.forEach((item, index) => testMap.set(item, index));
        return profileRanking.map(item => testMap.get(item));
    };

    btnRun.addEventListener('click', () => {
        btnRun.disabled = true;
        btnRun.querySelector('.btn-text').textContent = 'Preparando Base...';
        resultMatch.textContent = 'Processando...';
        timeBruteForce.textContent = '-- ms';
        timeDivideConquer.textContent = '-- ms';

        // Reseta o gráfico
        if (barBF) barBF.style.width = '0%';
        if (barDC) barDC.style.width = '0%';

        setTimeout(() => {

            const population = window.dataGenerator.generatePopulation();
            const testVector = window.dataGenerator.generateStressTestVector();

            const relativeRankings = population.map(profile => ({
                id: profile.id,
                ranking: createRelativeRanking(profile.ranking, testVector)
            }));

            btnRun.querySelector('.btn-text').textContent = 'Testando O(n log n)...';

            // 2. Benchmark: Dividir e Conquistar O(n log n)
            setTimeout(() => {
                let bestMatchDC = null;
                let minInversionsDC = Infinity;

                const startDC = performance.now();
                for (let i = 0; i < relativeRankings.length; i++) {
                    const inv = window.algorithms.countInversionsDivideAndConquer(relativeRankings[i].ranking);
                    if (inv < minInversionsDC) {
                        minInversionsDC = inv;
                        bestMatchDC = relativeRankings[i].id;
                    }
                }
                const endDC = performance.now();
                const timeDC = (endDC - startDC).toFixed(2);

                btnRun.querySelector('.btn-text').textContent = 'Testando O(n²)...';

                // 3. Benchmark: Força Bruta O(n^2)
                setTimeout(() => {
                    let minInversionsBF = Infinity;

                    const startBF = performance.now();
                    for (let i = 0; i < relativeRankings.length; i++) {
                        const inv = window.algorithms.countInversionsBruteForce(relativeRankings[i].ranking);
                        if (inv < minInversionsBF) {
                            minInversionsBF = inv;
                        }
                    }
                    const endBF = performance.now();
                    const timeBF = (endBF - startBF).toFixed(2);

                    resultMatch.innerHTML = `<strong>${bestMatchDC}</strong> (${minInversionsDC} inv.)`;
                    timeDivideConquer.textContent = `${timeDC} ms`;
                    timeBruteForce.textContent = `${timeBF} ms`;

                    // Commit 8: Plotagem visual do comparativo
                    const maxTime = Math.max(timeBF, timeDC);
                    setTimeout(() => {
                        barBF.style.width = `${(timeBF / maxTime) * 100}%`;
                        const dcPercentage = Math.max((timeDC / maxTime) * 100, 1); // 1% mínimo para visualização
                        barDC.style.width = `${dcPercentage}%`;
                    }, 50);

                    btnRun.disabled = false;
                    btnRun.querySelector('.btn-text').textContent = 'Executar Benchmark';

                }, 50);
            }, 50);
        }, 50);
    });

    // ==========================================
    // Commit 11: Modo Match (Estilo Tinder)
    // ==========================================
    const btnFindMatches = document.getElementById('btn-find-matches');
    const matchesList = document.getElementById('matches-list');

    // Nomes aleatórios para os perfis
    const mockNames = ["Ana", "Carlos", "Beatriz", "João", "Mariana", "Pedro", "Julia", "Lucas", "Camila", "Rafael"];
    const getRandomName = () => mockNames[Math.floor(Math.random() * mockNames.length)];

    if (btnFindMatches && matchesList) {
        btnFindMatches.addEventListener('click', () => {
            btnFindMatches.disabled = true;
            btnFindMatches.textContent = 'Procurando...';
            
            setTimeout(() => {
                // 1. Obter ranking atual do usuário (vetor com os data-ids, ex: [2, 1, 3, 5, 4])
                const userRanking = window.dragDropManager.getCurrentRanking();
                
                // 2. Gerar população local de 1000 pessoas, cada uma com ranking de tamanho 5
                const localPopulation = window.dataGenerator.generatePopulation({
                    size: 1000,
                    itemCount: 5,
                    archetypeCount: 5,
                    noiseRatio: 0.4
                });

                // 3. Preparar ranking relativo para calcular inversões cruzadas
                const userMap = new Map();
                userRanking.forEach((item, index) => userMap.set(item, index));

                const scoredProfiles = localPopulation.map(profile => {
                    // Mapeia o ranking da pessoa fictícia para a base do usuário
                    const relativeRanking = profile.ranking.map(item => userMap.get(item));
                    
                    // Conta inversões com Dividir e Conquistar O(n log n)
                    const inversions = window.algorithms.countInversionsDivideAndConquer(relativeRanking);
                    
                    // Afinidade: máximo de inversões possíveis em n=5 é 10.
                    const maxInversions = 10;
                    const affinity = Math.max(0, 100 - (inversions / maxInversions) * 100);

                    return {
                        id: profile.id,
                        name: getRandomName(),
                        inversions,
                        affinity: affinity.toFixed(0)
                    };
                });

                // 4. Ordenar perfis pelas menores inversões
                scoredProfiles.sort((a, b) => a.inversions - b.inversions);
                
                // 5. Pegar os Top 3
                const top3 = scoredProfiles.slice(0, 3);

                // 6. Atualizar a UI
                matchesList.innerHTML = ''; // limpa o estado vazio
                
                top3.forEach((match, index) => {
                    const avatars = ['👩🏻‍🦰', '👨🏽‍🦱', '👱🏼‍♀️'];
                    
                    const cardHTML = `
                        <div class="match-card tinder-card">
                            <div class="tinder-avatar">${avatars[index]}</div>
                            <div class="tinder-info">
                                <h4>${match.name}</h4>
                                <p><strong style="color: var(--primary-color)">${match.affinity}% Compatível</strong></p>
                                <small>${match.inversions} inversões matemáticas</small>
                            </div>
                        </div>
                    `;
                    matchesList.innerHTML += cardHTML;
                });

                btnFindMatches.disabled = false;
                btnFindMatches.textContent = 'Encontrar Meus Matches';
            }, 300);
        });
    }
});
