# Errors
The NEO dAPI will provide these basic errors. It is up to the wallet provider to provide additional information if they choose:

| Error Type         | Meaning                                                                     |
| ------------------ | --------------------------------------------------------------------------- |
| NO_PROVIDER        | Could not find an instance of the dAPI in the webpage                       |
| CONNECTION_DENIED  | The dAPI provider refused to process this request                           |
| RPC_ERROR          | An RPC error occured when submitting the request                            |
| MALFORMED_INPUT    | An input such as the address is not a valid NEO address                     |
| CANCELED           | The user cancels, or refuses the dapps request                              |
| INSUFFICIENT_FUNDS | The user does not have a sufficient balance to perform the requested action |
