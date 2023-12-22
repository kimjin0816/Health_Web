const mongoose = require('mongoose');

var MemberSchema = mongoose.Schema({   //회원 정보 스키마(Schema) 설정
  userId: {type: String, require:true, unique: true},
  pw: { type: String, require: true},
  name: { type: String, require: true},
  e_mail: { type: String, require: true},
  tel: { type: String, require: true},
  register_date: { type: Date, default:Date.now}
});

module.exports = mongoose.model('Member', MemberSchema);