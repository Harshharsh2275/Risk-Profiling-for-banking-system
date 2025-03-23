const sha256 = require("crypto-js/sha256");

interface BlockInterface {
    timestamp: Date;
    transactions: Array<any>;
    previousHash: string;
    hash: string;
    validator: string;
    signature: string;
    toString(): string;
    nonce: number;
}

class Block implements BlockInterface {
    timestamp = new Date();
    transactions;
    previousHash;
    hash;
    validator;
    signature;
    nonce: number;

    constructor(transactions: Array<any>, previousHash: string, hash:string, nonce: number, validator: string) {
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.nonce = nonce;
        this.hash = hash;
        this.validator = validator;
    }

    toString(): string {
        return `Block: `
    }

    static genesis() {
        return new this(["genesis transactions"], 'genesis hash', this.hash(new Date(), "", []), 1, "genesis block");
    }

    static hash(timestamp: Date, lastHash: string, data: Array<any>) {
        return sha256(`${timestamp}.${lastHash}.${data}`).toString();
    }

    static createBlock(block: {lastBlock: BlockInterface, data: Array<any>}) {
        let hash;
        const lastHash = block.lastBlock.hash;
        const data = block.data;
        const timestamp = new Date();
        hash = Block.hash(timestamp, lastHash, data);
        return new this(data, lastHash, hash, block.lastBlock.nonce + 1, Block.blockHash(block.lastBlock));
    }

    static blockHash(block: any) {
        const {timestamp, lastHash, data} = block;
        return Block.hash(timestamp, lastHash, data);
    } 
}

export default Block;