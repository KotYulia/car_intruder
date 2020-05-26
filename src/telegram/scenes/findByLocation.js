const { listArticles } = require('../../services');
const WizardScene = require("telegraf/scenes/wizard");
const {
  localesRU: { FIND_ARTICLES },
  telegramEvents: {
    SCENES: { FIND_BY_LOCATION: name },
  },
} = require('../../config');

function getDateWithoutTime(date) {
  return require('moment')(date).format('DD.MM.YYYY HH:mm');
}

function getDistance(lat1,lon1,lat2,lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2-lat1);  // deg2rad below
  const dLon = deg2rad(lon2-lon1);
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c * 1000; // Distance in m
  console.log(distance);
  if (distance <= 100 && distance >= -100) {
    return true;
  }
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

const scene = new WizardScene(
  name,
  (ctx) => {
    ctx.reply(FIND_ARTICLES.LOCATION);
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.message && ctx.message.location) {
      try {
        const articles = await listArticles();
        let count = 0;

        for (let i = 0; i < articles.length; ++i) {
          const checkDistance = await getDistance(ctx.message.location.latitude,ctx.message.location.longitude,articles[i].location.split(', ')[0], articles[i].location.split(', ')[1]);
          if (checkDistance) {
            count++;
            await ctx.replyWithHTML(`<strong>${articles[i].title}</strong>`);
            if (articles[i].description) {
              await ctx.reply(articles[i].description);
            }
            await ctx.replyWithHTML(`<em>Автор: ${articles[i].author}  (${getDateWithoutTime(articles[i].createdAt)})</em>`);
            await ctx.replyWithHTML('----------------------------------------------');
          }
        }

        if (count === 0) {
          ctx.reply(FIND_ARTICLES.NO_RESULTS);
        }
        return await ctx.scene.leave();
      } catch (error) {
        throw error;
      }
    } else {
      ctx.reply(FIND_ARTICLES.ERROR);
      return await ctx.scene.leave();
    }
  },
);

module.exports = {
  name,
  scene,
};
