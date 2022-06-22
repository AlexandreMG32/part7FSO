const Input = (props) => {
  const { reset, ...propsPassed } = props;

  return (
      <input {...propsPassed} />
  );
};

export default Input;
