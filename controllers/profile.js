const handleProfile = (req, res, knex) => {
  let { id } = req.params;
  id = parseInt(id);
  knex
    .select()
    .from('users')
    .where({ id })
    .then((user) => {
      user.length > 0
        ? res.json(user[0])
        : res.status(400).json('User not found.');
    })
    .catch((err) => res.status(400).json('Error retrieving user.'));
};
