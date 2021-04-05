module.exports = (client) => {
    console.log(`🟢 ${client.user.username} inda haus!`);
    client.user.setPresence( {
        activity: {
            name: `${client.users.cache.size} souls. 🤖`,
            type: 'WATCHING'
        },
        status: 'online'
     });
}