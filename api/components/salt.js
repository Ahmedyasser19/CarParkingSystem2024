// this function creates random 10 numbers that will be added to the creatinon of the qr code

function createSalt() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let salt = '';
    for (let i = 0; i < 10; i++) {
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        salt += alphabet[randomIndex];
    }
    return salt;
}


module.exports = createSalt;
