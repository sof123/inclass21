const md5 = require('md5')

module.exports = app => {
     app.post('/login', login)
     app.post('/register', register)
}
var database = []
var sid = []
var salt = "thesaltthesaltsaltysalt"




function login(req, res){
  var username = req.body.username;
  var password = req.body.password;
  if (!username || !password){
    res.sendStatus(400)
    return
  }
  var userObj = getUser(username)
  var hashInDatabase = userObj.hash
  //compare with salt
  if (!userObj || (hashInDatabase !== md5(password.concat(salt)))){
    res.sendStatus(401)
    return
  }

  //save cookie
  res.cookie(userObj.username + sid.length, generateCode(userObj),
    {maxAge: 3600*1000, httpOnly: true})

  //map sid to user
  var msg = {username: username, result: 'success'}
  sid.push(username)

  res.send(msg)
}

function getUser(username){
  for (var i = 0; i < database.length;i++){
    if (database[i].username == username){
      return database[i]
    }
  }
  return {}
}

function generateCode(obj)
{
  return 12345
}

function register(req, res){
  var username = req.body.username;
  var password = req.body.password;

  database.push({username: username, salt: salt, hash: md5(password.concat(salt))})

  var userObj = {username: username, password: password}

  res.cookie(userObj.username + sid.length, generateCode(userObj),
    {maxAge: 3600*1000, httpOnly: true})

  var msg = {username: username, result: 'success'}
  res.json(msg)
}
