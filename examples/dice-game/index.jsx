import { render } from 'react-dom';
import { useEffect, useMemo, useState, useRef } from 'react';
import ReactDice from 'react-dice-complete';

import { withZKCWeb3MetaMaskProvider, ZKCWasmServiceHelper } from 'zkc-sdk';

const diceGameUrl = new URL('./wasmsrc/c/dice-game.wasm', import.meta.url);
const moonIcon = new URL('./moon.png', import.meta.url);

export function MyReactDice({ rollDone }) {
  const reactDice = useRef(null);

  const rollAll = () => reactDice.current?.rollAll();

  return (
    <>
      <button className="" onClick={rollAll}>
        <span>Play Now</span>
      </button>
      <ReactDice
        ref={reactDice}
        numDice={3}
        rollDone={(_, diceValues) => rollDone(diceValues)}
      />
    </>
  );
}

// Application image id that has been created and can be used for task proofing
const TUTORIAL_MD5 = '665272C6FD6E4148784BF1BD2905301F';

export function Home() {
  const [userAddress, setUserAddress] = useState('');
  const [diceArr, setDiceArr] = useState([0, 0, 0]);
  const [sum, setSum] = useState(0);

  // private inputs
  // Input must be empty or have format (0x)[0-f]*:(i64|bytes|bytes-packed) and been separated by spaces (eg: 0x12:i64).
  const witness = useMemo(
    () => [
      `0x${diceArr.length.toString(16)}:i64`,
      `0x${diceArr
        .map(value => value.toString(16).padStart(2, '0'))
        .join('')}:bytes-packed`,
    ],
    [diceArr],
  );

  // public inputs
  // Inputs must have format (0x)[0-f]*:(i64|bytes|bytes-packed) and been separated by spaces (eg: 0x12:i64).
  const publicInputs = useMemo(() => [`0x${sum.toString(16)}:i64`], [sum]);

  useEffect(() => {
    ZKCWasmServiceHelper.loadWasm(diceGameUrl).then(
      ({ exports: { init, setBoard, getResult } }) => {
        init();
        diceArr.forEach(setBoard);
        setSum(getResult);
      },
    );
  }, [diceArr]);

  // Connect Metamask
  const onConnect = () =>
    withZKCWeb3MetaMaskProvider(async provider => {
      const account = await provider.connect();
      setUserAddress(account);
    });

  // play Dice Game
  const onRollDone = values => {
    setDiceArr(() => [...values]);
    console.log('individual die values array:', values);
  };

  // submit ZK Proof
  const onSubmit = () =>
    withZKCWeb3MetaMaskProvider(async provider => {
      // Whether the wallet has been connected
      if (!userAddress) return alert('Please connect your wallet.');

      // check network
      try {
        await provider.switchNet();
      } catch (error) {
        console.dir(error);
        return alert(error.message);
      }

      const zkc = new ZKCWasmServiceHelper();

      const diceGameBlob = await (await fetch(diceGameUrl)).blob(),
        diceGameFile = new File([diceGameBlob], 'dice-game');

      const moonImage = await (await fetch(moonIcon)).blob(),
        moonFile = new File([moonImage], 'moon-icon');

      // create application
      const response = await zkc.createApplication({
        address: userAddress,
        name: 'dice-game-test1',
        description: 'Dice game test1',
        chainList: [5],
        signature: userAddress,
        data: [diceGameFile, moonFile],
      });

      const DICE_GAME_MD5 =
        response?.body?.md5 || '665272C6FD6E4148784BF1BD2905301F';

      // Signed information
      const info = {
        user_address: userAddress.toLowerCase(),
        md5: DICE_GAME_MD5,
        public_inputs: publicInputs,
        private_inputs: witness,
      };

      // JSON stringify
      const messageString = JSON.stringify(info);

      // Sign the message
      let signature;
      try {
        signature = await provider.sign(messageString);
      } catch (error) {
        console.error('error signing message', error);
        return alert('Unsigned Transaction');
      }

      // Submit task
      const res = await zkc.addProvingTask({
        ...info,
        signature,
      });

      console.log('addProvingTask response:', res);
      alert('AddProvingTask Success');
    });

  return (
    <main className="d-flex flex-column justify-content-evenly align-items-center">
      <div>
        <h1 className="text-center pb-2">Dice Game</h1>
        <p>
          You can click the <kbd>play now</kbd> button to generate an array of
          the dices and click the <kbd>Submit ZK Proof</kbd> button to submit ZK
          proof.
        </p>
      </div>
      <div className="d-flex flex-column justify-content-center align-items-center py-5">
        {userAddress ? (
          <address className="mb-3">userAddress: {userAddress}</address>
        ) : (
          <button className="mb-3 p-1 shadow-sm" onClick={onConnect}>
            Connect Wallet
          </button>
        )}

        <MyReactDice rollDone={onRollDone} />

        <ul>
          <li>
            The values of your dices are{' '}
            {diceArr.map((value, index, { length }) => (
              <span key={index}>
                <strong>{value}</strong>
                {index < length - 1 ? ', ' : ''}
              </span>
            ))}
            .
          </li>
          <li>
            The sum is <strong>{sum}</strong>.
          </li>
          <li>
            The image md5 is <code>{TUTORIAL_MD5}</code>.
          </li>
          <li>
            The public input is: <code>{publicInputs[0]}</code>.
          </li>
          <li>
            The private inputs(witness) are:{' '}
            {witness.map((value, index, { length }) => (
              <span key={value}>
                <code>{value}</code>
                {index < length - 1 ? ', ' : ''}
              </span>
            ))}
            .
          </li>
        </ul>

        <button className="mt-3 p-1 shadow-sm" onClick={onSubmit}>
          Submit ZK Proof
        </button>
      </div>
    </main>
  );
}

render(<Home />, document.querySelector('#app'));