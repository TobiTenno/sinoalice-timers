const Discord = require('discord.js');
const client = new Discord.Client();
const crons = require('./crons.json');
const CronJob = require('cron').CronJob;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('error', console.error);
client.on('debug', console.log);
client.on('info', console.log);

const makeJob = (time, message) => {
  const job = new CronJob(time, async () => {
    const notifications = client.channels.fetch(process.env.NOTIFICATIONS);
    notifications.send(message);
  }, null, true, 'UTC');
  job.start();
  return job;
};

Object.keys(crons).forEach(name => {
  const arr = crons[name];
  arr.times.forEach((time, index) => {
    makeJob(time, arr.messages[index] || arr.messages[0]);
  });
});

client.login(process.env.TOKEN);