async function launchDice (dices , faces) {
    try {
        return Array.from({length:dices}).fill(1).map( (v) => {
            return v * Math.floor((Math.random() * faces) + 1);
        });
    } catch (error) {
        return error;
    }
}

async function sleep(s){
    return new Promise((resolve,reject) => {
        setTimeout(() => {
            resolve(true);
        },1000 * s);
    });
}

function _(string, lang) {
    file = lang != 'en' ? require('./../language/' + lang + '.json') : null ;
    return !file || !file.strings[string] ? string : file.strings[string];
}

module.exports = { launchDice , sleep, _ }