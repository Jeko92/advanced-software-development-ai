import './App.css';
import { HelloWorld } from './components/HelloWorld.tsx';
import { DeliveryCard } from './components/DeliveryCard.tsx';
import { DeliveryList } from './components/DeliveryList.tsx';
import { DeliveryCardWithProps } from './components/DeliveryCardWithProps.tsx';
import { Greeting } from './components/Greeting.tsx';
import { DeliveryCardUseState } from './components/DeliveryCardUseState.tsx';
import { Counter } from './components/Counter.tsx';
import { DeliveryCardWithMixedProps } from './components/DeliveryCardWithMixedProps.tsx';
import { SetNameOnInputChange } from './components/SetNameOnInputChange.tsx';
import { StateUplifting } from './components/StateUplifting.tsx';

function App() {
  const students = ['Max', 'Julia', 'John', 'Jane'];

  return (
    <>
      <div>
        <HelloWorld />
      </div>
      <div>
        <h2>Delivery Cards</h2>
        <DeliveryCard />
        <DeliveryCard />
      </div>
      <div>
        <h2>Delivery List</h2>
        <DeliveryList />
      </div>
      <div>
        <h2>Delivery Card with props</h2>
        <DeliveryCardWithProps item="Bread" from="Bakery" to="Clock tower" />
      </div>
      <div>
        <h2>Delivery Card with mixed prop types</h2>
        <DeliveryCardWithMixedProps item="Bread" distance={3} urgent={true} />
      </div>
      <div>
        <h2>Greeting example</h2>
        {students.map((student, index) => (
          <Greeting key={index} name={student} />
        ))}
      </div>
      <div>
        <h2>Delivery Card with useState</h2>
        <DeliveryCardUseState item="Bread" />
      </div>
      <div>
        <h2>State isolation example</h2>
        <p>Marking one as delivered does not affect the other.</p>
        <DeliveryCardUseState item="Bread" />
        <DeliveryCardUseState item="Herring pie" />
      </div>
      <div>
        <h2>UseState Example</h2>
        <Counter />
      </div>
      <div>
        <h2>UseState setting name on inout change</h2>
        <SetNameOnInputChange />
      </div>
      <div>
        <h2>State Uplifting (Callback functions)</h2>
        <StateUplifting />
      </div>
    </>
  );
}

export default App;
