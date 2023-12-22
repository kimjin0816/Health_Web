const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const cookieParser = require('cookie-parser');
const session = require('express-session');
const User = require('./member.model.js');


module.exports = (app) => {
    app.use(cookieParser('passportExample'));
    app.use(session({
        resave: false,
        saveUninitialized: false,
        secret: 'passportExample',
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 30,
        },
    }));
    /* passport middleware */
    app.use(passport.initialize()); // passport 초기화
    app.use(passport.session()); // passport session 연동

    passport.use(new LocalStrategy(
        async (username, password, done) => {
            try {
                const user = await User.findOne({ userId: username }).select('userId pw');

                if (username === user.userId) { // username OK
                    if (password === user.pw) { // password OK
                        console.log('passport local strategy success');
                        console.log(user);
                        return done(null, user);
                    } else {
                        return done(null, false, { message: "password incorrect" });
                    }
                } else {
                    return done(null, false, { message: "username incorrect" });
                }
            } catch (err) {
                return done(null, false, { message: "username incorrect" });
            }
        }
    ));

    // 세션 처리 - 로그인에 성공했을 경우 딱 한번 호출되어 사용자의 식별자를 session에 저장
    passport.serializeUser((user, done) => {
        console.log('serializeUser', user);
        done(null, user.userId);
    });

    passport.deserializeUser((userId, done) => { // 매개변수 id는 req.session.passport.user에 저장된 값
        console.log('deserializeUser');
        User.findOne({ userId: userId })
            .then((user) => {
                done(null, user);
                console.log(user);
            })
            .catch((err) => {
                done(err);
            }
            );
    });

    app.post('/login', (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            // err는 서버의 에러
            if (err) {
                console.error(err);
                return next(err);
            }
            // info는 로직 상의 에러
            if (info) {
                console.log(req.isAuthenticated());
                return res.send({ code: 0 });
            }
            // 위의 모든 에러가 없다면 로그인 성공
            // req.login을 하면 서버쪽에 세션과 쿠키로 저장이 된다.
            console.log(req.isAuthenticated());
            req.login({
                userId: user.userId,
                pw: user.pw,
            }, (loginErr) => {
                if (loginErr) return next(loginErr);
                // 정상적이라면 비밀번호를 제외한 유저 정보를 클라이언트에게 보낸다.
                console.log('req.session.passport.user: ', req.session.passport.user)
                console.log('isAuthenticated: ', req.isAuthenticated());
                console.log('session: ', req.session);
                console.log('user: ', req.user);
                req.session.save((err) => {
                    if (err) {
                        console.error(err)
                        next(err)
                        return false

                    } else {
                        console.log('login success ');
                        res.send({ code: 1 });
                        return true
                    }
                });
            });
        })(req, res, next); //미들웨어 내의 미들웨어에는 (req,res,next)를 붙인다.
    });

    app.get('/logout', (req, res) => {
        req.logout(function (err) {
            //세션의 정보를 삭제
            console.log('logout');
            res.clearCookie('connect.sid');
            req.session.destroy();

            console.log('isAuthenticated: ', req.isAuthenticated());
            console.log('session: ', req.session);
            console.log('user: ', req.user);

            if (err) {
                // 로그아웃 중에 오류가 발생한 경우
                console.error('Logout error:', err);
            }
            else {
                // 로그아웃 성공
                console.log('Logout success');
                res.send({ code: 0});
            }
        });
    });
}