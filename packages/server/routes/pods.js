const router = require("koa-router")();
// const k8s = require("../services/k8s");

router.prefix("/pods");

router.get("/", async function (ctx, next) {
  // ctx.body = await k8s.listPods();
});

module.exports = router;
