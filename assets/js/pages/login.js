document.addEventListener(
  'DOMContentLoaded',
  initLoginPage
);

function initLoginPage() {

  if (AuthService.check()) {
    window.location.href =
      'admin.html';
  }

  bindLogin();

  bindRegister();
}

function bindLogin() {

  const form =
    document.getElementById(
      'login-form'
    );

  if (!form) return;

  form.addEventListener(
    'submit',
    handleLogin
  );
}

function bindRegister() {

  const form =
    document.getElementById(
      'register-form'
    );

  if (!form) return;

  form.addEventListener(
    'submit',
    handleRegister
  );
}

function handleLogin(e) {

  e.preventDefault();

  const username =
    document
      .getElementById(
        'login-username'
      )
      .value
      .trim();

  const password =
    document
      .getElementById(
        'login-password'
      )
      .value
      .trim();

  const result =
    AuthService.login(
      username,
      password
    );

  const error =
    document.getElementById(
      'login-error'
    );

  if (!result.success) {

    error.textContent =
      result.message;

    return;
  }

  window.location.href =
    'admin.html';
}

function handleRegister(e) {

  e.preventDefault();

  const password =
    document
      .getElementById(
        'register-password'
      )
      .value;

  const confirm =
    document
      .getElementById(
        'register-confirm'
      )
      .value;

  const error =
    document.getElementById(
      'register-error'
    );

  error.textContent = '';

  if (password !== confirm) {

    error.textContent =
      'Password tidak cocok';

    return;
  }

  const result =
    AuthService.register({

      name:
        document
          .getElementById(
            'register-name'
          )
          .value,

      username:
        document
          .getElementById(
            'register-username'
          )
          .value,

      email:
        document
          .getElementById(
            'register-email'
          )
          .value,

      password

    });

  if (!result.success) {

    error.textContent =
      result.message;

    return;
  }

  error.classList.remove(
    'text-danger'
  );

  error.classList.add(
    'text-success'
  );

  error.textContent =
    result.message;

  document
    .getElementById(
      'register-form'
    )
    .reset();
}