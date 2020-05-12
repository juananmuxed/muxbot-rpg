<p align=center>
  <img width=300 src="./media/logo.png"/>
  <br>
  <span><strong>MuXBoT RPG</strong><br> A simply BoT for Discord with RPG functions.<br>
    <sub>Built with ❤︎ by
      <a href="https://github.com/juananmuxed">MuXeD</a>
    </sub>
</p>

![Version](https://img.shields.io/github/package-json/releaseversion/juananmuxed/muxbot-rpg?label=Version&logo=github) ![Release](https://img.shields.io/github/v/release/juananmuxed/muxbot-rpg?include_prereleases&label=Release&logo=github) [![License](https://img.shields.io/github/license/juananmuxed/muxbot-rpg?label=License)](https://github.com/juananmuxed/muxbot-rpg/blob/master/LICENSE) [![Discord](https://img.shields.io/discord/324463341819133953?color=purple&label=Discord&logo=discord)](https://discord.gg/UnBtckE) 
---

# 🤔 What is MuXBoT RPG
MuXBoT is a little bot for play in Discord to RPG games. A project to roll dices, have a good ambient music, and other future stuffs.

## 💻 Commands

### 🎲 **Roll Dices**
Used to roll all number of dices of any type (included unorthodox numbers like 17).
You have an option to launch dices secretly with the last arguments. If not, is public.

Two languages, english and spanish. The bot answer you in de command language. It's polite

```bash
!dice <roll> <modificators> <secret>
!dado <lanzamineto> <modificadores> <secreto> => Spanish Version

default: !dice = !dice 1d6 +0
```

**Examples**
```bash
!dice 3d20 +2 => Roll 3 dices of 20 and Add +2
```

🤖 _Output_

```bash
Roll 3 of 20
Results
[18,3,4]
Add
2
Individual Sum
[20,5,6]
Sum
25+2=27
```

The arguments is needed in order.
If you need launch a secret dice with no modifications (i.e.)

```
!dice 1d10 +0 secret
!dado 1d10 +0 secreto // Spanish version
```

### 🎷 **Music**
This commands is for ambient all your games. Use Youtube and your ****ing imagination.
You can add music or search directly. 

This add to queue
```bash
!play <link>/<searchedwords>

default: !play = first searched video from YT. Not recomended
```
This skip the actual song, if not other song, is like !stop command
```bash
!skip
```
This stop the queue and finalize the stream.
```bash
!stop
```
This pause the actual song. Use !resume to continue.
```bash
!pause
```
This resume the actual song.
```bash
!resume
```
This show a list of all the songs in the queue and the song actually sound.
```bash
!queue
```
Set the volume of actual song. The ```<volume>``` must be between 1 and 100
```bash
!volume <volume>
```

🇪🇸 **Versiones en Español**
```bash
!reproducir <enlace>/<busqueda>
!saltar
!parar
!pausa
!continuar
!lista
!volumen <volumen>
```
El **BoT** te contesta en Español 😱

---

## 🍰 Contributing
Please read [CONTRIBUTING](CONTRIBUTING.md) for details on our [CODE OF CONDUCT](CODE_OF_CONDUCT.md), and the process for submitting pull requests.

---

## 🥪 Installation

**NOTE**: NodeJS 12.0.0 or higher is required.

```bash
# Clone the repo
$ git clone https://github.com/juananmuxed/muxbot-rpg.git

# Change the working directory to muxbot-rpg
$ cd muxbot-rpg
```
If you are interested in up to Heroku or other services. You need to push a master to Heroku and configure the variables from .env in Heroku (i.e.)

---

## 📜 Configuration 
Before running the software we have to add a minimum configuration to our project.

First we are going to create a file that contains our variables, this file must be a **.env**
``./.env``

``` env
DISCORD_TOKEN=DISCORD_GENERATED_FOR_THE_BOT
GUILD_ID=ID_FROM_YOUR_SERVER_DISCORD
ROL_CHANNEL=CHANNEL_ID_FOR_DICE_COMMANDS
MUSIC_CHANNEL=CHANNEL_ID_FOR_MUSIC_COMMANDS
RADIO_CHANNEL=VOIC_CHANNEL_ID_FOR_STREAM_MUSIC
KEY_YOUTUBE=KEY_API_FOR_YT
PREFIX=YOUR_PREFIX
```
If you deploy your bot in Heroku or other services, this Variables must be set manually in the configuration of the project.

---

## 🧠 Usage
**Now we are ready to run the software in local**. Open your terminal.
``` bash
# Terminal
$ cd /yourprojectpath
$ node index.js
# or if you have nodemon and need to develop
$ nodemon index.js 
```

---

## 📂 Repositories
- [Discord.js](https://github.com/discordjs/discord.js)
- [FFMPEG](https://www.npmjs.com/package/ffmpeg-static)
- [Enmap](https://www.npmjs.com/package/enmap)
- [YTDL](https://www.npmjs.com/package/ytdl-core)
- [YoutubeSearch](https://www.npmjs.com/package/youtube-search)
- [dotenv](https://www.npmjs.com/package/dotenv)

---

## ☕️ Buy Me a Coffee
[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/U7U21M2BE)

---

## 📝 License
This project is under MIT - Details [MIT Licence](https://github.com/juananmuxed/muxbot-rpg/blob/master/LICENSE)

MIT © [MuXeD](https://muxed.es/)
