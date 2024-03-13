export const EPOCH_INTERVAL = 9600;

// NOTE could get this from an outside source since it changes slightly over time
export const BLOCK_RATE_SECONDS = 3;

interface IAddresses {
  [key: number]: { [key: string]: string };
}
export const addresses: IAddresses = {
  43114: {
    USDT_ADDRESS: "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664",
    TOKEN_ADDRESS: "0x330Ed4E601AEcE9d0eA19a9e67Ef6Bcd454Fb01D",
    PRESALE_ADDRESS: "0xd50D57d82bEca7a5aA8D4e8e6c52a274c77e7449"
  },
};
