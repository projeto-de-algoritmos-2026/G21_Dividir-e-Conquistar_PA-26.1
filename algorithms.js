const Algorithms = (() => {

    const countInversionsBruteForce = (array) => {
        let inversions = 0;
        const n = array.length;

        for (let i = 0; i < n; i++) {
            for (let j = i + 1; j < n; j++) {
                if (array[i] > array[j]) {
                    inversions++;
                }
            }
        }

        return inversions;
    };

    /**
     * Mescla duas metades ordenadas e conta as inversões cruzadas.
     * @param {Array<number>} array - O vetor original
     * @param {Array<number>} temp - Vetor temporário para o merge
     * @param {number} left - Índice inicial da metade esquerda
     * @param {number} mid - Índice final da metade esquerda
     * @param {number} right - Índice final da metade direita
     * @returns {number} - Contagem de inversões cruzadas
     */
    const mergeAndCount = (array, temp, left, mid, right) => {
        let i = left;
        let j = mid + 1;
        let k = left;
        let inversions = 0;

        while ((i <= mid) && (j <= right)) {
            if (array[i] <= array[j]) {
                temp[k++] = array[i++];
            } else {
                temp[k++] = array[j++];
                inversions += (mid - i + 1);
            }
        }

        while (i <= mid) {
            temp[k++] = array[i++];
        }

        while (j <= right) {
            temp[k++] = array[j++];
        }

        for (i = left; i <= right; i++) {
            array[i] = temp[i];
        }

        return inversions;
    };

    return {
        countInversionsBruteForce,
        mergeAndCount
    };
})();

if (typeof window !== 'undefined') {
    window.algorithms = Algorithms;
}
