import 'babel-polyfill' // eslint-disable-line
import bugsnag from '@bugsnag/js';
import bugsnagExpress from '@bugsnag/plugin-express';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';

import FeedbackAnalytics from './analytics/FeedbackAnalytics';
import DataHandler from './core/DataHandler';
import Eventhandler from './core/EventHandler';
import InteractionHandler from './core/InteractionHandler';
import PivotalTrackerAnalytics from './analytics/PivotalTrackerAnalytics';
import SlashCommandHandler from './core/SlashCommandHandler';
import Utility from './core/Utility';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const bugsnagClient = bugsnag(process.env.BUGSNAG_CLIENT_ID);
bugsnagClient.use(bugsnagExpress)
const bugsnagMiddleware = bugsnagClient.getPlugin('express');

const app = new express();
// This must be the first piece of middleware in the stack.
// It can only capture errors in downstream middleware
app.use(bugsnagMiddleware.requestHandler);
app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const data = new DataHandler();
const event = new Eventhandler();
const feedbackAnalytics = new FeedbackAnalytics();
const interaction = new InteractionHandler();
const ptAnalytics = new PivotalTrackerAnalytics();
const slash = new SlashCommandHandler();
const utils = new Utility();

app.get('/', async (req, res) => {
  res.status(200).send("Hello World!<br /><br />Welcome to Andela Teams for Slack.");
});

// app.get('/test/bugsnag', async (req, res) => {
//   res.status(200).send("Test to see that Bugsnap is set up properly.");
//   // bugsnagClient.notify(new Error('Test to see that Bugsnap is set up properly'));
//   throw new Error('Test to see that Bugsnap is set up properly');
// });

app.get('/api/analytics/feedback/:token',
  feedbackAnalytics.get);

app.get('/api/analytics/pt/:token',
  ptAnalytics.get);

app.post('/data/external',
  utils.getUserObjectFromReqBodyPayloadUserId,
  data.dialogSuggestions);

app.post('/events', 
  event.challenge,
  utils.getUserObjectFromReqBodyEventUser,
  utils.rejectUsersWithNoEmailOrGithub,
  event.addMeReaction,
  utils.handleErrors);

app.post('/interactions',
  utils.postEmptyMessage,
  utils.getUserObjectFromReqBodyPayloadUserId,
  utils.rejectUsersWithNoEmailOrGithub,
  interaction.dialogCancellation,
  interaction.dialogSubmission,
  interaction.interactiveMessage,
  interaction.messageAction,
  utils.handleErrors);

app.post('/slash/teams',
  utils.postWelcomeMessage,
  utils.getUserObjectFromReqBodyUserId,
  utils.rejectUsersWithNoEmailOrGithub,
  slash.teams,
  utils.handleErrors);


// Last middleware in the stack
// This handles any errors that Express catches
app.use(bugsnagMiddleware.errorHandler);

let server = app.listen(process.env.PORT || 5000, () => {
  let port = server.address().port;
  console.log(`Server started on port ${port}`)
})
