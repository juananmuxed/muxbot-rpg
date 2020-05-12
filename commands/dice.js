const { launchDice , sleep } = require('../utils/utils')

exports.run = async (client,message,args) => {
    const rolchannel = client.channels.cache.get(process.env.ROL_CHANNEL)

    const channelid = message.channel.id
    if(channelid !== rolchannel.id) return
    message.react('🎲')
    if(!args[2]) {rolchannel.send('Rolling 🎲')}
    let msg = ''
    let dicerol = [] , fields = []
    let color , title , sum , dices, faces
    
    if(!args[0]) {
        dices = 1
        faces = 6
        dicerol = await launchDice(dices,faces)
        fields.push({name:'Result',value:JSON.stringify(dicerol)})
        title = 'Generic roll 1D6'
        color='#be65c9'
        msg = message.author.username + ' rolls 1 of 6 🎲'
    }
    else{
        let launch = args[0].toLowerCase()
        dices = launch.split('d')[0]
        faces = launch.split('d')[1]
        if(!dices && !faces) {
            msg = 'Incorrect format "5d8" => 5 dices of 8 faces'
        }
        else{
            if(!dices){
                dices = 1
            }
            if(!faces){
                faces = 6
            }
            msg = message.author.username + ' rolls ' + dices + ' of ' + faces + ' 🎲'
            dicerol = await launchDice(dices,faces)
            fields.push({name:'Result',value:JSON.stringify(dicerol)})
            sum = dicerol.reduce((total,num) => total +  num)
            if(args[1]){
                let key = args[1].split('')[0]
                let resultsMod = []
                switch (key) {
                    case '+':
                        let add = args[1].split('+')[1]
                        sum = sum + '+' + add + '=' + (parseInt(sum) + parseInt(add))
                        fields.push({name:'Add',value:add})
                        if(dicerol.length > 1) {
                            for (let x = 0; x < dicerol.length; x++) {
                                let res = parseInt(dicerol[x]) + parseInt(add)
                                resultsMod.push(res)
                            }
                            fields.push({name:'Individual sum',value:JSON.stringify(resultsMod)})
                        }
                        break
                    case '-':
                        let subtract = args[1].split('-')[1]
                        sum = sum + '-' + subtract + '=' + (parseInt(sum) - parseInt(subtract))
                        fields.push({name:'Subtract',value:subtract})
                        if(dicerol.length > 1) {
                            for (let x = 0; x < dicerol.length; x++) {
                                let res = parseInt(dicerol[x]) - parseInt(subtract)
                                resultsMod.push(res)
                            }
                            fields.push({name:'Individual subtract',value:JSON.stringify(resultsMod)})
                        }
                        break
                    default:
                        fields.push({name:'Incorrect value',value:'Use +/-<value>'})
                        break
                }
            }
            if(dices !== 1){
                fields.push({name:'Sum',value:sum})
            }
            msg = message.author.username + ' rolls ' + dices + ' of ' + faces + ' 🎲'
        }
        title = 'Roll ' + dices + 'D' + faces
        color='#65cc43'
    }
    let embed = {
        color: color,
        title: title,
        author: {
            name: 'The Dice Launcher',
            icon_url: client.user.avatarURL()
        },
        description: msg,
        timestamp: new Date(),
        fields:fields
    }
    await sleep(1)
    if(args[2] === 'secret'){
        message.author.send({ embed: embed })
    }
    else{
        rolchannel.send({ embed: embed })
    }
}