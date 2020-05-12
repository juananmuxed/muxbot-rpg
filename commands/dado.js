const { launchDice , sleep } = require('../utils/utils')

exports.run = async (client,message,args) => {
    const rolchannel = client.channels.cache.get(process.env.ROL_CHANNEL)

    const channelid = message.channel.id
    if(channelid !== rolchannel.id) return
    message.react('🎲')
    if(!args[2]) {rolchannel.send('Lanzando 🎲')}
    let msg = ''
    let dicerol = [] , fields = []
    let color , title , sum , dices, faces
    
    if(!args[0]) {
        dices = 1
        faces = 6
        dicerol = await launchDice(dices,faces)
        fields.push({name:'Resultado',value:JSON.stringify(dicerol)})
        title = 'Tirada genérica 1D6'
        color='#be65c9'
        msg = message.author.username + ' ha lanzando 1 de 6 🎲'
    }
    else{
        let launch = args[0].toLowerCase()
        dices = launch.split('d')[0]
        faces = launch.split('d')[1]
        if(!dices && !faces) {
            msg = 'Formato de dado Incorrecto "5d8" => 5 dados de 8 caras'
        }
        else{
            if(!dices){
                dices = 1
            }
            if(!faces){
                faces = 6
            }
            msg = message.author.username + ' ha lanzando ' + dices + ' de ' + faces + ' 🎲'
            dicerol = await launchDice(dices,faces)
            fields.push({name:'Resultado',value:JSON.stringify(dicerol)})
            sum = dicerol.reduce((total,num) => total +  num)
            if(args[1]){
                let key = args[1].split('')[0]
                let resultsMod = []
                switch (key) {
                    case '+':
                        let add = args[1].split('+')[1]
                        sum = sum + '+' + add + '=' + (parseInt(sum) + parseInt(add))
                        fields.push({name:'Añade',value:add})
                        if(dicerol.length > 1) {
                            for (let x = 0; x < dicerol.length; x++) {
                                let res = parseInt(dicerol[x]) + parseInt(add)
                                resultsMod.push(res)
                            }
                            fields.push({name:'Suma invidivudal',value:JSON.stringify(resultsMod)})
                        }
                        break
                    case '-':
                        let sustract = args[1].split('-')[1]
                        sum = sum + '-' + sustract + '=' + (parseInt(sum) - parseInt(sustract))
                        fields.push({name:'Añade',value:sustract})
                        if(dicerol.length > 1) {
                            for (let x = 0; x < dicerol.length; x++) {
                                let res = parseInt(dicerol[x]) - parseInt(sustract)
                                resultsMod.push(res)
                            }
                            fields.push({name:'Resta invidivudal',value:JSON.stringify(resultsMod)})
                        }
                        break
                    default:
                        fields.push({name:'Valor Incorrecto',value:'Prueba con +/-<value>'})
                        break
                }
            }
            if(dices !== 1){
                fields.push({name:'Suma',value:sum})
            }
            msg = message.author.username + ' ha lanzando ' + dices + ' de ' + faces + ' 🎲'
        }
        title = 'Tirada ' + dices + 'D' + faces
        color='#65cc43'
    }
    let embed = {
        color: color,
        title: title,
        author: {
            name: 'El Lanzador de Dados',
            icon_url: client.user.avatarURL()
        },
        description: msg,
        timestamp: new Date(),
        fields:fields
    }
    await sleep(1)
    if(args[2] === 'secreto'){
        message.author.send({ embed: embed })
    }
    else{
        rolchannel.send({ embed: embed })
    }
}