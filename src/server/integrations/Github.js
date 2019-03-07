import dotenv from 'dotenv';
import request from 'requestretry';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const requestOptions = {
  baseUrl: 'https://api.github.com',
  fullResponse: false,
  json: true,
  headers: {
    Accept: 'application/vnd.github.v3+json',
    Authorization: `token ${process.env.GITHUB_USER_TOKEN}`,
    'User-Agent': process.env.GITHUB_USER_AGENT,
  }
};

/**
* @class Repo
*/
class Repo {
  /**
   * @method addUser
   * @desc This method adds a user to a Github repo
   *
   * @param { string } username the Github username of the user to add
   * @param { object } repo the name of the repo
   * @param { object } configuration the config with which to add the user
   *
   * @returns { object } a response object showing the result of the operation
   */
  async addUser(username, repo, configuration = { organization: process.env.GITHUB_ORGANIZATION, permission: 'push' }) {
    try {
      let result = {}; // the result to be returned

      // just to be sure configuration.organization is not undefined
      configuration.organization =
      configuration.organization || process.env.GITHUB_ORGANIZATION;

      // add user
      requestOptions.uri = `/repos/${configuration.organization}/${repo}/collaborators/${username}`;
      requestOptions.headers.Accept = 'application/vnd.github.swamp-thing-preview+json';
      requestOptions.body = {
        permission: configuration.permission || 'push'
        // the default permission is 'push' so, technically, we don't need to
        // add the code snippet: || 'push'
        // nevertheless, adding it ensures that the body is NEVER empty
        // so we never need to set 'Content-Length' to zero
        // see: https://developer.github.com/v3/repos/collaborators/#add-user-as-a-collaborator
      };
      result = await request.put(requestOptions);

      // if (typeof result === 'undefined') { 
      //   throw new
      //   Error(`Failed to add user '${username}' to Github repo.`);
      // }

      // result.ok = true;

      return result;
    } catch (error) {
      return {
        ok: false,
        error: error.message
      };
    }
  }
  /**
   * @method create
   * @desc This method creates a new Github repo
   *
   * @param { string } name the name of the repo
   * @param { object } configuration the config with which to create the repo
   *
   * @returns { object } a response object showing the result of the operation
   */
  async create(
    name,
    configuration = { organization: process.env.GITHUB_ORGANIZATION, type: 'org' }
  ) {
    try {
      let result = {}; // the result to be returned

      // just to be sure configuration.organization is not undefined
      configuration.organization =
      configuration.organization || process.env.GITHUB_ORGANIZATION;

      // create repo
      if (configuration.type === 'org') {
        requestOptions.uri = `/orgs/${configuration.organization}/repos`;
        requestOptions.body =
        {
          name,
          description: configuration.description,
          private: configuration.private
        };
        result = await request.post(requestOptions);
      } else if (configuration.type === 'user') {
        requestOptions.uri = '/user/repos';
        requestOptions.body =
        {
          name,
          description: configuration.description,
          private: configuration.private
        };
        result = await request.post(requestOptions);
      }

      if (result.errors) {
        throw new Error(result.errors[0].message + '\n' + result.documentation_url)
      }

      result.ok = true;
      result.url = result.html_url;

      // add current user to repo
      if (configuration.user) {
        result.invitedUser = await this.addUser(
          configuration.user.githubUsername,
          result.name,
          { permission: 'admin' }
        );
      }

      return result;
    } catch (error) {
      return {
        ok: false,
        error: error.message
      };
    }
  }
  /**
   * @method addUser
   * @desc This method removes a user from a Github repo
   *
   * @param { string } username the Github username of the user to add
   * @param { object } repo the name of the repo
   *
   * @returns { object } a response object showing the result of the operation
   */
  async removeUser(username, repo, configuration = { organization: process.env.GITHUB_ORGANIZATION }) {
    try {
      let result = {}; // the result to be returned

      // just to be sure configuration.organization is not undefined
      configuration.organization =
      configuration.organization || process.env.GITHUB_ORGANIZATION;

      // add user
      requestOptions.uri = `/repos/${configuration.organization}/${repo}/collaborators/${username}`;
      requestOptions.headers.Accept = 'application/vnd.github.swamp-thing-preview+json';
      result = await request.delete(requestOptions);

      return result;
    } catch (error) {
      return {
        ok: false,
        error: error.message
      };
    }
  }
}

/**
* Github Integration
* @class Github
*/
export default class Github {
  /**
   * @constructor
   */
  constructor() {
    this.repo = new Repo();
  }
}
