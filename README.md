# NeoLogin
> A simple and easy to integrate wallet provider for NEO dApps

## Try it

Check out [a live example of NeoLogin's capabilities](https://neologin.io/)!

## Quickstart

### Install and import
Install it via npm and import it directly:
```bash
npm i neologin
```
```js
import neologin from 'neologin';
```

Or add it as a script tag to your html pages:
```html
<script src="https://neologin.io/neologin.js"></script>
```
which will expose the `neologin` object in `window.neologin`.

### Use
```
neologin.getAccount()
.then((account) => {
  console.log('Provider address: ' + account.address);
});
```


The API exposed by `neologin`, which is fully documented in [our API reference](https://neologin.io/api/), is exactly the same that O3 uses, so dApps that already integrate with O3 can directly add NeoLogin as a wallet provider.

## What is NeoLogin?
NeoLogin is a non-custodial web-based wallet for NEO. NeoLogin encrypts the user's private key with their password (making sure that it has enough entropy to prevent password cracking attacks) on sign up and proceeds to store the encrypted private key on it's servers.
Every time a user logs in, the private key is downloaded and decrypted in the browser client, therefore the server never gets to know the decryption password nor the private key itself.

This allows NeoLogin to provide the security of a non-custodial wallet coupled with the User Experience of a centralized login solution, as, from the point of view of the user, it works the same way as Google's universal login. 

## How does it work?
NeoLogin encrypts the user's private key with their password (making sure that it has enough entropy to prevent password cracking attacks) on sign up and proceeds to store the encrypted private key on it's servers.
Every time a user logs in, the private key is downloaded and decrypted in the browser client, therefore the server never gets to know the decryption password nor the private key itself.

This allows NeoLogin to provide the security of a non-custodial wallet coupled with the User Experience of a centralized login solution, as, from the point of view of the user, it works the same way as Google's universal login.

## Convenience benefits
Compared to traditional software wallets, NeoLogin appears as a standard centralized login system from the point of view of users, offering a experience similar to logging into Facebook or Google. This provides the following benefits in terms of convenience:
- Doesn't require installation
- Can be used from multiple devices without any friction
- Device loss doesn't lead to private key loss

## Security Analysis
[Analysis](https://github.com/safudex/neologin/blob/master/SECURITY.md)

## Development

### Front-end

Build the whole system:
```bash
bash build.sh production
```
The static files resulting from the build will be found in `./dist`

Start a development server:
```
bash build.sh dev
```
Once the system has been built and the development server is running, go to <http://localhost:3000/> for a live version of the current system.

### Back-end
It's based in the following AWS resources:
- Cognito for the user authentication
- SES for the email sending
- SNS for the SMS sending

In order to use all of this, you have to contact Amazon support in order to get:
- The sandbox restrictions on SES lifted
- Increased SMS spending limit on SNS
- Verified the address and domain (in order to get DKIM) from where you plan to send the emails

Once you've had everything sorted out, you can deploy the backend with:
```bash
npm install -g @aws-amplify/cli # Install Amplify CLI
amplify configure # Configure Amplify to use your Amazon account
sed -i 's/arn:aws:ses:eu-west-1:207627709836:identity\/hello@neologin.io/YOUR EMAIL ARN/' amplify/backend/auth/neologinAuth/neologinAuth-cloudformation-template.yml # Change the email adress from where emails will be sent 
amplify push # Deploy the backend
```

After the backend has been deployed, you'll have to modify all the references to `neologin.io` present in the code to point to your own backend services.

## Acknowledgements
NeoLogin has been heavily inspired by [Portis](https://www.portis.io/).
