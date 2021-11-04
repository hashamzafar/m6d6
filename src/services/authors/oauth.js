import passport from "passport"
import GoogleStrategy from "passport-google-oauth20"
import AuthorModel from "./schema.js"
import { JWTAuthenticate } from "./tools.js"


const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_OAUTH_ID,
        clientSecret: process.env.GOOGLE_OAUTH_SECRET,
        callbackURL: `${process.env.API_URL}/authors/googleRedirect`,
    },
    async (accessToken, refreshToken, googleProfile, passportNext) => {
        try {

            console.log(googleProfile)


            const user = await AuthorModel.findOne({ googleId: googleProfile.id })

            if (user) {

                const tokens = await JWTAuthenticate(user)
                passportNext(null, { tokens })
            } else {


                const newUser = {
                    name: googleProfile.name.givenName,
                    surname: googleProfile.name.familyName,
                    email: googleProfile.emails[0].value,
                    googleId: googleProfile.id,
                }

                const createdAuthor = new AuthorModel(newAuthor)
                const savedAuthor = await createdUser.save()

                const tokens = await JWTAuthenticate(savedAuthor)

                passportNext(null, { tokens })
            }
        } catch (error) {
            passportNext(error)
        }
    }
)

passport.serializeUser(function (data, passportNext) {
    passportNext(null, data)
})

export default googleStrategy