import React from "react";
import { setConfig, remove } from "../lib/store";
import defaultConfig from "../lib/default";

function Config() {
  return (
    <form className="config-panel" onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const formProps = Object.fromEntries(formData) || {};
      const { serverUrl, appKey, appVersion, appEnv, debug } = formProps;

      setConfig({ serverUrl, appKey, appVersion, appEnv, debug: !!debug });

      window.location.href = "/"

    }}>
      <div className="section bg-white shadow-md">
        <h1>sdk 配置</h1>
        <div className="form-item">
          <label>serverUrl: </label>
          <input type="text" name="serverUrl" defaultValue={defaultConfig.serverUrl} />
        </div>
        <div className="form-item">
          <label>appKey: </label>
          <input type="text" name="appKey" defaultValue={defaultConfig.appKey} />
        </div>
        <div className="form-item">
          <label>appVersion: </label>
          <input type="text" name="appVersion" defaultValue={defaultConfig.appVersion} />
        </div>
        <div className="form-item">
          <label>appEnv: </label>
          <input type="text" name="appEnv" defaultValue={defaultConfig.appEnv} />
        </div>
        <div>
          <label htmlFor="debugVal">debug: </label>
          <input id="debugVal" type="checkbox" name="debug" defaultChecked={defaultConfig.debug} />
        </div>
        <div className="form-item submit">
          <button type="submit">确定</button>
          <button type="button" onClick={() => {
            remove();
            window.location.href = "/"
          }}>恢复默认
          </button>
        </div>
      </div>
    </form>
  );
}

export default Config;
