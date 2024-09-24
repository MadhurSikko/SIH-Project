import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GiAstronautHelmet } from "react-icons/gi";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import MessageInput from "./MessageInput";
import ServerChatBox from "./ServerChatBox";
import UserChatBox from "./UserChatBox";

export default function Defaultpage({
  isChatBoxOpen,
  toggleChatBox,
  closeChatBox,
}) {
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1000);
  const [messages, setMessages] = useState([
    {
      type: "ai",
      text: "Hello! What can I do for you today? You can ask me to 'Book a Ticket' or 'Inquire about the Museum Timings'.",
    },
  ]);

  const [defaultOptions] = useState([
    { label: "Tell me about museum", value: "museum" },
    { label: "Book Tickets", value: "book" },
    { label: "Inquire About Timings", value: "timings" },
  ]);

  const sendMessageToServer = async (message) => {
    setMessages([...messages, { type: "user", text: message }]);

    try {
      const response = await fetch("http://localhost:3000/user/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: "ai", text: data.response },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // default options for booking and timings
  const handleOptionClick = (option) => {
    if (option.value === "book") {
      sendMessageToServer("I want to book a ticket");
    } else if (option.value === "timings") {
      sendMessageToServer("What are the museum timings?");
    } else {
      sendMessageToServer("Tell me about the museum");
    }
  };

  // Handle resizing to toggle mobile view state
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1000);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="relative flex w-[35%] h-screen font-sm sm:font-md">
      {/* Chat Box */}
      <div
        className={`fixed right-0 top-0 h-full border-2 border-gray-500 p-4 sm:p-6 transition-transform duration-300 ${
          isChatBoxOpen ? "translate-x-0" : "translate-x-full"
        } ${isMobileView ? "w-full" : "w-[35%]"}`}
        style={{ marginTop: "4rem" }}
      >
        {/* Chat Bot Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg ml-5 font-semibold mt-3">Chat Bot</h2>
          {isChatBoxOpen && isMobileView && (
            <button
              className="text-gray-600 hover:text-gray-800 focus:outline-none"
              onClick={closeChatBox}
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
          )}
        </div>

        {/* Output Section */}
        <div className="flex-1 sm:mb-5 overflow-auto h-[52vh] sm:h-[65vh] w-11/12 border border-gray-300 rounded-lg p-4 mx-auto">
          <div className="messages">
            {messages.map((msg, index) =>
              msg.type === "user" ? (
                <UserChatBox key={index} message={msg.text} />
              ) : (
                <ServerChatBox key={index} message={msg.text} />
              )
            )}
          </div>
        </div>

        {/* Default clickable options */}
        <div className="space-x-4 p-4 flex flex-1">
          {defaultOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              className="bg-black text-white border hover:border-black transition-all ease-in p-2 rounded-lg hover:bg-white hover:text-black"
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Input Section */}
        <MessageInput onSendMessage={sendMessageToServer} />
      </div>

      {/* Chat Box Toggle Icon (Visible on small screens) */}
      {!isChatBoxOpen && isMobileView && (
        <button
          className="fixed bottom-4 right-4 border-2 border-gray-400 bg-white  text-black p-4 rounded-full shadow-xl hover:scale-110 hover:shadow-2xl transition-all duration-300 focus:outline-none sm:hidden md:block"
          onClick={toggleChatBox}
        >
          <GiAstronautHelmet size={"1.8rem"} />
        </button>
      )}
    </div>
  );
}
