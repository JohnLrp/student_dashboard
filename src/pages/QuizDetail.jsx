import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/apiClient";
import "../styles/quiz.css";

export default function QuizDetail() {
  const navigate = useNavigate();
  const { quizId } = useParams();

  const [quizData, setQuizData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const res = await api.get(`/quizzes/${quizId}/`);
        setQuizData(res.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Unable to load quiz.");
      } finally {
        setLoading(false);
      }
    }

    fetchQuiz();
  }, [quizId]);

  const handleAnswerChange = (question_id, choice_id) => {
    setAnswers(prev => ({
      ...prev,
      [question_id]: choice_id
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const formattedAnswers = Object.entries(answers).map(
        ([question_id, choice_id]) => ({
          question: question_id,
          selected_choice: choice_id,
        })
      );

      await api.post(`/quizzes/${quizId}/submit/`, {
        answers: formattedAnswers,
      });

      navigate(`/subjects/quiz/result/${quizId}`);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to submit quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading quiz...</div>;
  if (error) return <div>{error}</div>;
  if (!quizData) return null;

  const allAnswered =
    quizData.questions?.every(
      (q) => answers[q.id] !== undefined
    ) ?? false;

  return (
    <div className="quizDetailPage">
      <h2>{quizData.title}</h2>

      {quizData.questions.map((q, index) => (
        <div key={q.id}>
          <p>{index + 1}. {q.text}</p>

          {q.choices.map(choice => (
            <label key={choice.id}>
              <input
                type="radio"
                name={`question-${q.id}`}
                checked={answers[q.id] === choice.id}
                onChange={() =>
                  handleAnswerChange(q.id, choice.id)
                }
              />
              {choice.text}
            </label>
          ))}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        disabled={!allAnswered || submitting}
      >
        {submitting ? "Submitting..." : "Submit"}
      </button>
    </div>
  );
}