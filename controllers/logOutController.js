const User = require("../models/User");
const handleLogOut = async(req, res) => {
    //on client also delete the access token
    const cookies = req.cookies
    if (!cookies?.jwt) {
        return res.sendStatus(204) //no content
    }
    
    const refreshToken = cookies.jwt;
    const foundUser = User.find(person => person.refreshToken === refreshToken)
    if (!foundUser) {
        res.clearCookie('jwt', {httpOnly: true, sameSite: 'none', secure: 'true'})
        return res.sendStatus(204)//forbidden
    }
    
    //delete refresh token in db
    const otherUsers =Users.filter(person => person.refreshToken !== foundUser.refreshToken)
    const currentUser = {...foundUser, refreshToken: ''}
    usersDB.setUsers([...otherUsers, currentUser])
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(usersDB.users)
    )
        
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'none', secure: 'true'})
    res.sendStatus(204)
        
}

module.exports = {handleLogOut}