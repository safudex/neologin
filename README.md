# NeoLogin
> Easy peasy NEO dAPI provider

## Try it

Check out [a live example of a Dapp using NeoLogin](https://neologin.io/example/)!

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
<script src="https://neologin.to/neologin.js"></script>
```
which will expose the `neologin` object in `window.neologin`.

### Use
```
neologin.getAccount()
.then((account) => {
  console.log('Provider address: ' + account.address);
});
```

The `neologin` object exposes a fully-compliant [NEP-12](https://github.com/nickfujita/proposals/blob/dapp-api/nep-12.mediawiki) API so it can be used with anything that supports the standard.

## What is NeoLogin?
NeoLogin is a semi-custodial web-wallet for NEO. User's private keys are encrypted using user passwords and stored on the company's servers, making the keys available from any device with a simple login while also making sure that the service doesn't have access to the keys, making it so no user funds are lost if the service is hacked.

**How is NeoLogin different from Portis?** Portis doesn't work on the NEO blockchain and has no plans to adopt it.  
**What about Switcheo Account?** Switcheo Account only works in the Switcheo exchange, therefore it can't support arbitrary dApps.

Furthermore, Switcheo Account nor Portis are fully open-source, but NeoLogin is.

## How does it work?
It works the same way Portis and Switcheo Account do, check out the explanations for their systems:
- [Portis whitepaper](https://assets.portis.io/white-paper/latest.pdf)
- [Medium article explaining how Switcheo Account works](https://medium.com/switcheo/switcheo-discovery-how-switcheo-account-actually-works-1c702bb77b16)

## Why was this created?
Because I wanted to use a semi-custodial wallet for SafuDEX but couln't find any. I tried to contact Switcheo about their solution but didn't get any reply, couldn't use their system because it's not fully open source and it doesn't make business sense for them to distribute it, as it's one of their competitive advantages.

Still, if Portis, Switcheo or any other company wants to develop a general semi-custodial wallet for NEO I'd love to collaborate on it, just send me an email.

## Convenience benefits
Compared to traditional software wallets, NeoLogin appears as a standard centralized login system from the point of view of users, offering a experience similar to logging into Facebook or Google. This provides the following benefits in terms of convenience:
- Doesn't require installation
- Can be used from multiple devices without any friction
- Device loss doesn't lead to private key loss

## Security analysis

The biggest attack vector is without a doubt the webpage that serves the code that handles the login and decryption of the password. This webpage is directly served from the github repository using Github Pages, which means that if either Github or the repository maintainers were to turn malicious or get hacked it'd be possible to change the website to another one that could capture user login details (such as password and email) and the decrypted private keys and send them to a 3rd party server, effectively stealing all user funds and login details. Fortunately, if this attack were to be carried, it would affect all the wallet logins and the change would be public on Github (unless the attackers managed to get complete control over the github infrastructure and performed an attack especially targeted at NeoLogin, which seems unlikely considering the fact that there's many more profitable targets to attack if Github is hacked), so it'd be possible to detect the attack quickly an act on it. Still, all the users that logged in during the attack would have their wallet compromised.  
It's also worth noting that this attack vector is also present in any other wallet that has a self-updating mechanism, such as all the browser extensions (MetaMask, Teemo, Neoline), all web-based wallets and, finally, any wallets downloaded through an App store, which includes all the mobile wallets and O3 if downloaded through a 3rd party. In these other wallets this particular attack is even worse, as it could affect all users, not just those who have signed in during the attack.

A second attack vector that is also quite important is the key database, which houses all the users' private keys encrypted. If the service operators were to turn malicious or this database was hacked, malicious entities could try to crack the encrypted keys using dictionary attacks or just plain brute force attacks. This means that, if a user's password is weak, it'd be possible to crack the private key's encryption and steal the user's funds. Because of the reliance on the strength of the user's password a simple mitigation for this attack is to use a strong password.

A third problem that may arise is that, if the user hasn't saved the key locally, a shutdown/wipedout of the service can result in the loss of user's private keys, resulting in the loss of all the funds stored in the wallet. Among all the other issues, this one is almost negligible, given that backups of the database are performed routinely and, in case of the service shutting down, there would be a winding down period in which users could retrieve their funds. And, even in the case of the service operators turning suddenly malicious, shutting down the service and refusing to let any users get their keys (exposing themselves to massive legal liabilities in the process) users would be able to get their keys from the files downloaded when the regsitration is performed.

It is possible to mitigate both the first and second attack vectors through the use of Trusted Execution Environments (TEE):      
- The web server that serves the website could be run inside a TEE where the website's SSL certificate would reside, making it so only the software inside the TEE could serve the webpages
- Private keys inside the password database could be doubly encrypted with a key under the control of some software running inside a TEE, which would only decrypt the private key if all the required checks have passed (password provided is correct, 2FA passes...)

In combination, these two changes would make it possible to fully audit the whole system from outside while making it impossible to alter any part of it due to the TEE's hardware isolation. Therefore, neither the service providers nor any hackers could get access to private key's without going through the standard procedure (user login & 2FA).
Implementation of such a system is non-trivial and would require a substantial development effort, which is the reason it's not implemented in the current version. Also, the maintenance costs of such systems would be way higher than the costs of the current one.

Overall, NeoLogin trades security for convenience when compared with traditional wallets. Following is a simple comparison of security attack vectors between wallets:

|           Wallet                 | First attack | Second attack | Third attack |
|----------------------------------|--------------|---------------|--------------|
| Non-updatable traditional wallet |              |               |              |
| Updatabale traditional wallet    |      ⚰️       |               |              |
| non-TEE-based NeoLogin (current) |      ⚰️       |       ⚰️       |       ⚰️      |
| TEE-based NeoLogin (future)      |              |               |              |

## Development

### Front-end

To build the whole system:
```bash
bash build.sh
```

To start a development server:
```
npm start
```

**Note**: The development server only watches and rebuilds javascript files, so if any other type of file (like html) is changed, `bash build.sh` will have to be run for the changes to be applied.

Once the system has been built and the development server is running, go to <http://localhost:8080/example/> for a live version of the current system.

### Back-end

Uses Amazon Cognito.  
When creating the user pool the following things must be taken into account:
- In order for the SDK to work, an "App Client" must be added. Furthermore, when creating the App client the checkbox "Generate client secret" must not be checked.
- A custom attribute with type "string", name "privkey" and length "2000" must be added.
- Login by email (instead of by username, which is the default) must be enabled, along with no verification.
- The lambda function stored in `backend/autoConfirmUser.lambda.js` must be created and set as the trigger for the `pre sign-up` event.
