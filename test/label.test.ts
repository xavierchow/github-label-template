"use strict";

import { expect } from "chai";
import * as nock from "nock";
import { AxiosError } from "axios";
import { Label } from "../src/lib/label";

describe("Label class", () => {
  it("constructor", () => {
    const lbl = new Label("lorem", "ipsum", "dolor");
    expect(lbl.owner).be.equal("lorem");
    expect(lbl.repo).be.equal("ipsum");
    expect(lbl.token).be.equal("dolor");
  });

  it("getAll should succeed", async () => {
    nock("https://api.github.com")
      .get("/repos/lorem/ipsum/labels")
      .reply(200, [
        {
          url: "http://xxx.xxx",
          name: "foo",
          color: "523526",
        },
        {
          url: "http://xxx.xxx",
          name: "bar",
          color: "f23266",
        },
      ]);
    const lbl = new Label("lorem", "ipsum", "dolor");
    return lbl.getAll().then((labels) => {
      expect(labels).to.be.an("array");
      expect(labels.length).to.be.equal(2);
      expect(labels[0].name).to.be.equal("foo");
      expect(labels[1].name).to.be.equal("bar");
    });
  });

  it("remove should succeed", () => {
    nock("https://api.github.com")
      .delete("/repos/lorem/ipsum/labels/sit")
      .reply(204);
    const lbl = new Label("lorem", "ipsum", "dolor");
    return lbl.remove("sit");
  });

  it("remove should fail if response code is not 204", async () => {
    nock("https://api.github.com")
      .delete("/repos/lorem/ipsum/labels/sit")
      .reply(404);
    const lbl = new Label("lorem", "ipsum", "dolor");
    return lbl.remove("sit").catch((err) => {
      expect(err.response.status).to.be.equal(404);
    });
  });

  it("removeAll should succeed", () => {
    const lbl = new Label("lorem", "ipsum", "dolor");
    //mock getAll
    lbl.getAll = () => {
      return Promise.resolve([
        { name: "ipsum", color: "252562" },
        { name: "lorem", color: "15f567" },
      ]);
    };
    lbl.remove = (labelName) => {
      expect(["ipsum", "lorem"]).to.include(labelName);
      return Promise.resolve();
    };
    return lbl.removeAll();
  });

  it("create should succeed", () => {
    nock("https://api.github.com")
      .post("/repos/lorem/ipsum/labels", {
        name: "foobar",
        color: "235266",
      })
      .reply(201, {
        url: "https://api.github.com/repos/lorem/ipsum/labels/foobar",
        name: "foobar",
        color: "235266",
      });
    const lbl = new Label("lorem", "ipsum", "dolor");
    lbl.create({ name: "foobar", color: "235266" });
  });

  it("createAll should succeed", () => {
    const json = require("./fixture/label.json");
    nock("https://api.github.com")
      .filteringRequestBody(/.*/, "*")
      .post("/repos/lorem/ipsum/labels", "*")
      .times(json.length)
      .reply(201, {
        url: "https://api.github.com/repos/lorem/ipsum/labels/foobar",
        name: "foobar",
        color: "235266",
      });
    const lbl = new Label("lorem", "ipsum", "dolor");
    return lbl.createAll(json);
  });
});
