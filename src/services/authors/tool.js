import jwt from "jsonwebtoken"


export const JWTAuthenticate = async user => {
    const accessToken = await generateJWT({ _id: user.id_id })
    return accessToken
}

export const generateJWT = payload =>
    new Promise((resolve, reject) =>
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1 week" }, (err, token) => {
            if (err) reject(err)
            else resolve(token)
        }))


generateJWT(1221321).then(token => console.log(token)).catch(err => console.log(err))





export const verifyJWT = token => new promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) reject(err)
        resolve(decodedToken)
    })
})