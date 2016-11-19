

## Run the Application

To serve the applicaton in the browser, use `ionic serve`.

```bash
npm install -g ionic cordova 
```



```bash
git clone https://github.com/jarangol/EncontraloPues.git 
```
```bash
 cd EncontraloPues/Usuario/EncontraloPues-User/
```

```bash
npm install
```

web

```bash
ionic serve --lab
```

To emulate the application, use `ionic emulate`. You may optionally choose a target device for the platform you are using.
Requiremetes: have a previous sdk Installation
```bash
 ionic plugin add phonegap-plugin-barcodescanner
```

```bash
ionic run android 
```
or

```bash
ionic emulate ios --target="iPhone-6"
```


## What is Auth0?

Auth0 helps you to:

* Add authentication with [multiple authentication sources](https://docs.auth0.com/identityproviders), either social like **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce, among others**, or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory, ADFS or any SAML Identity Provider**.
* Add authentication through more traditional **[username/password databases](https://docs.auth0.com/mysql-connection-tutorial)**.
* Add support for **[linking different user accounts](https://docs.auth0.com/link-accounts)** with the same user.
* Support for generating signed [JSON Web Tokens](https://docs.auth0.com/jwt) to call your APIs and **flow the user identity** securely.
* Analytics of how, when and where users are logging in.
* Pull data from other sources and add it to the user profile, through [JavaScript rules](https://docs.auth0.com/rules).

