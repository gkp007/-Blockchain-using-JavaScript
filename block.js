const hexToBinary = require("hex-to-binary");
const { GENESIS_DATA, MINE_RATE } = require("./config");
const cryptoHash = require("./crypto-hash");
class Block {
  constructor({ timestamp, prevHash, hash, data, nonce, difficulty, blockNo}) {
    this.blockNo = blockNo;
    this.timestamp = timestamp;
    this.nonce = nonce;
    this.difficulty = difficulty;
    this.data = data;
    this.prevHash = prevHash;
    this.hash = hash;
        
  }
  static genesis() {
    return new this(GENESIS_DATA);
  }
  static mineBlock({ prevBlock, data }) {
    let hash, timestamp;
    const prevHash = prevBlock.hash;
    const blockNo = prevBlock.blockNo + 1;
    let { difficulty } = prevBlock;

    let nonce = 0;
    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty({
        originalBlock: prevBlock,
        timestamp,
      });
      hash = cryptoHash(timestamp, prevHash, data, nonce, difficulty, blockNo);
    } while (
      hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty)
    );
    return new this({
      timestamp,
      prevHash,
      data,
      difficulty,
      nonce,
      hash,
      blockNo,
    });
  }

  static adjustDifficulty({ originalBlock, timestamp }) {
    const { difficulty } = originalBlock;
    if (difficulty < 1) return 1;
    const difference = timestamp - originalBlock.timestamp;
    if (difference > MINE_RATE) return difficulty - 1;
    return difficulty + 1;
  }
}

module.exports = Block;
