export function swap(array, i, j) {
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}

export const shuffle = (array) => {
    if (array instanceof Array) {
        for (let i = array.length - 1; i > 0; i--) {
            const random = Math.floor(Math.random() * i);
            swap(array, i, random);
        }
    }
};
