const mongoose = require('mongoose');

var ExerciseSchema = mongoose.Schema({   //회원 정보 스키마(Schema) 설정
  deviceId: {type: String, require:true},
  name: { type: String, require: true},
  equipment: { type: String, require: true},
  body: { type: String, require: true},
  count: { type: Number, require: true},
  set: { type: Number, require: true},
  register_date: { type: String, require: true}
});

module.exports = mongoose.model('Exercise', ExerciseSchema);
