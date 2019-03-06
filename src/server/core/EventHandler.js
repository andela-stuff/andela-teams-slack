import Slack from '../integrations/Slack';
import Utility from './Utility';

const slack = new Slack();
const utils = new Utility();

export default class EventHandler {
  async addMeReaction(req, res, next) {
    try {
      let event = req.body.event;
      if (event.reaction === 'add_me') {
        if (event.item.type === 'message') {
          var messageText = await slack.resolver.getMessageFromChannel(event.item.ts, event.item.channel);
          // check if messageText is a link <...>
          if (messageText.toLowerCase().startsWith('<http') && messageText.endsWith('>')) {
            // trim messageText of < and > to get link
            let messageLink = messageText.substring(1, messageText.length - 1).toLowerCase();
            utils.addOrRemoveUser(
              messageLink,
              req.user, event.user,
              event.item.channel,
              event.type === 'reaction_added');
          }
        }
      }
  
      next();
    } catch(error) {
      next(error);
    }
  }
  async challenge(req, res, next) {
    res.header('Content-Type', 'application/x-www-form-urlencoded');
    // if Slack is "challenging" our URL in order to verify it
    if (req.body.challenge) {
      return res.status(200).json({ challenge: req.body.challenge });
    }
    res.status(200).send();
    next();
  }
}
