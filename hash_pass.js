const bcrypt = require('bcryptjs');
const password = 'F4372u1430h/';
bcrypt.hash(password, 10).then(hash => {
    console.log(hash);
});
