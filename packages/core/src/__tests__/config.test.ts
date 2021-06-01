import { verifyConfig, BaseSchema } from "../config";
import { BaseConfig } from "../types";

describe("config", function () {
  it("verifyConfig", () => {
    const conf = verifyConfig<BaseConfig>(
      {
        appEnv: "dev",
        appId: "vxfajhdadddcx",
        appVersion: "0.1.1",
        serverUrl: "https://api.demo.cn"
      },
      BaseSchema
    );

    expect(conf).toEqual({
      config: {
        serverUrl: "https://api.demo.cn",
        appId: "vxfajhdadddcx",
        appEnv: "dev",
        appVersion: "0.1.1",
        debug: false,
        user: undefined
      },
      errors: {}
    });
  });
});
