import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import { Owners } from '../models'
import passport from 'passport'

const jwtOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'secret-key',
};

const jwtStrategy = new JWTStrategy(jwtOpts, async (payload, done) => {
    try {
        const user = await Owners.findById(payload.id);

        if (!user) {
            return done(null, false);
        }
        return done(null, user);
    } catch (e) {
        return done(e, false);
    }
});

passport.use(jwtStrategy);

export const authJwt = passport.authenticate('jwt', { session: false });