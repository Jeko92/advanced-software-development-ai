import styles from './page.module.css';
import { getAllDeliveries } from '@/lib/services/deliveryService';

const Home = async () => {
  const deliveries = await getAllDeliveries();
  const [firstDelivery] = deliveries;

  return (
    <div className={styles['page']}>
      <main className={styles['main']}>
        <h1>Kiki's Delivery Service</h1>
        <ul>
          {firstDelivery && (
            <li key={firstDelivery.id}>
              {firstDelivery.pickup} to {firstDelivery.destination}
            </li>
          )}
        </ul>
      </main>
    </div>
  );
};

export default Home;
