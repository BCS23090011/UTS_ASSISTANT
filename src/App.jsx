import React, { useState } from "react";
import axios from "axios";
import UTSLogo from "./UTS_assistant_Logo.png";
import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js"; // Import marked library

const App=()=>
 {
  const [response, setResponse] = useState("Hi, welcome to UTS Assistant. How can I assist you?");
  const [value, setValue] = useState("");

  const onChange = (e) => setValue(e.target.value);

  const handleSubmit = async () => {
    const response = await axios.post("https://uts-assistant.onrender.com/chatbot", {
      question: value,
    });
    setResponse(response.data);
  };

  return(
    <>
    <div className="top" >
    <img src={UTSLogo} width="100" alt="UTS Assistant Logo" />
    </div>

    <div className="background" style={{overflowY: "auto" }}>
      <div className="user_question">
        <p>User:</p>
        <p>{value}</p>
      </div>
      <div className="respond">
        <p>Assistant:</p>
          <div dangerouslySetInnerHTML={{ __html: marked(response) }} />
      </div>
    </div>

    <div className="text_box" placeholder="Please type something....." type="text" value={value} onChange={onChange} ><input/>
    <div id="submit" onClick={handleSubmit}>➢</div>
    </div>
    </>
  )
}

export default App
