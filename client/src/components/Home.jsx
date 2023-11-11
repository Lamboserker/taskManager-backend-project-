import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/home.css";

const Home = () => {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserNameAndTasks = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        // Benutzerinformationen abrufen
        const userResponse = await axios.get(
          "http://localhost:3001/api/users/me",
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        setUsername(userResponse.data.name);

        // Tasks abrufen
        const tasksResponse = await axios.get(
          "http://localhost:3001/api/tasks",
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        setTasks(tasksResponse.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchUserNameAndTasks();
  }, [navigate]);

  const fetchUserName = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.get("http://localhost:3001/api/users/me", {
          headers: {
            "x-auth-token": token,
          },
        });
        setUsername(response.data.name); // Stellen Sie sicher, dass die API die Eigenschaft `name` im Antwortobjekt enthält
      } catch (error) {
        console.error("Error fetching the user name", error);
      }
    }
  };

  useEffect(() => {
    fetchUserName();
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("token");
    navigate("/register");
  };

  const handleTaskChange = (event) => {
    setTask(event.target.value);
  };

  const submitTask = async () => {
    if (task.trim() === "") return; // Verhindern, dass leere Tasks gesendet werden.
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3001/api/tasks",
        { task },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      setTasks([...tasks, response.data]);
      setTask("");
    } catch (error) {
      console.error("There was an error sending the task", error);
    }
  };
  const markAsSolved = async (taskId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:3001/api/tasks/${taskId}`,
        { solved: true },
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
      // Aktualisieren Sie den tasks state hier, um die Änderung widerzuspiegeln
      setTasks(
        tasks.map((task) => {
          if (task._id === taskId) {
            return { ...task, solved: true };
          }
          return task;
        })
      );
    } catch (error) {
      console.error("Error when updating the task", error);
    }
  };

  return (
    <>
      <div className="body">
        <button className="logout" onClick={handleLogOut}>
          Loggout
        </button>
        <section className="retro-window">
          <div className="title-bar">
            <div className="buttons">
              <div className="button close"></div>
              <div className="button minimize"></div>
              <div className="button maximize"></div>
            </div>
            <span className="title">DashBoard - {username}</span>
          </div>
          <div className="chat-container scrollbar">
            {/* Using an unordered list to contain messages */}
            <ul className="rounded-messages">
              {tasks.map((task, index) => (
                <li
                  key={index}
                  className={`message ${
                    task.solved ? "right-msg" : "left-msg"
                  }`}
                >
                  {task.task}
                  <span className="created-by">
                    created by: {task.authorOfTask}
                  </span>
                  <span
                    className={`check-icon ${task.solved ? "solved" : ""}`}
                    onClick={() => markAsSolved(task._id)}
                  >
                    ✔
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="input-container">
            <input
              className="input1"
              type="text"
              value={task}
              onChange={handleTaskChange}
              placeholder="Type a message..."
            />
            <button className="button1" onClick={submitTask}>
              <span className="send-text">Send</span>
              <span className="send-icon">📩</span>
            </button>
          </div>
        </section>
      </div>
    </>
  );
};
export default Home;
