/**
 * dataGenerator.js
 * Cria base de dados populacional com perfis e gera vetor de teste para o modo estresse.
 */

const DataGenerator = (() => {
    const DEFAULT_ITEM_COUNT = 500;
    const DEFAULT_POPULATION_SIZE = 50000;
    const DEFAULT_ARCHETYPE_COUNT = 5;
    const DEFAULT_NOISE_RATIO = 0.04;

    const createSequence = (length) => Array.from({ length }, (_, index) => index + 1);

    const cloneArray = (array) => array.slice();

    const shuffleArray = (array) => {
        const result = cloneArray(array);
        for (let i = result.length - 1; i > 0; i -= 1) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
    };

    const perturbRanking = (ranking, swapCount) => {
        const mutated = cloneArray(ranking);
        const length = mutated.length;

        for (let i = 0; i < swapCount; i += 1) {
            const a = Math.floor(Math.random() * length);
            let b = Math.floor(Math.random() * length);
            if (a === b) {
                b = (a + 1) % length;
            }
            [mutated[a], mutated[b]] = [mutated[b], mutated[a]];
        }

        return mutated;
    };

    const createArchetypeRankings = ({ itemCount = DEFAULT_ITEM_COUNT, archetypeCount = DEFAULT_ARCHETYPE_COUNT } = {}) => {
        const baseRanking = createSequence(itemCount);
        const archetypes = [];

        for (let archetypeIndex = 0; archetypeIndex < archetypeCount; archetypeIndex += 1) {
            const offset = Math.floor((itemCount / archetypeCount) * archetypeIndex);
            const prototype = baseRanking.map((value, index) => {
                const shifted = (index + offset) % itemCount;
                return baseRanking[shifted];
            });

            archetypes.push(perturbRanking(prototype, 4 + archetypeIndex * 2));
        }

        return archetypes;
    };

    const generatePopulation = ({
        size = DEFAULT_POPULATION_SIZE,
        itemCount = DEFAULT_ITEM_COUNT,
        archetypeCount = DEFAULT_ARCHETYPE_COUNT,
        noiseRatio = DEFAULT_NOISE_RATIO,
    } = {}) => {
        const archetypes = createArchetypeRankings({ itemCount, archetypeCount });
        const population = [];

        for (let profileIndex = 0; profileIndex < size; profileIndex += 1) {
            const archetypeIndex = profileIndex % archetypeCount;
            const baseRanking = archetypes[archetypeIndex];
            const swaps = Math.max(1, Math.floor(itemCount * noiseRatio * Math.random()));
            const ranking = perturbRanking(baseRanking, swaps);

            population.push({
                id: `perfil-${profileIndex + 1}`,
                archetype: `A${archetypeIndex + 1}`,
                ranking,
            });
        }

        return population;
    };

    const generateStressTestVector = ({
        itemCount = DEFAULT_ITEM_COUNT,
        perturbationRatio = 0.05,
    } = {}) => {
        const baseRanking = createSequence(itemCount);
        const perturbations = Math.max(3, Math.floor(itemCount * perturbationRatio));
        return perturbRanking(baseRanking, perturbations);
    };

    return {
        generatePopulation,
        generateStressTestVector,
        createArchetypeRankings,
    };
})();

if (typeof window !== 'undefined') {
    window.dataGenerator = DataGenerator;
}
