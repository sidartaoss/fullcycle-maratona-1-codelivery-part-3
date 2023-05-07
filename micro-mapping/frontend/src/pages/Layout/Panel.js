const Panel = (props) => {
  return (
    <ul>
      {props.points.map((point) => (
        <li key={point.y}>.</li>
      ))}
    </ul>
  );
};

export default Panel;
