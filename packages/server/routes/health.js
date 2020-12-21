const router = require("koa-router")();
const { getStatus } = require("../services/health");

router.prefix("/health");

router.get("/healthz", async function (ctx, next) {
  const status = getStatus();
  ctx.body = status;
  if (status === "READY") ctx.status = 200;
  else ctx.status = 500;
});

module.exports = router;
