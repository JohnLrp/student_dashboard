import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/apiClient";
import "../styles/quiz.css";

export default function QuizStart() {
  const navigate = useNavigate();
  const { quizId } = useParams();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const res = await api.get(`/quizzes/${quizId}/`);
        setQuiz(res.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Unable to load quiz.");
      } finally {
        setLoading(false);
      }
    }

    if (quizId) fetchQuiz();
  }, [quizId]);

  const handleStart = async () => {
    try {
      await api.post(`/quizzes/${quizId}/start/`);
      navigate(`/subjects/quiz/${quizId}/take`);
    } catch (err) {
      setError(err.response?.data?.detail || "Cannot start quiz.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!quiz) return null;

  return (
    <div className="quizStartPage">
      <div className="quizStartBox">
        <h2>{quiz.subject_name}</h2>
        <h3>{quiz.title}</h3>
        <p>Teacher: {quiz.teacher_name}</p>
        <p>Due Date: {new Date(quiz.due_date).toLocaleString()}</p>
        <p>Questions: {quiz.questions.length}</p>

        <button onClick={handleStart}>
          Start Quiz
        </button>
      </div>
    </div>
  );
}