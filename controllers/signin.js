export const handleSignIn = (req, res, knex, bcrypt) => {
  knex
    .select()
    .from('login')
    .where({ email: req.body.email })
    .then((users) => {
      if (users.length > 0) {
        const isUser = bcrypt.compareSync(req.body.password, users[0].hash);
        if (isUser) {
          knex
            .select()
            .from('users')
            .where({ email: users[0].email })
            .then((user) => {
              if (user) {
                res.json(user[0]);
              } else {
                res.status(400).json('user not found.');
              }
            });
        } else {
          res.status(400).json('wrong credentials.');
        }
      } else {
        res.status(400).json('Error signing in.');
      }
    })
    .catch((err) => console.log('wrong credentials.'));
};
