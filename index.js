const Discord = require("discord.js");

const token = "MzY5NTQ4NTk2MDE5NzI0Mjg5.DMmgqQ.Zihjyyzy6JKJckESIGb9TOcshsc";
const prefix = "!";
var bot = new Discord.Client();

function roundTwoDecimal(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}

var cities = {};

bot.on("ready", () => {
    console.log("Bot is now active.");
});

function getCityStats(username) {
    if (cities[username] != undefined) {
        let city = cities[username],
        stats = "```";

        stats += username + "'s City Statistics\n";
        stats += "Population: " + city.population.current + " / " + city.population.max + " people (Mood: " + (city.population.mood * 100) + "%)\n";
        stats += "Weather: " + city.weather + " (" + city.temperature.current + "°F)\n";
        stats += "Temperature Ranges: " + city.temperature.range.min + "°F to " + city.temperature.range.max + "°F\n";
        stats += "Money: $" + city.money.balance + " (revenue: $" + city.money.revenue + ", owes: $" + city.money.owe + ")\n";

        stats += "Land: " + city.land.residental + " residental lots, " + city.land.commercial
                + " commercial lots, and " + city.land.industrial + " industrial lots\n";

        stats += "Technology Units: " + city.technology.residental + " residental units, " + city.technology.commercial
                + " commercial units, and " + city.technology.industrial + " industrial units\n";

        stats += "Political Views: Residental " + (city.politics.residental * 100) + "%, Commercial "
                + (city.politics.commercial * 100) + "%, Industrial " + (city.politics.industrial * 100) + "%\n";

        stats += "```";

        return stats;
    }

    return "You don't have a city.";
}

bot.on("message", (message) => {
    if (message.author.equals(bot.user)) return;
    if (!message.content.startsWith(prefix)) return;

    let args = message.content.substring(prefix.length).split(" ");

    if (args[0] == "abandoncity") {
        cities[message.author.username] = undefined;
        message.channel.send("You leave your city; it slowly degrades to nothing.");
    }

    if (args[0] == "citystats") {
        if (cities[message.author.username] != undefined) {
            message.channel.send(getCityStats(message.author.username));
        } else {
            message.channel.send("You do not have an existing city.");
        }
    }

    if (args[0] == "createcity") {
        if (cities[message.author.username] == undefined) {
            cities[message.author.username] = {
                temperature: {
                    current: Math.round(Math.random() * 100),
                    range: {
                        min: 0,
                        max: 0
                    }
                },
                weather: "clear",
                population: {
                    current: Math.round(Math.random() * 8) + 2,
                    max: 10,
                    mood: 0.8
                },
                money: {
                    balance: Math.round(Math.random() * 100),
                    owe: 0,
                    revenue: 5
                },
                attractiveness: 0.01,
                land: {
                    residental: 1,
                    commercial: 1,
                    industrial: 0
                },
                technology: {
                    residental: 0,
                    commercial: 0,
                    industrial: 0
                },
                politics: {
                    residental: parseFloat(roundTwoDecimal(Math.random()).toFixed(2)),
                    commercial: parseFloat(roundTwoDecimal(Math.random()).toFixed(2)),
                    industrial: parseFloat(roundTwoDecimal(Math.random()).toFixed(2))
                }
            };
            cities[message.author.username].temperature.range.min = cities[message.author.username].temperature.current - Math.round(Math.random() * 25);
            cities[message.author.username].temperature.range.max = cities[message.author.username].temperature.current + Math.round(Math.random() * 25);
            
            message.channel.send("You establish your own city.");
            message.channel.send(getCityStats(message.author.username));
        } else {
            message.channel.send("You already have an existing city.");
        }
    }
});

bot.login(token);