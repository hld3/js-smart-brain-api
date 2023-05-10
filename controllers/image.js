const handleImage = (req, res, knex) => {
  let { id } = req.body;
  id = parseInt(id);
  knex('users')
    .returning('*')
    .where({ id })
    .increment('entries', 1)
    .then((user) => {
      user.length > 0
        ? res.json(user[0].entries)
        : res.status(400).json('User not found');
    })
    .catch((err) => res.status(400).json('Error incrementing entries.'));
};

module.exports = {
  handleImage: handleImage,
};
