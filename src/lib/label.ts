"use strict";

const GH_HOST = "https://api.github.com";

import Debug from "debug";
const debug = Debug("gh-label-tmpl:Label");
import axios, { AxiosRequestConfig, AxiosResponse, AxiosInstance } from "axios";
import * as assert from "assert";

interface LabelMeta {
  name: string;
  color: string;
}
export class Label {
  owner: string;
  repo: string;
  token: string;
  axiosInstance: AxiosInstance;

  constructor(owner: string, repo: string, token: string) {
    this.owner = owner;
    this.repo = repo;
    this.token = token;
    this.axiosInstance = axios.create({
      baseURL: `${GH_HOST}/repos/${this.owner}/${this.repo}`,
      headers: { "user-agent": "gh-label" },
      // responseType: 'json'
    });
  }

  async getAll() {
    const config: AxiosRequestConfig = {
      url: `/labels`,
    };
    if (this.token) {
      config.headers = {
        Authorization: `token ${this.token}`, //needed if private repo
      };
    }

    const resp: AxiosResponse = await this.axiosInstance.request(config);
    debug("original labels: %j", resp);
    return resp.data.map((label) => {
      return { name: label.name, color: label.color };
    });
  }

  async remove(labelName: string) {
    const config: AxiosRequestConfig = {
      url: `/labels/${labelName}`,
      method: "DELETE",
      headers: {
        Authorization: `token ${this.token}`,
      },
    };
    const resp: AxiosResponse = await this.axiosInstance.request(config);
    return;
  }

  async removeAll() {
    const createRemovePromise = (labelName) => {
      return this.remove(labelName);
    };

    return this.getAll()
      .then((labels) => {
        return labels.map((l) => createRemovePromise(l.name));
      })
      .then((removePromises) => {
        return Promise.all(removePromises);
      });
  }

  createAll(labels: LabelMeta[]) {
    if (!Array.isArray(labels)) {
      return Promise.reject(new Error("Invalid import json"));
    }
    return Promise.all(labels.map(this.create, this));
  }

  create(label: LabelMeta) {
    assert(label.name);
    assert(label.color);
    const config: AxiosRequestConfig = {
      url: `/labels`,
      method: "POST",
      headers: {
        Authorization: `token ${this.token}`,
      },
      data: label,
    };
    return this.axiosInstance.request(config);
  }
}
