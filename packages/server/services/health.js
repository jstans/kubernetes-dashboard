let status = "NOT_READY";

const init = (server) => {
  server.once("listening", () => {
    status = "READY";

    const onShutdown = (signal) => {
      server.close(() => {
        process.exit(0);
      });
      status = "SHUTTING_DOWN";
    };

    process.on("SIGTERM", onShutdown);
    process.on("SIGINT", onShutdown);
  });
};

const getStatus = () => status;

module.exports = { getStatus, init };
