import { act, useEffect, useReducer } from "react";
import axios from "axios";

import Header from "./components/Header";
import Main from "./components/JonasApp";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";

const initialStates = {
  questions: [],
  // loading, error, active, ready, finished
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "start":
      return { ...state, status: "active" };
    case "newAnswer": {
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload == question.correctOption
            ? state.points + question.points
            : state.points,
      };
    }
    case "nextQuestion":
      return { ...state, index: state.index + 1, answer: null };
    default:
      throw new Error("unknown action");
  }
}

const App = () => {
  const [{ questions, status, index, answer, points }, dispatch] = useReducer(
    reducer,
    initialStates
  );
  const numQuestions = questions.length;
  const maximumPossiblePoints = questions.reduce((acc, cur) => {
    return acc + cur.points;
  }, 0);

  useEffect(() => {
    const fetchQuestions = async () => {
      await axios
        .get("http://localhost:8000/questions")
        .then((response) =>
          dispatch({ type: "dataReceived", payload: response.data })
        )
        .catch((err) => dispatch({ type: "dataFailed" }));
    };
    fetchQuestions();
  }, []);

  return (
    <div className="app">
      <Header />

      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              points={points}
              maximumPossiblePoints={maximumPossiblePoints}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <NextButton dispatch={dispatch} answer={answer} />
          </>
        )}
      </Main>
    </div>
  );
};

export default App;
