const { Router } = require(`express`);
const router = Router();
const Controllers = require(`../Controllers/auth_controllers`);

const preReq = `/v1`

router.post(`${preReq}/new_admin_signup`, Controllers.new_admin_signup);
router.post(`${preReq}/old_admin_signin`, Controllers.old_admin_signin);
// Pages
router.get(`${preReq}/get_admin_signup`, Controllers.get_admin_signup);
router.get(`${preReq}/get_admin_signin`, Controllers.get_admin_signin);

module.exports = router;