const Progress = ({ index, numQuestions, points, maximumPossiblePoints }) => {
  return (
    <header className="progress">
      <progress max={numQuestions} value={index} />

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
