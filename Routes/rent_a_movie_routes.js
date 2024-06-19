const { Router } = require(`express`);
const router = Router();
const Controllers = require(`../Controllers/rent_a_movie_controllers`);
// 
// const { authorise } = require(`../MiddleWare/authorisation`);
// router.get(`*`, checkUser);
// router.use(`*`, authorise);
const preReq = `/v1`;
// Queries
// A
router.get(`${preReq}/get_customer_list_data`, Controllers.get_customer_list_data);
router.get(`${preReq}/get_transaction_list_data`, Controllers.get_transaction_list_data);
router.get(`${preReq}/get_search_for_customer_data`, Controllers.get_search_for_customer_data);
router.get(`${preReq}/get_recent_transactions`, Controllers.get_recent_transactions);
router.get(`${preReq}/get_each_movie_earnings`, Controllers.get_each_movie_earnings);
router.get(`${preReq}/get_totals`, Controllers.get_totals);
router.get(`${preReq}/get_rental_status_summary`, Controllers.get_rental_status_summary);
// B
router.post(`${preReq}/new_customer`, Controllers.new_customer);
router.post(`${preReq}/new_movie`, Controllers.new_movie);
router.post(`${preReq}/new_transaction`, Controllers.new_transaction);
// Pages
router.get(`${preReq}/get_customer_list_page`, Controllers.get_customer_list_page);
router.get(`${preReq}/get_transaction_list_page`, Controllers.get_transaction_list_page);
router.get(`${preReq}/new_customer_page`, Controllers.new_customer_page);
router.get(`${preReq}/new_movie_page`, Controllers.new_movie_page);
router.get(`${preReq}/new_transaction_page`, Controllers.new_transaction_page);

module.exports = router;