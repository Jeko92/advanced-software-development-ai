type Props = {
  item: string;
  from: string;
  to: string;
};

export const DeliveryCardWithProps = ({ item, from, to }: Props) => {
  return (
    <article>
      <h3>{item}</h3>
      <p>
        {from} to {to}
      </p>
    </article>
  );
};
