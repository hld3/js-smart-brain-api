export const handleRegister = (req, res, knex, bcrypt) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json('Incorrect form data.');
  }

  const hash = bcrypt.hashSync(password);
  knex.transaction((trx) => {
    trx
      .insert({
        hash: hash,
        email: email,
      })
      .into('login')
      .returning('email')
      .then((loginEmail) => {
        trx
          .insert({
            name: name,
            email: loginEmail[0].email,
            joined: new Date(),
          })
          .into('users')
          .returning('*')
          .then((user) => res.json(user[0]))
          .catch((err) =>
            res.status(400).json('There was an error during registration.')
          );
      })
      .then(trx.commit)
      .catch(trx.rollback);
  });
};
