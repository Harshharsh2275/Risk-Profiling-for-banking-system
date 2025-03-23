import Block from "./block";
 
interface Blockchain {
    chain: any;
    addBlock(arg: any): any;
    isValidChain(arg: any): any;
}

class Blockchain implements Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock(arg: any) {
        const block = Block.createBlock({lastBlock: this.chain[this.chain.length - 1], data: arg});
        this.chain.push(block);
        return block;
    }

    isValidChain(arg: any) {
        if(JSON.stringify(this.chain[0]) !== JSON.stringify(Block.genesis())) return false;

        for (let i = 1; i < this.chain.length; i++) {
            const block = this.chain[i];
            const lastBlock = this.chain[i-1];
            if(block.lastHash !== lastBlock.hash || block.hash !== lastBlock.blockHash(block)) return false;
        }

        return true;
    }
}

export default Blockchain;