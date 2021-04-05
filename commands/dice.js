const { launchDice , sleep, _ } = require('../utils/utils')

exports.run = async (client,message,args,lang) => {
    const rolchannel = client.channels.cache.get(process.env.ROL_CHANNEL),
        channelid = message.channel.id;
    
    if(channelid !== rolchannel.id) return;
    message.react('🎲');
    if(!args[2]) rolchannel.send(_('Rolling',lang) + ' 🎲');
    let msg = '',
    dicerol = [] ,fields = [],
    color , title , sum , dices, faces;
    
    if(!args[0]) {
        dices = 1, faces = 6;
        dicerol = await launchDice(dices,faces);
        fields.push({name:_('Result',lang),value:JSON.stringify(dicerol)});
        title = _('Generic roll 1D6',lang);
        color='#be65c9';
    } else {
        let launch = args[0].toLowerCase();
        dices = parseInt(launch.split('d')[0]);
        faces = parseInt(launch.split('d')[1]);
        if(!dices && !faces) {
            msg = _('Incorrect format "5d8" => 5 dices of 8 faces',lang);
        } else {
            if(!dices) dices = 1;
            if(!faces) faces = 6;
            dicerol = await launchDice(dices,faces);
            fields.push({name:_('Result',lang),value:JSON.stringify(dicerol)});
            sum = dicerol.reduce((total,num) => total +  num);
            if(args[1]){
                let key = args[1].split('')[0];
                let resultsMod = [];
                switch (key) {
                    case '+':
                        let add = args[1].split('+')[1]
                        sum = sum + '+' + add + '=' + (parseInt(sum) + parseInt(add))
                        fields.push({name:_('Add',lang),value:add})
                        if(dicerol.length > 1) {
                            for (let x = 0; x < dicerol.length; x++) {
                                let res = parseInt(dicerol[x]) + parseInt(add);
                                resultsMod.push(res);
                            }
                            fields.push({name:_('Individual sum',lang),value:JSON.stringify(resultsMod)});
                        }
                        break
                    case '-':
                        let sustract = args[1].split('-')[1]
                        sum = sum + '-' + sustract + '=' + (parseInt(sum) - parseInt(sustract));
                        fields.push({name:_('Subtract',lang),value:sustract});
                        if(dicerol.length > 1) {
                            for (let x = 0; x < dicerol.length; x++) {
                                let res = parseInt(dicerol[x]) - parseInt(sustract);
                                resultsMod.push(res);
                            }
                            fields.push({name:_('Individual subtract',lang),value:JSON.stringify(resultsMod)});
                        }
                        break
                    default:
                        fields.push({name:_('Error in format, try +/-<value>',lang),value:JSON.stringify(resultsMod)});
                        break
                }
            }
            fields.push({name:_('Sum',lang),value:sum});
        }
        title = _('Roll',lang) + ' ' + dices + 'D' + faces;
        color='#65cc43';
    }
    let embed = {
        color: color,
        title: title,
        author: {
            name: _('The Dice Launcher', lang),
            icon_url: client.user.avatarURL()
        },
        description: message.author.username + ' ' + _('rolls',lang) + ' ' + dices + ' ' + _('of',lang) + ' ' + faces + ' 🎲',
        timestamp: new Date(),
        fields:fields
    }
    await sleep(1)
    if(args[2] === _('secret',lang)){
        message.author.send({ embed: embed });
    } else {
        rolchannel.send({ embed: embed });
    }
}