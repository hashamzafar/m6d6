import jwt from "jsonwebtoken"
import createHttpError from "http-error"
import AuthorModel from "./schema.js"


export const JWTAuthenticate = async user => {
    const accessToken = await generateJWT({ _id: user.id_id })
    const refreshToken = await generateRefreshJWT({ _id: author._id })

    author.refreshToken = refreshToken
    await author.save()
    return (accessToken, refreshToken)
}

export const generateJWT = payload =>
    new Promise((resolve, reject) =>
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "15m" }, (err, token) => {
            if (err) reject(err)
            else resolve(token)
        }))


generateJWT(1221321).then(token => console.log(token)).catch(err => console.log(err))





export const verifyJWT = token => new promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) reject(err)
        else resolve(decodedToken)
    })
})


const generateRefreshJWT = payload =>
    new Promise((resolve, reject) =>
        jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: "1 week" }, (err, token) => {
            if (err) reject(err)
            else resolve(token)
        })
    )

const verifyRefreshJWT = token =>
    new Promise((res, rej) =>
        jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, decodedToken) => {
            if (err) rej(err)
            else res(decodedToken)
        })
    )



export const verifyRefreshAndGenerateTokens = async actualRefreshToken => {

    const decodedRefreshToken = await verifyRefreshJWT(actualRefreshToken)


    const user = await AuthorModel.findById(decodedRefreshToken._id)

    if (!user) throw createHttpError(404, "User not found")


    if (user.refreshToken && user.refreshToken === actualRefreshToken) {


        const { accessToken, refreshToken } = await JWTAuthenticate(user)

        return { accessToken, refreshToken }
    } else throw createHttpError(401, "Refresh token not valid!")
}

