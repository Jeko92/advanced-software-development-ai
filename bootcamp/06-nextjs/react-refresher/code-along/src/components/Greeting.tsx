type GreetingProps = {
  name: string;
  // age: number;
  // id: string;
  // sayHello: () => void;
};

export const Greeting = (props: Readonly<GreetingProps>) => {
  return (
    <>
      <h2>Hello {props.name}</h2>
    </>
  );
};
