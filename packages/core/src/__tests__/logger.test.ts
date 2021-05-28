import { logger, LEVEL, setLoggerLevel } from "../logger";

describe("logger test", function () {
  it("test set level debug ", () => {
    console.log = jest.fn();
    console.info = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();

    setLoggerLevel(LEVEL.debug);

    logger().debug("debug...");
    logger().info("info...");
    logger().warn("warn...");
    logger().error("error...");

    expect(console.log).toBeCalledTimes(1);
    expect(console.info).toBeCalledTimes(1);
    expect(console.warn).toBeCalledTimes(1);
    expect(console.error).toBeCalledTimes(1);
  });

  it("test set level warn ", () => {
    console.log = jest.fn();
    console.info = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();

    setLoggerLevel(LEVEL.warn);
    logger().debug("debug...");
    logger().info("info...");
    logger().warn("warn...");
    logger().error("error...");

    expect(console.log).toBeCalledTimes(0);
    expect(console.info).toBeCalledTimes(0);
    expect(console.warn).toBeCalledTimes(1);
    expect(console.error).toBeCalledTimes(1);
  });
});
