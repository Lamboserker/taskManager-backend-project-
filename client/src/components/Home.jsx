import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
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

  function isDarkColor(color) {
    // Convert hex color to RGB
    const hexToRgb = (hex) => {
      let r = 0,
          g = 0,
          b = 0;
      // 3 digits
      if (hex.length === 4) {
        r = parseInt(hex[1] + hex[1], 16);
        g = parseInt(hex[2] + hex[2], 16);
        b = parseInt(hex[3] + hex[3], 16);
        // 6 digits
      } else if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
      }
      return { r, g, b };
    };

    // Calculate luminance
    const luminance = (r, g, b) => {
      const a = [r, g, b].map((v) => {
        v /= 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };

    const { r, g, b } = hexToRgb(color);
    // A threshold of 0.5 is usually a good approximation
    return luminance(r, g, b) < 0.5;
  }

  return (
    <>
      <div className="body">
        <button className="btn-11" onClick={handleLogOut}>
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
            <ul className="rounded-messages">
              {tasks.map((task, index) => (
                <li
                  key={index}
                  className={`message ${
                    task.solved ? "right-msg solved-task" : "left-msg"
                  }`}
                  style={{
                    backgroundColor: task.solved
                      ? "#008000"
                      : task.color || "#fff", // Green color for solved tasks
                    color: task.solved
                      ? "white"
                      : isDarkColor(task.color)
                      ? "white"
                      : "black", // White text for solved tasks
                  }}
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
            {task && (
              <button className="button1 send-icon" onClick={submitTask}>
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            )}
          </div>
        </section>
      </div>
    </>
  );
};
export default Home;
