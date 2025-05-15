const API_URL = "http://localhost:5000/api";

export const api = {
  signup: async (data) => {
    const response = await fetch(`${API_URL}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to sign up");
    }

    return response.json();
  },

  login: async (data) => {
    const sessionId = localStorage.getItem("sessionId");
    const headers = {
      "Content-Type": "application/json",
    };

    if (sessionId) {
      headers["Session-ID"] = sessionId;
    }

    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to log in");
    }

    const result = await response.json();
    localStorage.setItem("token", result.token);
    return result;
  },

  requestPasswordReset: async (data) => {
    const response = await fetch(`${API_URL}/request-reset`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to request password reset");
    }

    return response.json();
  },

  resetPassword: async (data) => {
    const response = await fetch(`${API_URL}/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to reset password");
    }

    return response.json();
  },

  changePassword: async (data) => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(`${API_URL}/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to change password");
    }

    return response.json();
  },

  getUserProfile: async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to get user profile");
    }

    return response.json();
  },

  // Updated to support conversation_id
  getChatResponse: async (question, conversation_id = null) => {
    try {
      const token = localStorage.getItem("token");
      const sessionId =
        localStorage.getItem("sessionId") || generateSessionId();

      // Store session ID if it's new
      if (!localStorage.getItem("sessionId")) {
        localStorage.setItem("sessionId", sessionId);
      }

      const headers = {
        "Content-Type": "application/json",
        "Session-ID": sessionId,
      };

      // Add authorization header if user is logged in
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${API_URL}/chat/response`, {
        method: "POST",
        headers,
        body: JSON.stringify({ question, conversation_id }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (response.status === 403) {
          throw new Error("Question limit reached. Please login to continue.");
        }
        throw new Error(error.error || "Failed to get chat response");
      }

      return response.json();
    } catch (error) {
      console.error("Error in getChatResponse:", error);
      throw error;
    }
  },

  // Added new conversation management methods
  getConversations: async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(`${API_URL}/conversations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to get conversations");
    }

    return response.json();
  },

  getConversationMessages: async (conversationId) => {
    const token = localStorage.getItem("token");
    const sessionId = localStorage.getItem("sessionId");

    const headers = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    if (sessionId) {
      headers["Session-ID"] = sessionId;
    }

    const response = await fetch(`${API_URL}/conversations/${conversationId}`, {
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to get conversation messages");
    }

    return response.json();
  },

  createConversation: async (title = "New Conversation") => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(`${API_URL}/conversations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create conversation");
    }

    return response.json();
  },

  deleteConversation: async (conversationId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(`${API_URL}/conversations/${conversationId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to delete conversation");
    }

    return response.json();
  },

  updateConversation: async (conversationId, title) => {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Not authenticated");
    }

    const response = await fetch(`${API_URL}/conversations/${conversationId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to update conversation");
    }

    return response.json();
  },
};

// Helper function to generate a unique session ID
function generateSessionId() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
