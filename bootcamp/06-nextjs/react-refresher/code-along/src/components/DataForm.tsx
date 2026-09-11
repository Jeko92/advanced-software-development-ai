type DataFormProps = {
  setName: (name: string) => void;
};

export const DataForm = (props: Readonly<DataFormProps>) => {
  return (
    <>
      <input
        onChange={(e) => {
          console.log(e.target.value);
          props.setName(e.target.value);
        }}
      />
    </>
  );
};
