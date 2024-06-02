const { Router } = require(`express`);
const router = Router();
const Controllers = require(`../Controllers/rent_a_movie_controllers`);


const preReq = `/rent_a_movie`;
router.get(`${preReq}/customer_list`, Controllers.customer_list);
router.get(`${preReq}/transaction_list`, Controllers.transaction_list);

module.exports = router;
