const routine = require('./routine.model.js');

// 새로운 루틴 만들기
exports.create = (req, res) => {
  const contact = new routine({
    deviceId: req.body.deviceId,
    name: req.body.name,
    equipment: req.body.equipment,
    body: req.body.body,
    count: req.body.count,
    set: req.body.set,
    register_date: req.body.register_date
  });

  //데이터베이스에 새로운 루틴 저장하기 
  contact.save()
    .then(data => {
      // $socket.emit('update', data);
      res.send(data);
    }).catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.emitAfter = (req, res, next) => {
  $socket.emit('after', {
    name: req.body.name,
    equipment: req.body.equipment,
    body: req.body.body,
    count: req.body.count,
    set: req.body.set,
  });
  next();
};

//모든 루틴 검색
exports.findAll = (req, res) => {
  routine.find()
    .then(contacts => {
      console.log(contacts)	//test log
    })
    .catch(err => {
      io.emit('error', { message: err.message }); // Emit 'error' event with error message
    });
};

exports.find = (req, res) => {
  routine.find({ deviceId: req.params.deviceId })
    .then(data => {
      // data를 배열로 반환해줘
      if (!Array.isArray(data)) {
        data = [data];
      }
      console.log('data: ' + data);
      res.send(data);
    }).catch(err => {
      return res.status(500).send({ message: "검색 중 에러 발생: " + err.message });
    });
};

exports.oneDayfind = (req, res) => {
  routine.find({ deviceId: req.params.deviceId, register_date: req.params.register_date })
    .then(contact => {
      console.log('data: ' + contact);
      res.send(contact);
    }).catch(err => {
      return res.status(500).send({ message: "검색 중 에러 발생: " + err.message });
    });
};

//업데이트
exports.update = (req, res) => {
  routine.findOneAndUpdate({ deviceId: req.params.deviceId, name: req.params.name, register_date: req.params.register_date },
    {
      deviceId: req.body.deviceId, // session이름 넣으면 될거같구
      name: req.body.name,
      equipment: req.body.equipment,
      body: req.body.body,
      count: req.body.count,
      set: req.body.set,
      register_date: req.params.register_date // 달력 날짜 입력
    },
    { new: true }
  )
    .then(contact => {
      if (!contact) {
        return res.status(404).send({
          message: req.params.deviceId + "에 해당하는 회원님의 정보가 없습니다. "
        })
      }
      res.send(contact);
    }).catch(err => {
      return res.status(500).send({ message: err.message });
    });
};

//삭제
exports.delete = (req, res) => {
  routine.findOneAndDelete({ deviceId: req.params.deviceId, name: req.params.name, register_date: req.params.register_date })
    .then(contact => {
      if (!contact) {
        return res.status(404).send({ message: req.params.deviceId + "에 해당하는 회원이 없습니다." })
      }
      res.send({ message: "정상적으로 " + req.params.deviceId + " 탈퇴되었습니다." })
    })
    .catch(err => {
      return res.status(500).send({ message: err.message });
    });
};

//모든 루틴 삭제
exports.deleteAll = (req, res) => {
  routine.deleteMany({ deviceId: req.params.deviceId })
    .then(data => {
      res.send({
        message: req.params.deviceId + "의 모든 루틴이 정상적으로 삭제되었습니다."
      })
    })
    .catch(err => {
      return res.status(500).send({ message: err.message });
    });
};