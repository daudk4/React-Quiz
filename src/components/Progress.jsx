const Progress = ({
  index,
  numQuestions,
  points,
  maximumPossiblePoints,
  answer,
}) => {
  return (
    <header className="progress">
      <progress max={numQuestions} value={index + Number(answer !== null)} />

      <p>
        Questions <strong>{index + 1}</strong>/{numQuestions}
      </p>
      <p>
        <strong>{points}</strong>/{maximumPossiblePoints}
      </p>
    </header>
  );
};

export default Progress;
