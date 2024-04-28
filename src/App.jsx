import React, { useState } from "react";
import axios from "axios";
import UTSLogo from './src/UTS_assistant_Logo.png';

const App=()=>
 {
  const [response, setResponse] = useState("Hi, welcome to UTS Assistant. How can I assist you?");
  const [value, setValue] = useState("");

  const onChange = (e) => setValue(e.target.value);

  const handleSubmit = async () => {
    const response = await axios.post("http://localhost:3005/chatbot", {
      question: value,
    });
    setResponse(response.data);
  };

  return(
    <>
    <div className="top" >
    <img src={UTSLogo} width="100" alt="UTS_assistant_Logo.png"/>
    </div>

    <div className="background">
        <p>Assistant:{response}</p>
    </div>

    <div className="text_box" placeholder="Please type something....." type="text" value={value} onChange={onChange} ><input/>
    <div id="submit" onClick={handleSubmit}>➢</div>
    </div>

    </>
  )
}

export default App
