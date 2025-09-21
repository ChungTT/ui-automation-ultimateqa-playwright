const jsonServer = require('json-server');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const createReqSchema = {
  type: 'object',
  properties: {
    username: { type: 'string' },
    dateOfBirth: { type: 'string', format: 'date-time' },
    gender: { type: ['string', 'null'], enum: ['MALE', 'FEMALE', 'OTHER', null] },
    subscribedMarketing: { type: ['boolean', 'null'] },
    hasSetupPreference: { type: ['boolean', 'null'] }
  },
  required: ['username', 'dateOfBirth'],
  additionalProperties: true
};
const validateCreate = ajv.compile(createReqSchema);

const server = jsonServer.create();
const router = jsonServer.router(path.join(process.cwd(), 'db.json'));
const middlewares = jsonServer.defaults();

server.use(jsonServer.bodyParser);

// Validate body POST
server.post('/v1/profile', (req, res, next) => {
  try {
    if (!validateCreate(req.body)) {
      return res.status(400).json({ message: 'Invalid body', errors: validateCreate.errors });
    }
    next();
  } catch (e) {
    console.error('Validate error:', e);
    return res.status(400).json({ message: 'Invalid body' });
  }
});

// (optional) log
server.get('/v1/profile/:userId', (req, res, next) => {
  console.log('GET /v1/profile', req.params.userId);
  next();
});

// ✅ REWRITER: tên tham số phải trùng
server.use(
  jsonServer.rewriter({
    '/v1/profile': '/profile',
    '/v1/profile/:userId': '/profile/:userId'
  })
);

server.use(middlewares);

// Map id -> userId + xử lý 404 rõ ràng
router.render = (req, res) => {
  const toUserId = (item) => {
    if (!item) return item;
    const { id, ...rest } = item;
    return { userId: id, ...rest };
  };

  const data = res.locals.data;

  if (data === undefined || data === null) {
    return res.status(404).jsonp({ message: 'Not Found' });
  }

  if (Array.isArray(data)) return res.jsonp(data.map(toUserId));
  return res.jsonp(toUserId(data));
};

server.use(router);

server.listen(3000, () => {
  console.log('✅ Mock API server is running at http://localhost:3000');
});
