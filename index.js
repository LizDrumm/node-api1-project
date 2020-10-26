// 1- DEPENDENCIES

const express = require('express') // commonjs module system that came with Node
const generate = require('shortid').generate

//2- INSTANTIATE AND CONFIGURE THE SERVER
const app = express() // here is our app (our server)
app.use(express.json()) // plugging in a piece of middleware


// 3- DECIDE A PORT NUMBER
const PORT = 3001

// 4- FAKE DATA
let users= [{
    id:  generate(),
    name: "Jane Doe", // String, required
    bio: "Not Tarzan's Wife, another Jane",  // String, required
  },
]


// [GET, POST...] catch all endpoint (404 resource not found)
// app.use('*', (req, res) => {
//     res.status(404).json({ message: 'Not found!' })
//   })


//|POST| /api/users| Creates a user using the information sent inside the `request body`
app.post('/api/users', (req, res) => {
    const {name,bio} = req.body
    try {
    if (!name || !bio){
    res.status(400).json({message: "Please provide name and bio for the user."
    });
    } else{
    // 3- make a new resource, complete with unique id
    const newUser = { id: generate(), name, bio }
    // 4- add the new dog to our fake db
   users.push(newUser)
    // 5- send back the newly created resource
    res.status(201).json(newUser) // up to you what to send
  }
 } catch (error) {
    res.status(500).json({ message:"There was an error while saving the user to the database" })
  }
})



//| GET| /api/users| Returns an array users.          
app.get('/api/users', (req, res) => {
    res.status(200).json(users)
  })

//| GET| /api/users/:id | Returns the user object with the specified `id`.  

app.get('/api/users/:id', (req, res) => {
    // 1- pull out the id from the request (the URL param)
    const { id } = req.params
    // 2- find the user in the users arr with the given id
    const user = users.find(user => user.id === id)
    // 3- set status code and send back the user
    if (!user) {
      res.status(404).json({
        message: `The user with the specified ID ${id} does not exist.`,
      })
    } else {
      res.status(200).json(user)
    }
  })


//| DELETE| /api/users/:id | Removes the user with the specified `id` and returns the deleted user.                      

app.delete('/api/users/:id', (req, res) => {
    // 1- find dog by the given id
    // 2- remove it from the dogs array
    // 3- send back something
    const { id } = req.params
    try {
      if (!users.find(user => user.id === id)) {
        res.status(404).json({ message : 'The user with the specified ID does not exist.'})
      } else {
       users = users.filter(user => user.id !== id)
        res.status(200).json({ message: `User with id ${id} got deleted!`})
      }
      // if there is a crash here
      // instead of the app blowing up
      // the block inside the catch will run
    } catch (error) {
      res.status(500).json({ message: "The user could not be removed" })
    }
  })


|
//| PUT| /api/users/:id | Updates the user with the specified `id` using data from the `request body`. Returns the modified user |
app.put('/api/users/:id', (req, res) => {
    // 1- pull id from params
    const { id } = req.params
    // 2- pull name and breed from body
    const { name, bio } = req.body
    // 3- validate id and validate req body
    const indexOfUser = users.findIndex(user => user.id === id)
    // 4- find the user and swap "breed" and "name"
    if (indexOfUser !== -1) {
      users[indexOfUser] = { id, name, bio }
      // 5- send back the updated dog
      res.status(200).json({ id, name, bio })
    } else {
      res.status(404).json({
        message: `No user with id ${id}`,
      })
    }
  })
  


// 6- LISTEN FOR INCOMING REQUESTS
app.listen(PORT, () => {
    console.log(`LISTENING ON PORT ${PORT}`)
  })
  