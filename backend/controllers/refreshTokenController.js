const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    const myjwt = cookies?.jwt;
    const authHeader  = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (!myjwt && !token) return res.sendStatus(401);
    const contentBetween =  myjwt ? myjwt?.slice(2, -2) : authHeader?.split(' ')[1];
    
    const refreshToken = contentBetween;
    const foundUser = await User.findOne({ refreshToken: refreshToken });
    if (!foundUser) return res.sendStatus(403); //Forbidden 
    // evaluate jwt 

    if (!foundUser) {
        jwt.verify(
            refreshToken,
            process.env.JWT_SECRET,
            async (err, decoded) => {
                if (err) return res.sendStatus(403); //Forbidden
                // Delete refresh tokens of hacked user
                const hackedUser = await User.findOne({ email: decoded.email });
                hackedUser.refreshToken = [];
                const result = await hackedUser.save();
            }
        )
    }

    const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);

    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.JWT_SECRET,
        async (err, decoded) => {

            if (err && foundUser) {
                // expired refresh token
                foundUser.refreshToken = [...newRefreshTokenArray];
                const result = await foundUser.save();
            }

            if (err || foundUser?.email !== decoded?.email) return res.sendStatus(403);

            // Refresh token was still valid
            const accessToken = jwt.sign(
                {
                    email: foundUser.email,
                    roles: foundUser.roles
                },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );
            const newRefreshToken = jwt.sign(
                {
                    email: foundUser.email,
                    roles: foundUser.roles
                },
                process.env.JWT_SECRET,
                { expiresIn: '30d' }
            );

            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            
            const result = await User.findOneAndUpdate({ _id: foundUser.id }, { refreshToken: foundUser.refreshToken }, { upsert: true });

            let userObj = result.toObject();

            excludeFields.forEach(field => {
                delete userObj[field];
            });

            res.json({ user: userObj });

        }
    );


}

module.exports = { handleRefreshToken }