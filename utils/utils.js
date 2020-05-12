async function launchDice (dices , faces) {
    try {
        let results = []
        for (let i = 0; i < dices; i++) {
            let result = Math.floor((Math.random() * faces) + 1)
            results.push(result)
        }
        return results
    } catch (error) {
        return error
    }
}

async function sleep(s){
    return new Promise((resolve,reject) => {
         setTimeout(() => {
              resolve(true)
         },1000 * s)
    })
}

module.exports = { launchDice , sleep }