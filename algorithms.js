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

    return {
        countInversionsBruteForce
    };
})();

if (typeof window !== 'undefined') {
    window.algorithms = Algorithms;
}
