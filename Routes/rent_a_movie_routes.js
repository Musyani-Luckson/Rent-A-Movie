const { Router } = require(`express`);
const router = Router();
const Controllers = require(`../Controllers/rent_a_movie_controllers`);


const preReq = `/api`;
router.get(`${preReq}/customer_list`, Controllers.customer_list);
router.get(`${preReq}/transaction_list`, Controllers.transaction_list);
router.get(`${preReq}/search_for_customer`, Controllers.search_for_customer);


module.exports = router;
