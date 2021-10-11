import jwt from "jsonwebtoken"


const generateJWT = payload =>
    new Promise((resolve, reject) =>
        jwt.sign(payload, process.env.JWT_SECRET, { exprireIn: "1 week" }, (err, token) => {
            if (err) reject(err)
            resolve(token)
        }))


// generateJwt(1221321).then(token => console.log(tekon)).catch(err => console.log(err))

// const token = await generateJWT(12312312)



const verifyJWT = token => new promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) reject(err)
        resolve(decodedToken)
    })
})