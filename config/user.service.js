const users = [{ id: 1, username: 'coba', password: 'coba', firstName: 'Test', lastName: 'User' }];

module.exports = {
    authenticate,
    getAll
};

async function authenticate({ username, password }) {
    console.log(username + ' ' + password)
    const user_auth = users.find(u => u.username === username && u.password === password);

    if (user_auth) {
        const { password, ...userWithoutPassword } = user_auth;
        return userWithoutPassword;
    }
}

async function getAll() {
    return users.map(u => {
        const { password, ...userWithoutPassword } = u;
        return userWithoutPassword;
    });
}