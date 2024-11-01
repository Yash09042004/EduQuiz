declare module 'seedrandom' {
    function seedrandom(seed?: string | number, options?: { global?: boolean }): () => number;
    namespace seedrandom {}
    export = seedrandom;
}
