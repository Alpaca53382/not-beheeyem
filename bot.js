const Discord = require("discord.js"), // Require Node modules and initialize Discord client
    notbeheeyem = new Discord.Client(),
    request = require("request"),
    otherAliases = require('./otherAliases.js'),
    species = require("./dexlist.js").species,
    fs = require('fs');

console.log("Starting Not-Beheeyem™...");

notbeheeyem.on("ready", function() {
    console.log("Not-Beheeyem™ is active! Currently serving in " + String(notbeheeyem.guilds.size) + " guilds.\n");
    notbeheeyem.user.setActivity(`you on shard 15 bajillion jk lol`, { type: 3 }); //Set "playing" status on the user's profile


});

notbeheeyem.on("message", msg => { // Fires when a message is sent that can be detected by Beheeyem
    if (msg.author.id != notbeheeyem.user.id && !msg.author.bot) { // Ensures Beheeyem doesn't detect messages from bots or itself 
        /*if (msg.content.startsWith(config.prefix)) { // Check to see if the message is an attempted command
            let commandstring = msg.content.substring(config.prefix.length),
                cmd = commandstring.split(" ")[0], // Split the message into more readable argument/command portions
                args = commandstring.substring(cmd.length + 1);

            if (commands[cmd]) { // If a command by the name of the attempted name exists, try to fire it
                try {
                    commands[cmd].action(msg, args, beheeyem);
                } catch (err) {
                    console.error(err); // If unsuccessful, log the error.
                }
                // TO MOVE TO SEPARATE FILES
            } else if (cmd == "obtain") {
                msg.channel.send("Honestly, just use Bulbapedia. The encounter data on the web is so inconsistent and undreadable that there's no way I could create an obtainability command. Sorry about that. 🙁");
            } else if (cmd == "deathbird") {
                msg.channel.send('', {
                    file: "https://i.imgur.com/pIxQQXA.png",
                    name: "DEATHBIRD.png"
                });
            } else if (cmd == "youtried") {
                msg.channel.send('', {
                    file: "https://i.imgur.com/bAxMdQ0.png",
                    name: "Filename.jpeg.gif.webp.mp4.exe.bat.sh.app.png"
                });
            } else if (msg.author.id == 120887602395086848) { // Commands only to be fired by the bot's owner
                if (cmd == 'eval') {
                    beheeyem.shard.broadcastEval(args)
                        .then(results => {
                            msg.channel.send("", {
                                embed: {
                                    title: '🖥 JavaScript Eval',
                                    fields: [{
                                            name: "Input",
                                            value: args
                                        },
                                        {
                                            name: "Output",
                                            value: String(results) // jshint ignore:line
                                        }
                                    ],
                                    color: 5561189
                                }
                            });
                        })
                        .catch(err => {
                            msg.channel.send("", {
                                embed: {
                                    title: '⚠ Error',
                                    fields: [{
                                            name: "Input",
                                            value: args
                                        },
                                        {
                                            name: "Error",
                                            value: err.toString()
                                        }
                                    ],
                                    color: 16724015
                                }
                            });
                        });
                }
            }
        } else if (msg.content == notbeheeyem.user) {
            msg.react(notbeheeyem.emojis.get('560835223093510146'))
                .catch(console.error)
        } else { // If a command was fired, do not check for italics in the messsage.*/
            try {
                checkItalics(msg);
            } catch (e) {
                console.log(e);
            }
        //}
    }
});


notbeheeyem.login(process.env.TOKEN);

function capitalizeFirstLetter(string) { // Simple function to capitalize the first letter in a string.
    return string.charAt(0).toUpperCase() + string.slice(1);
}

let customFiles = {};
fs.readdir("./custom", (err, files) => {
    files.forEach(file=>customFiles[file.replace(/\..+/,"")]=file);
});

function checkItalics(msg) { // Function to be fired if a message is valid for italicization checking
    let isFound = false,
        pokePast = [],
        pokeCount = 0,
        splits = [msg.content.split("*"), msg.content.split("_")];
    var pokeName;
    for (let j = 0; j < 2; j++) {
        if (isFound) return;
        for (var i = 1; i < splits[j].length - 1; i++) { // Check each substring between asterixes/underscores
            pokeName = splits[j][i].toLowerCase()
                .replace(/\bprandom\b/,species[Math.floor(Math.random() * species.length)])
                .replace(/\beee+\b/,"joltik")
                .replace(/\baaa+\b/,"rowlet");
            let isShiny = false, // Sprite defaults to a non-shiny version
                urlBuild = 'https://play.pokemonshowdown.com/sprites/xyani/', // Default constructor for a sprite
                a = otherAliases.aliases(msg.guild.id);
            for (let r in a) {
                // if (pokeName.match(new RegExp("\\b"+r+"\\b")) == null) pokeName = pokeName.replace(new RegExp("\\b"+r+"\\b"),a[r]);
                if (pokeName.startsWith(r)) pokeName = pokeName.replace(`${r} `, `${a[r]} `);
                if (pokeName.endsWith(r)) pokeName = pokeName.replace(` ${r}`, ` ${a[r]}`);
                if (pokeName == r) pokeName = a[r];
                if (pokeName.indexOf(` ${r} `) > -1) pokeName = pokeName.replace(` ${r} `, ` ${a[r]} `);
            }
            if (pokeName.split(" ")[0] == "mega") {
                pokeName = pokeName.substring(pokeName.split(" ")[0].length + 1) + "-mega";
            } else if (pokeName.split(' ')[0] == "alolan") {
                pokeName = pokeName.substring(pokeName.split(" ")[0].length + 1) + "-alola";
            }
            if (pokeName.indexOf('shiny') != -1) { // Detect if the potential pokemon is a shiny
                isShiny = true;
                pokeName = pokeName.replace(' shiny', '').replace('shiny ', '').replace('-shiny', '').replace('shiny-', '').replace('shiny', '');

            }
            pokeName = pokeName.replace(" ", "-");
            let imgPoke = pokeName.toLowerCase();
            if (pokeCount > 1) break;
            if (pokePast.indexOf(imgPoke) != -1) continue;
            pokePast.push(imgPoke);
            if (species.indexOf(imgPoke) > -1) pokeCount++;
            if (isShiny) urlBuild = 'https://play.pokemonshowdown.com/sprites/xyani-shiny/';
            /* jshint ignore:start */
            if (imgPoke == "slowpoke") {
                setTimeout(()=>{
                    msg.channel.send('', {
                        file: urlBuild + imgPoke + ".gif"
                    });
                }, 5000);
            } else if (imgPoke == "furry") {
                msg.channel.send('',{file: {attachment: msg.author.displayAvatarURL, name: msg.author.username + ".png"}});
            } else if (imgPoke == "jh") {
                msg.channel.send('<:BanJH:470022066234458112>');
            } else if (imgPoke in customFiles) {
                msg.channel.send('',{file: {attachment: "./custom/"+customFiles[imgPoke]}});
            } else {
                request(urlBuild + imgPoke + ".gif", (err, response) => { // Check to see if the sprite for the desired Pokemon exists
                    if (!err && response.statusCode == 200) {
                        msg.channel.send('', { // If it does, send it  
                            file: response.request.href
                        });
                        isFound = true;
                    }
                });
            }
            /* jshint ignore:end */
            if (isFound) break;
        }
    }
}

process.on("beforeExit", ()=>{
    notbeheeyem.destroy();
});
process.on("uncaughtException", ()=>{
    notbeheeyem.destroy();
});
