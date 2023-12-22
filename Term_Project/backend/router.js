module.exports = (app) => {
  const members = require('./member.controller.js'); //member.controller.js를 로딩
  const routine = require('./routine.controller.js');
  const crawling = require('./crwaling.js');

  const authenticateUser = (req, res, next) => {
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
      console.log('인증 성공');
      next();
    } else {
      //res.status(301).redirect('/login');
      console.log('인증 실패');
      //res.send({code:2});
      next();
    }
  };

  app.get('/members', authenticateUser, members.findAll);
  app.get('/members/:userId', members.findOne);
  app.post('/members', authenticateUser, members.create);
  app.put('/members/:userId', members.update);
  app.delete('/members/:userId', members.delete);

  app.get('/routine', routine.findAll);
  app.get('/routine/:deviceId', routine.find);
  app.post('/routine', routine.create);
  app.put('/routine/:deviceId/:name/:register_date', routine.update);
  app.delete('/routine/:deviceId/:name/:register_date', routine.delete);
  app.delete('/routine/:deviceId', routine.deleteAll);

  app.post('/emit', routine.emitAfter);
  app.get('/emit/:deviceId/:register_date', routine.oneDayfind);

  app.get('/crawling', crawling.crawling);
}
