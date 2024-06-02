const { Router } = require(`express`);
const router = Router();
const Controllers = require(`../Controllers/auth_controllers`);

const preReq = `/v2`

router.post(`${preReq}/signup`, Controllers.signup_post);
router.post(`${preReq}/login`, Controllers.login_post);

module.exports = router;