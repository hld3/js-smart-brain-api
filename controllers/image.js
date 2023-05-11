const USER_ID = 'hld3';
// Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = '2e4a2196676d4e4f8e0dee0b12b14b62';
const APP_ID = 'd2c92fdc722b4142aa5509a365a10a4c';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';
let IMAGE_URL = '';

const constructRaw = () => {
  return JSON.stringify({
    user_app_id: {
      user_id: USER_ID,
      app_id: APP_ID,
    },
    inputs: [
      {
        data: {
          image: {
            url: IMAGE_URL,
          },
        },
      },
    ],
  });
};

const requestOptions = (raw) => {
  return {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Key ' + PAT,
    },
    body: raw,
  };
};

const retrieveImageData = (req, res) => {
  IMAGE_URL = req.body.input;
  const raw = constructRaw();

  fetch(
    'https://api.clarifai.com/v2/models/' +
      MODEL_ID +
      '/versions/' +
      MODEL_VERSION_ID +
      '/outputs',
    requestOptions(raw)
  )
    .then((response) => response.json())
    .then((response) => res.json(response))
    .catch((err) =>
      console.error('There was an error retrieving the image data', err)
    );
};

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
  handleImage,
  retrieveImageData,
};
