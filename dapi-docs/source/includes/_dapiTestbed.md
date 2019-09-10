## dAPI Testbed

After you deploy your smart contract, and would like to start building the interface to call your smart contract from your dApp, you can start by using the dAPI Testbed @ [neodapitestbed.o3.app](https://neodapitestbed.o3.app/). This is a free open source testbed which allows you to quickly explore all the different methods on the dAPI. It can make all the same calls related to getting a user address, getting asset balances, and even transfering assets. However, one of the most important features of this testbed is that it allows you to test out your smart contract code by invoking it via the dAPI.

![](/images/tutorials/testbed/testbedOverview.png)

In the testbed, you have a shortcut list for all the methods available on the dAPI. Each method has a simple form for any input varables that may be required or optionally provided. The requirement to using this dAPI testbed is that you have the O3 desktop app open in the background on the same computer. The dAPI JS package included in this testbed dApp will automatically communicate with the O3 wallet in the background.

### Calling our hello world contract

So lets go about calling our hello world smart contract. First, you will notice that at the top right hand corner, there is a network selector. The network will automatically be set to the network of your wallet. So in order to invoke our hello world smart contract on our private net, simply change the wallet network to "PrivateNet" from the network selector found on the bottom left of the wallet.

![](/images/tutorials/testbed/menuBarNetworkSelector.png)

![](/images/tutorials/testbed/networkSelector.png)

Once you have set your wallet to PrivateNet, the dAPI testbed network selector should have automatically updated it's network to PrivateNet as well. If not, please simply refresh the site.
