import { useState } from 'react';

type Props = {
  item: string;
};

export const DeliveryCardUseState = ({ item }: Props) => {
  const [delivered, setDelivered] = useState(false);

  return (
    <article>
      <h3>{item}</h3>
      <p>{delivered ? 'Delivered' : 'On the way'}</p>
      <button onClick={() => setDelivered(true)}>Mark as delivered</button>
    </article>
  );
};
