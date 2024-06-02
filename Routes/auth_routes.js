const { Router } = require(`express`);
const router = Router();
const Controllers = require(`../Controllers/auth_controllers`);

const preReq = `/rent_a_movie`

router.post(`${preReq}/signup`, Controllers.signup_post);
router.post(`${preReq}/login`, Controllers.login_post);

module.exports = router;