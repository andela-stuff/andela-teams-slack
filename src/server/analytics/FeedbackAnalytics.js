import jwt from 'jsonwebtoken';

import models from '../models';
import Slack from '../integrations/Slack';

const slack = new Slack();

export default class FeedbackAnalytics {
  async get(req, res, next) {
    try {
      let token = req.params.token;
      const query = jwt.verify(token, process.env.JWT_SECRET);
      if (query.analyticsType === 'feedback_table') {
        query.include = [{
          model: models.Skill,
          as: 'skill',
          attributes: ['name'],
          include: [{
            model: models.Attribute,
            as: 'attribute',
            attributes: ['name'],
          }]
        }];
      } else if (query.analyticsType === 'feedback_time_distribution') {
        query.attributes = [
          [models.sequelize.fn('date', models.sequelize.col('createdAt')), 'createdAt'],
          [models.sequelize.fn('count', models.sequelize.col('id')), 'count']
        ];
        query.group = ['createdAt'];
      } else if (query.analyticsType === 'attributes_chart') {
        query.include = [{
          model: models.Skill,
          as: 'skill',
          attributes: ['name'],
          include: [{
            model: models.Attribute,
            as: 'attribute',
            attributes: ['name'],
          }]
        }];
        query.attributes = ['message'];
      }  else if (query.analyticsType === 'skills_chart') {
        query.include = [{
          model: models.Skill,
          as: 'skill',
          attributes: ['name']
        }];
        query.attributes = ['message'];
      }
      const items = await models.FeedbackInstance.findAll(query);
      let records = [];
      if (query.analyticsType === 'feedback_table') {
        records = await _getFeedbackTable(items);
      } else if (query.analyticsType === 'feedback_time_distribution') {
        records = _getFeedbackTimeDistribution(items);
      } else if (query.analyticsType === 'attributes_chart') {
        records = _getAttributesChart(items);
      } else if (query.analyticsType === 'skills_chart') {
        records = _getSkillsChart(items);
      }
      return res.status(200).json({ records });
    } catch(error) {
      next(error);
    }
  }
}

function _getAttributesChart(items) {
  let attriGroupsMap = new Map();
  let totalCount = 0;
  for (let i = 0; i < items.length; i++) {
    let item = items[i].get();
    if (!item.skill) {
      continue;
    }
    item.skill = item.skill.get();
    if (!item.skill.attribute) {
      continue;
    }
    item.skill.attribute = item.skill.attribute.get();
    if (attriGroupsMap.has(item.skill.attribute.name)) {
      attriGroupsMap.set(
        item.skill.attribute.name,
        Number(attriGroupsMap.get(item.skill.attribute.name)) + 1);
    } else {
      attriGroupsMap.set(item.skill.attribute.name, 1);
    }
    totalCount += 1;
  }
  let records = [];
  for (let [attribute, count] of attriGroupsMap) {
    records.push({
      attribute,
      count,
      percent: (Number(count) / totalCount) * 100
    });
  }
  return records;
}

async function _getFeedbackTable(items) {
  let resolvedUsersMap = new Map();
  let records = [];
  for (let i = 0; i < items.length; i++) {
    let item = items[i].get();
    let recipientName, senderName;
    if (item.to) {
      if (resolvedUsersMap.has(item.to)) {
        recipientName = resolvedUsersMap.get(item.to);
      } else {
        let user = await slack.resolver.getUserProfileObject(item.to);
        recipientName = user.real_name;
        resolvedUsersMap.set(item.to, user.real_name);
      }
    }
    if (item.from) {
      if (resolvedUsersMap.has(item.from)) {
        senderName = resolvedUsersMap.get(item.from);
      } else {
        let user = await slack.resolver.getUserProfileObject(item.from);
        senderName = user.real_name;
        resolvedUsersMap.set(item.from, user.real_name);
      }
    }
    records.push({
      ...item,
      recipientName,
      senderName
    });
  }
  return records;
}

function _getFeedbackTimeDistribution(items) {
  let dateGroupsMap = new Map();
  let totalCount = 0;
  for (let i = 0; i < items.length; i++) {
    let item = items[i].get();
    if (dateGroupsMap.has(item.createdAt)) {
      dateGroupsMap.set(
        item.createdAt,
        Number(dateGroupsMap.get(item.createdAt)) + Number(item.count));
    } else {
      dateGroupsMap.set(item.createdAt, Number(item.count));
    }
    totalCount += Number(item.count);
  }
  let records = [];
  for (let [createdAt, count] of dateGroupsMap) {
    records.push({
      createdAt,
      count,
      percent: (Number(count) / totalCount) * 100
    });
  }
  return records;
}

function _getSkillsChart(items) {
  let attriGroupsMap = new Map();
  let totalCount = 0;
  for (let i = 0; i < items.length; i++) {
    let item = items[i].get();
    if (!item.skill) {
      continue;
    }
    item.skill = item.skill.get();
    if (attriGroupsMap.has(item.skill.name)) {
      attriGroupsMap.set(
        item.skill.name,
        Number(attriGroupsMap.get(item.skill.name)) + 1);
    } else {
      attriGroupsMap.set(item.skill.name, 1);
    }
    totalCount += 1;
  }
  let records = [];
  for (let [skill, count] of attriGroupsMap) {
    records.push({
      skill,
      count,
      percent: (Number(count) / totalCount) * 100
    });
  }
  return records;
}
