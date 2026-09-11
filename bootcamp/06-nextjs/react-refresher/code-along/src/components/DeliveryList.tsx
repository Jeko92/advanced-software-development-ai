const deliveries = [
  { id: 1, item: 'Bread' },
  { id: 2, item: 'Harring pie' },
];

export const DeliveryList = () => {
  return (
    <ul>
      {deliveries.map((delivery) => (
        <li key={delivery.id}>{delivery.item}</li>
      ))}
    </ul>
  );
};
