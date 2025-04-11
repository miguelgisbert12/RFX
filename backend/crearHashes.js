const bcrypt = require('bcryptjs');

const passwords = ['password1', 'password2', 'password3'];

passwords.forEach((password, index) => {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            console.log(`Usuario ${index + 1}: ${hash}`);
        });
    });
});