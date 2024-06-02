const { Router } = require(`express`);
const router = Router();
const Controllers = require(`../Controllers/rent_a_movie_controllers`);


const preReq = `/v2`;
router.get(`${preReq}/customer_list`, Controllers.customer_list);
router.get(`${preReq}/transaction_list`, Controllers.transaction_list);

module.exports = router;
