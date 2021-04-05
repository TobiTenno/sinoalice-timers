const Discord = require('discord.js');
const client = new Discord.Client();
const crons = require('./crons.json');
const CronJob = require('cron').CronJob;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('error', console.error);

client.on('debug', (message) => {
  if (!/(Sending a heartbeat|Latency of|voice)/i.test(message)) {
    console.log(message);
  }
});

const makeJob = (time, message, name) => {
  const job = new CronJob(time, async () => {
    const notifications = await client.channels.fetch(process.env.NOTIFICATIONS);
    const pingId = process.env[`${name.toUpperCase()}_PING`] || '';
    const ping = pingId ? `<@&${pingid}>` : '';
    
    notifications.send(`${ping} ${message}`);
  }, null, true, 'UTC');
  job.start();
  return job;
};

Object.keys(crons).forEach(name => {
  const arr = crons[name];
  arr.times.forEach((time, index) => {
    makeJob(time, arr.messages[index] || arr.messages[0], name);
  });
});

client.login(process.env.TOKEN);