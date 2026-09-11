type DeliveryCardWithMixedProps = {
  item: string;
  distance: number;
  urgent: boolean;
};

export const DeliveryCardWithMixedProps = ({
  item,
  distance,
  urgent,
}: DeliveryCardWithMixedProps) => {
  return (
    <article>
      <h3>{item}</h3>
      <p>{distance} km away</p>
      <p>Priority: {urgent ? 'Urgent' : 'Standard'}</p>
    </article>
  );
};
