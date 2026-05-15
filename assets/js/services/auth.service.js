const DEFAULT_USERS = [
  {
    id: 1,
    name: 'Administrator',
    username: 'admin',
    email: 'admin@tokoberkah.com',
    password: 'admin123',
    role: 'admin'
  }
];

if (!localStorage.getItem('users')) {
  localStorage.setItem(
    'users',
    JSON.stringify(DEFAULT_USERS)
  );
}

const AuthService = {

  login(username, password) {

    const users =
      Storage.get('users', []);

    const user =
      users.find(
        u =>
          u.username === username &&
          u.password === password
      );

    if (!user) {
      return {
        success: false,
        message: 'Username atau password salah'
      };
    }

    Storage.set('currentUser', user);

    return {
      success: true,
      user
    };
  },

  register(data) {

    const users =
      Storage.get('users', []);

    const usernameExists =
      users.some(
        u => u.username === data.username
      );

    if (usernameExists) {
      return {
        success: false,
        message: 'Username sudah digunakan'
      };
    }

    const emailExists =
      users.some(
        u => u.email === data.email
      );

    if (emailExists) {
      return {
        success: false,
        message: 'Email sudah digunakan'
      };
    }

    const newUser = {
      id: Date.now(),
      role: 'admin',
      ...data
    };

    users.push(newUser);

    Storage.set('users', users);

    return {
      success: true,
      message: 'Register berhasil'
    };
  },

  logout() {

    localStorage.removeItem(
      'currentUser'
    );

    window.location.href =
      'login.html';
  },

  check() {

    return !!Storage.get(
      'currentUser'
    );
  }

};