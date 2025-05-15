import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import chatCSS from "./chat.module.css";
import Header from "../Header/Header";
import { api } from "../../api/api";

function Chat() {
  const navigate = useNavigate();
  const [showSecondPage, setShowSecondPage] = useState(false);
  const {
    isAuthenticated,
    isLoading,
    questionsAsked,
    incrementQuestionsAsked,
    // canAskQuestion,
  } = useAuth();
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Hello! I'm your FOA Chat AI assistant. How can I help you today?",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef(null);
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [showConversations, setShowConversations] = useState(false);
  const [conversationTitle, setConversationTitle] = useState("");
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Load conversations for authenticated users
  useEffect(() => {
    const loadConversations = async () => {
      if (isAuthenticated && !isLoading) {
        setIsLoadingConversations(true);
        try {
          const result = await api.getConversations();
          setConversations(result.conversations || []);
        } catch (error) {
          console.error("Error loading conversations:", error);
        } finally {
          setIsLoadingConversations(false);
        }
      }
    };

    loadConversations();
  }, [isAuthenticated, isLoading]);

  // Load conversation messages when a conversation is selected
  useEffect(() => {
    const loadConversationMessages = async () => {
      if (currentConversationId) {
        setIsProcessing(true);
        try {
          const result = await api.getConversationMessages(
            currentConversationId
          );
          setMessages(
            result.messages.map((msg) => ({
              sender: msg.sender,
              text: msg.text,
            }))
          );

          // Find the conversation to get its title
          const conversation = conversations.find(
            (conversation) => conversation.id === currentConversationId
          );
          if (conversation) {
            setConversationTitle(conversation.title);
          }

          setShowSecondPage(true);
        } catch (error) {
          console.error("Error loading conversation messages:", error);
        } finally {
          setIsProcessing(false);
        }
      }
    };

    if (currentConversationId) {
      loadConversationMessages();
    }
  }, [currentConversationId, conversations]);

  const createNewConversation = async () => {
    if (!isAuthenticated) {
      // For non-authenticated users, just reset the chat
      setMessages([
        {
          sender: "bot",
          text: "Hello! I'm your FOA Chat AI assistant. How can I help you today?",
        },
      ]);
      setCurrentConversationId(null);
      setConversationTitle("");
      return;
    }

    try {
      const result = await api.createConversation();
      const newConversation = {
        id: result.id,
        title: result.title,
        created_at: result.created_at,
        updated_at: result.updated_at,
      };

      setConversations((prev) => [newConversation, ...prev]);
      setCurrentConversationId(newConversation.id);
      setConversationTitle(newConversation.title);
      setMessages([
        {
          sender: "bot",
          text: "Hello! I'm your FOA Chat AI assistant. How can I help you today?",
        },
      ]);
      setShowSecondPage(true);
    } catch (error) {
      console.error("Error creating new conversation:", error);
    }
  };

  const handleConversationSelect = (conversationId) => {
    setCurrentConversationId(conversationId);
    setShowConversations(false);
  };

  const handleDeleteConversation = async (e, conversationId) => {
    e.stopPropagation();

    try {
      await api.deleteConversation(conversationId);
      setConversations((prev) =>
        prev.filter((conversation) => conversation.id !== conversationId)
      );

      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
        createNewConversation();
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const handleUpdateTitle = async () => {
    if (!currentConversationId || !conversationTitle.trim()) return;

    try {
      await api.updateConversation(currentConversationId, conversationTitle);

      // Update the title in the local state
      setConversations((prev) =>
        prev.map((c) =>
          c.id === currentConversationId
            ? {
                ...c,
                title: conversationTitle,
                updated_at: new Date().toISOString(),
              }
            : c
        )
      );
    } catch (error) {
      console.error("Error updating conversation title:", error);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || isProcessing) return;

    const userMessage = inputText.trim();
    setInputText("");
    setIsProcessing(true);

    // If this is the first message and user is authenticated, create a new conversation
    if (isAuthenticated && !currentConversationId) {
      try {
        // Create a new conversation with the user's first message as the title
        const result = await api.createConversation(
          userMessage.substring(0, 50) + (userMessage.length > 50 ? "..." : "")
        );
        setCurrentConversationId(result.id);
        setConversationTitle(result.title);

        // Add to conversations list
        const newConversation = {
          id: result.id,
          title: result.title,
          created_at: result.created_at,
          updated_at: result.updated_at,
        };
        setConversations((prev) => [newConversation, ...prev]);
      } catch (error) {
        console.error("Error creating conversation:", error);
        setIsProcessing(false);
        return;
      }
    }

    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);

    try {
      const result = await api.getChatResponse(
        userMessage,
        currentConversationId
      );
      if (!isAuthenticated) {
        incrementQuestionsAsked();
      }
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: result.response },
      ]);

      if (!isAuthenticated && questionsAsked === 2) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: (
              <div className="alert alert-warning border border-warning rounded-3 p-3">
                <p className="mb-0 text-dark">
                  ⚠️ You've reached your question limit. To continue chatting
                  without restrictions, please{" "}
                  <button
                    onClick={() => navigate("/login")}
                    className="btn btn-link p-0 text-primary"
                  >
                    log in
                  </button>{" "}
                  or{" "}
                  <button
                    onClick={() => navigate("/signup")}
                    className="btn btn-link p-0 text-primary"
                  >
                    create an account
                  </button>
                  .
                </p>
              </div>
            ),
          },
        ]);
      }

      // Update conversation list with the latest timestamp
      if (currentConversationId) {
        setConversations((prev) =>
          prev.map((c) =>
            c.id === currentConversationId
              ? { ...c, updated_at: new Date().toISOString() }
              : c
          )
        );
      }
    } catch (error) {
      console.error("Error getting response:", error);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, I can't process your request .",
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleKeyDownTitle = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleUpdateTitle();
    }
  };

  if (isLoading) {
    return (
      <div className="vh-100 d-flex align-items-center justify-content-center bg-dark text-white">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="d-flex flex-column">
        <Header />
        <div className="container-fluid">
          <div className="d-flex flex-column flex-grow-1">
            <div className="row flex-grow-1">
              {/* Sidebar */}
              <aside
                className={`${chatCSS.sideBar} col-3 col-md-3 col-lg-2 text-white p-3 rounded rounded-3 `}
              >
                <div className="d-flex justify-content-between align-items-center mb-3">
                  {isAuthenticated ? (
                    <>
                      <h4
                        className="h6 mb-0"
                        style={{ color: "var(--sidebar-text)" }}
                      >
                        New Chat
                      </h4>
                      <button
                        className={`${chatCSS.chatPlus}`}
                        style={{
                          color: "var(--sidebar-text)",
                          borderColor: "var(--sidebar-text)",
                        }}
                        onClick={createNewConversation}
                        title="New Conversation"
                      >
                        <i className="fa-solid fa-plus"></i>
                      </button>
                    </>
                  ) : (
                    <>
                      <div>
                        <h4
                          className="h6 mb-5"
                          style={{ color: "var(--sidebar-text)" }}
                        >
                          Tanta University
                        </h4>
                        <p className={`${chatCSS.guest}`}>
                          <button
                            onClick={() => navigate("/signup")}
                            className={`${chatCSS.guest} border-0 bg-transparent text-decoration-underline me-1`}
                          >
                            sign up
                          </button>{" "}
                          or{" "}
                          <button
                            onClick={() => navigate("/login")}
                            className={`${chatCSS.guest} border-0 bg-transparent text-decoration-underline p-1 me-1`}
                          >
                            log in
                          </button>{" "}
                          to show chats.
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {isAuthenticated && (
                  <div
                    className={` ${chatCSS.scrollbar} "mt-3"`}
                    style={{
                      overflowY: "auto",
                      height: "calc(100vh - 100px - 80px)",
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5
                        className="h6 mb-0"
                        style={{ color: "var(--sidebar-text)" }}
                      >
                        Conversations
                      </h5>
                      <button
                        className="btn btn-sm btn-link text-white p-2"
                        onClick={() => setShowConversations(!showConversations)}
                      >
                        <i
                          className={`fa-solid fa-chevron-${
                            showConversations ? "up" : "down"
                          }`}
                          style={{ color: "var(--sidebar-text)" }}
                        ></i>
                      </button>
                    </div>

                    {showConversations && (
                      <div className="conversation-list mt-2">
                        {isLoadingConversations ? (
                          <div className="text-center py-2">
                            <div
                              className="spinner-border spinner-border-sm text-light"
                              role="status"
                            ></div>
                          </div>
                        ) : conversations.length > 0 ? (
                          conversations.map((conversation) => (
                            <div
                              key={conversation.id}
                              className={`p-2 rounded mb-1 d-flex justify-content-between align-items-center  ${
                                chatCSS.hoverEffect
                              } ${
                                currentConversationId === conversation.id
                                  ? chatCSS.selected
                                  : ""
                              }`}
                              onClick={() =>
                                handleConversationSelect(conversation.id)
                              }
                            >
                              <div className={`${chatCSS.sidebarText}`}>
                                {conversation.title}
                              </div>
                              <button
                                className="btn btn-sm text-danger"
                                onClick={(e) =>
                                  handleDeleteConversation(e, conversation.id)
                                }
                                title="Delete conversation"
                              >
                                <i className="fa-solid fa-trash-can"></i>
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-light py-2">
                            No conversations yet
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </aside>

              <div className="col-9 col-md-9 col-lg-10 px-3">
                <div className="h-100 flex-grow-1 d-flex flex-column align-items-center justify-content-center">
                  {!showSecondPage ? (
                    <>
                      <main
                        className="d-flex flex-column w-100"
                        style={{
                          overflowY: "auto",
                          height: "calc(100vh - 100px - 76px)",
                        }}
                      >
                        <div className="flex-grow-1 overflow-auto p-4 d-flex flex-column align-items-center justify-content-center">
                          <div className="overflow-auto p-3 text-center">
                            <h2 className={`h2 ${chatCSS.contentTitle}`}>
                              How can we <span>assist</span> you today?
                            </h2>
                            <p
                              className={`w-75 lh-base mt-3 ${chatCSS.contentDesc}`}
                            >
                              "Hello and welcome! 📚 Got a question about your
                              college life? Let’s figure it out together, go
                              ahead and ask me anything — <br /> Your AI
                              Companion Can Help With:
                            </p>
                            <div className="row w-100 mt-4 px-1 justify-content-center">
                              <div className="col-md-6 col-lg-3 mb-3 ">
                                <div className="card h-100 text-muted text-center rounded-4 p-3">
                                  <h5>24/7 AI Support</h5>
                                  <p>
                                    Get instant answers to your questions
                                    anytime, anywhere.
                                  </p>
                                </div>
                              </div>
                              <div className="col-md-6 col-lg-3 mb-3">
                                <div className="card h-100 text-muted text-center rounded-4 p-3">
                                  <h5>Study Resources</h5>
                                  <p>
                                    Access a vast library of study materials and
                                    guides.
                                  </p>
                                </div>
                              </div>
                              <div className="col-md-6 col-lg-3 mb-3">
                                <div className="card h-100 text-muted text-center rounded-4 p-3">
                                  <h5>Student Assist</h5>
                                  <p>
                                    Access answers about university info,
                                    services, faculty, and more.
                                  </p>
                                </div>
                              </div>
                              <div className="col-md-6 col-lg-3 mb-3">
                                <div className="card h-100 text-muted text-center rounded-4 p-3">
                                  <h5>Community Support</h5>
                                  <p>
                                    Connect with peers and get help from the
                                    community.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </main>

                      <div className="input-group p-2 border border-secondary rounded-5 position-sticky bottom-0">
                        <input
                          className="form-control bg-transparent fs-5 border-0"
                          placeholder="Ask anything"
                          onClick={() => setShowSecondPage(true)}
                        />
                        <button className="btn btn-light rounded-circle">
                          <i className="fa-solid fa-arrow-right"></i>
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <main
                        className="d-flex flex-column text-start w-100"
                        style={{
                          overflowY: "auto",
                          height: "calc(100vh - 100px - 76px)",
                        }}
                      >
                        {isAuthenticated && currentConversationId && (
                          <div className="p-2 border-bottom border-secondary d-flex align-items-center">
                            <input
                              type="text"
                              value={conversationTitle}
                              onChange={(e) =>
                                setConversationTitle(e.target.value)
                              }
                              onKeyDown={handleKeyDownTitle}
                              onBlur={handleUpdateTitle}
                              className="form-control bg-transparent border-0"
                              placeholder="Conversation Title"
                            />
                          </div>
                        )}
                        <div className="flex-grow-1 overflow-auto p-3">
                          {messages.map((message, index) => (
                            <div
                              key={index}
                              className={`d-flex mb-3 ${
                                message.sender === "user"
                                  ? "justify-content-end"
                                  : "justify-content-start"
                              }`}
                            >
                              <div
                                className={`rounded p-2 ${
                                  message.sender === "user"
                                    ? "bg-secondary bg-opacity-75 text-white"
                                    : "bg-secondary bg-opacity-25 text-white"
                                }`}
                                style={{
                                  maxWidth: "75%",
                                  wordWrap: "break-word",
                                }}
                              >
                                {message.text}
                              </div>
                            </div>
                          ))}
                          {isProcessing && (
                            <div className="d-flex justify-content-start">
                              <div className="bg-secondary text-white rounded p-2 d-flex align-items-center">
                                <span className="spinner-border spinner-border-sm me-2"></span>
                                Thinking...
                              </div>
                            </div>
                          )}
                          <div ref={messagesEndRef}></div>
                        </div>
                      </main>

                      <div className="input-group p-2 border border-secondary rounded-5 position-sticky bottom-0">
                        <input
                          type="text"
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          onKeyDown={handleKeyDown}
                          className="form-control bg-transparent fs-5 border-0"
                          placeholder={
                            questionsAsked === 3
                              ? "Please login to continue chatting"
                              : "Ask anything"
                          }
                          disabled={isProcessing || questionsAsked === 3}
                        />
                        <button
                          className="btn btn-light rounded-circle"
                          onClick={handleSend}
                          disabled={isProcessing || questionsAsked === 3}
                        >
                          <i className="fa-solid fa-arrow-right"></i>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Chat;
