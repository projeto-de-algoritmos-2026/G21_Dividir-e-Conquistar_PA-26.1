
document.addEventListener('DOMContentLoaded', () => {
    const btnRun = document.getElementById('btn-run-benchmark');
    const resultMatch = document.getElementById('perfect-match-result');
    const timeBruteForce = document.getElementById('time-brute-force');
    const timeDivideConquer = document.getElementById('time-divide-conquer');

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

        // Timeout curto para permitir que a thread atualize a UI antes do gargalo
        setTimeout(() => {

            // 1. Gerar os dados em memória (DataGenerator)
            const population = window.dataGenerator.generatePopulation();
            const testVector = window.dataGenerator.generateStressTestVector();

            // Preparar a base convertendo para o ranking relativo ao vetor de teste
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
                    // countInversionsDivideAndConquer já faz a cópia internamente
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

                    // Deixa os valores engatilhados na UI (O Commit 8 irá focar na exibição)
                    resultMatch.innerHTML = `<strong>${bestMatchDC}</strong> (${minInversionsDC} inv.)`;
                    timeDivideConquer.textContent = `${timeDC} ms`;
                    timeBruteForce.textContent = `${timeBF} ms`;

                    btnRun.disabled = false;
                    btnRun.querySelector('.btn-text').textContent = 'Executar Benchmark';

                }, 50);
            }, 50);
        }, 50);
    });
});
