require('source-map-support/register');
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./server/api.js":
/*!***********************!*\
  !*** ./server/api.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var router = __webpack_require__(/*! express */ "express").Router(); // Functions to run on all API paths (if any)
// TODO 
// Set up different routes


router.use('/budgets', __webpack_require__(/*! ./routes/budgets */ "./server/routes/budgets.js"));
router.use('/fundingRequests', __webpack_require__(/*! ./routes/fundingRequests */ "./server/routes/fundingRequests.js")); // router.use('/lineItems', require('./routes/lineItems'))
// router.use('/minutes', require('./routes/minutes'))

router.use('/reallocations', __webpack_require__(/*! ./routes/reallocations */ "./server/routes/reallocations.js"));
router.use('/studentLifeFee', __webpack_require__(/*! ./routes/studentLifeFee */ "./server/routes/studentLifeFee.js")); // Export router for app to use

module.exports = router;

/***/ }),

/***/ "./server/config/db.js":
/*!*****************************!*\
  !*** ./server/config/db.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const dotenv = __webpack_require__(/*! dotenv */ "dotenv");

const credentials = dotenv.config({
  path: './server/.env'
});

const mysql = __webpack_require__(/*! mysql */ "mysql"); // Load credentials and make connection to database
// TODO may need to move .env file or point config to it


if (credentials.error) {
  throw credentials.error;
}

console.log('Parsed:', credentials.parsed);
var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
connection.connect(); // TODO Make function for handlind disconnects
// Export connection for use by API

module.exports = connection;

/***/ }),

/***/ "./server/main.js":
/*!************************!*\
  !*** ./server/main.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const express = __webpack_require__(/*! express */ "express");

const app = express();

const swaggerUi = __webpack_require__(/*! swagger-ui-express */ "swagger-ui-express");

const swaggerJSDoc = __webpack_require__(/*! swagger-jsdoc */ "swagger-jsdoc");

const morgan = __webpack_require__(/*! morgan */ "morgan");

const options = {
  definition: {
    info: {
      title: 'Treasury API',
      version: '1.0.0',
      description: 'API to expose WPI SGA Financial Data'
    },
    basePath: '/api'
  },
  // Path to the API docs
  apis: ['server/api.js', 'server/routes/*.js']
};
const swaggerSpec = swaggerJSDoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(morgan('dev')); // Config

const PORT = process.env.PORT || 8000; // REST API

app.use('/api', __webpack_require__(/*! ./api */ "./server/api.js")); // Serve frontend

let staticHandler = express.static("dist");

if (process.env.IS_DEV) {
  console.log("Starting Parcel dev server..."); // If dev, use Parcel for HMR

  const Bundler = __webpack_require__(/*! parcel-bundler */ "parcel-bundler");

  const bundler = new Bundler('client/index.html', {
    hmr: false // HMR does not work with HTTPS (thanks, MSAL)

  });
  staticHandler = bundler.middleware(); // We need a localtunnel for SSO to work, since MSAL uses PKCE which doesn't work via localhost

  console.log("Starting dev https tunnel...");

  const localtunnel = __webpack_require__(/*! localtunnel */ "localtunnel");

  (async () => {
    const tunnel = await localtunnel({
      port: PORT,
      subdomain: process.env.LT_SUB || undefined
    });
    console.log("\nLocaltunnel active at URL: " + tunnel.url);
    tunnel.on('close', () => {
      console.log("https tunnel closed");
    });
  })();
}

app.use("/", staticHandler); // Start the server

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log(`If running in development mode, use parcel server port instead`);
  console.log("Press Ctrl+C to quit.");
});

/***/ }),

/***/ "./server/routes/budgets.js":
/*!**********************************!*\
  !*** ./server/routes/budgets.js ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var connection = __webpack_require__(/*! ../config/db */ "./server/config/db.js");

var router = __webpack_require__(/*! express */ "express").Router();
/**
 * @swagger
 * 
 * /budgets:
 *   get:
 *     tags:
 *     - users
 *     summary: Returns specified list of budgets
 *     operationId: getBudgets
 *     description: |
 *       Returns a list of budgets based on the query provided
 *       If fields of selection are empty, returns all for that field
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: query
 *       name: selection
 *       description: pass an optional search string 
 *       required: false
 *       type: string
 *     responses:
 *       200:
 *         description: search results matching criteria
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Budget'
 *       400:
 *         description: bad input parameter
 */


router.get('/', (req, res) => {
  var sqlQuery = 'SELECT * FROM Budget';
  var content; // Check for query

  if (Object.entries(req.query).length != 0) {
    sqlQuery += ' WHERE';
    var first = true; // Add each query param to sqlQuery string

    for (const [key, value] of Object.entries(req.query)) {
      if (!first) {
        sqlQuery += ' AND';
      }

      sqlQuery += ' `' + key + '`="' + value + '"';
      first = false;
    }

    console.log('Finished:', sqlQuery);
  } // Obtain data from db


  connection.query(sqlQuery, (err, results) => {
    if (err) console.error(err);
    console.log('Sent:', sqlQuery);
    content = results;
    res.send(content);
  });
}); // Export router object for use in API

module.exports = router;

/***/ }),

/***/ "./server/routes/fundingRequests.js":
/*!******************************************!*\
  !*** ./server/routes/fundingRequests.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var connection = __webpack_require__(/*! ../config/db */ "./server/config/db.js");

var router = __webpack_require__(/*! express */ "express").Router();
/**
 * @swagger
 * 
 * /fundingRequests:
 *   get:
 *     tags:
 *     - users
 *     summary: Returns specified list of funding requests
 *     operationId: getFRs
 *     description: |
 *       Returns a list of funding requests based on the query provided
 *       If fields of selection are empty, returns all for that field
 *     produces:
 *     - application/json
 *     parameters:
 *     - in: query
 *       name: selection
 *       description: pass an optional search string 
 *       required: false
 *       type: string
 *     responses:
 *       200:
 *         description: search results matching criteria
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/FundingRequest'
 *       400:
 *         description: bad input parameter
 */


router.get('/', (req, res) => {
  var sqlQuery = 'SELECT * FROM `Funding Requests`';
  var content; // Check for query

  if (Object.entries(req.query).length != 0) {
    sqlQuery += ' WHERE';
    var first = true; // Add each query param to sqlQuery string

    for (const [key, value] of Object.entries(req.query)) {
      if (!first) {
        sqlQuery += ' AND';
      }

      sqlQuery += ' `' + key + '`="' + value + '"';
      first = false;
    }

    console.log('Finished:', sqlQuery);
  } // Obtain data from db


  connection.query(sqlQuery, (err, results) => {
    if (err) console.error(err);
    console.log('Sent:', sqlQuery);
    content = results;
    res.send(content);
  });
}); // Export router object for use in API

module.exports = router;

/***/ }),

/***/ "./server/routes/reallocations.js":
/*!****************************************!*\
  !*** ./server/routes/reallocations.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var connection = __webpack_require__(/*! ../config/db */ "./server/config/db.js");

var router = __webpack_require__(/*! express */ "express").Router();
/**
 * @swagger
 * 
 * /reallocations:
 *   get:
 *     tags:
 *     - users
 *     summary: Returns specified list of reallocations
 *     operationId: getReallocs
 *     description: |
 *       Returns a list of reallocations based on the query provided
 *       If fields of selection are empty, returns all for that field
 *     parameters:
 *     - in: query
 *       name: selection
 *       description: pass an optional search string 
 *       required: false
 *       type: string
 *     produces:
 *     - application/json
 *     responses:
 *       200:
 *         description: search results matching criteria
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Reallocation'
 *       400:
 *         description: bad input parameter
 */


router.get('/', (req, res) => {
  var sqlQuery = 'SELECT * FROM Reallocations';
  var content; // Check for query

  if (Object.entries(req.query).length != 0) {
    sqlQuery += ' WHERE';
    var first = true; // Add each query param to sqlQuery string

    for (const [key, value] of Object.entries(req.query)) {
      if (!first) {
        sqlQuery += ' AND';
      }

      sqlQuery += ' `' + key + '`="' + value + '"';
      first = false;
    }

    console.log('Finished:', sqlQuery);
  } // Obtain data from db


  connection.query(sqlQuery, (err, results) => {
    if (err) console.error(err);
    console.log('Sent:', sqlQuery);
    content = results;
    res.send(content);
  });
}); // Export router object for use in API

module.exports = router;

/***/ }),

/***/ "./server/routes/studentLifeFee.js":
/*!*****************************************!*\
  !*** ./server/routes/studentLifeFee.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var connection = __webpack_require__(/*! ../config/db */ "./server/config/db.js");

var router = __webpack_require__(/*! express */ "express").Router();
/**
 * @swagger
 * 
 * /studentLifeFee:
 *   get:
 *     tags:
 *       - users
 *     summary: Returns data about the student life fee
 *     operationId: getLifeFees
 *     description: |
 *       Returns data about the student life fee over the course of it's history
 *       Automatically returns all available entries
 *     produces:
 *     - application/json
 *     responses:
 *       200:
 *         description: student life fee records
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/LifeFee'
 */


router.get('/', (req, res) => {
  var sqlQuery = 'SELECT * FROM `Student Life Fee`';
  var content; // Check for query

  if (Object.entries(req.query).length != 0) {
    sqlQuery += ' WHERE';
    var first = true; // Add each query param to sqlQuery string

    for (const [key, value] of Object.entries(req.query)) {
      if (!first) {
        sqlQuery += ' AND';
      }

      sqlQuery += ' `' + key + '`="' + value + '"';
      first = false;
    }

    console.log('Finished:', sqlQuery);
  } // Obtain data from db


  connection.query(sqlQuery, (err, results) => {
    if (err) console.error(err);
    console.log('Sent:', sqlQuery);
    content = results;
    res.send(content);
  });
}); // Export router object for use in API

module.exports = router;

/***/ }),

/***/ 0:
/*!******************************!*\
  !*** multi ./server/main.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./server/main.js */"./server/main.js");


/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "localtunnel":
/*!******************************!*\
  !*** external "localtunnel" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("localtunnel");

/***/ }),

/***/ "morgan":
/*!*************************!*\
  !*** external "morgan" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("morgan");

/***/ }),

/***/ "mysql":
/*!************************!*\
  !*** external "mysql" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mysql");

/***/ }),

/***/ "parcel-bundler":
/*!*********************************!*\
  !*** external "parcel-bundler" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("parcel-bundler");

/***/ }),

/***/ "swagger-jsdoc":
/*!********************************!*\
  !*** external "swagger-jsdoc" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("swagger-jsdoc");

/***/ }),

/***/ "swagger-ui-express":
/*!*************************************!*\
  !*** external "swagger-ui-express" ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("swagger-ui-express");

/***/ })

/******/ });
//# sourceMappingURL=main.map