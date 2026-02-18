import { useState, useEffect } from "react";

const API_BASE = "http://localhost:8000/api";

export default function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("");
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTickets = async () => {
    const res = await fetch(`${API_BASE}/tickets/`);
    const data = await res.json();
    setTickets(data);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // Auto-classify when description changes
  useEffect(() => {
    if (!description) return;

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/tickets/classify/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description }),
        });

        const data = await res.json();

        if (data.suggested_category) setCategory(data.suggested_category);
        if (data.suggested_priority) setPriority(data.suggested_priority);
      } catch (err) {
        console.error("Classification error", err);
      }
      setLoading(false);
    }, 800); // debounce

    return () => clearTimeout(timeout);
  }, [description]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch(`${API_BASE}/tickets/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        category,
        priority,
        status: "open",
      }),
    });

    setTitle("");
    setDescription("");
    setCategory("");
    setPriority("");

    fetchTickets();
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial" }}>
      <h1>Support Ticket System</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ display: "block", marginBottom: "1rem", width: "300px" }}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows="4"
          style={{ display: "block", marginBottom: "1rem", width: "300px" }}
        />

        {loading && <p>Classifying...</p>}

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ display: "block", marginBottom: "1rem" }}
        >
          <option value="">Select Category</option>
          <option value="billing">Billing</option>
          <option value="technical">Technical</option>
          <option value="account">Account</option>
          <option value="general">General</option>
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={{ display: "block", marginBottom: "1rem" }}
        >
          <option value="">Select Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>

        <button type="submit">Submit Ticket</button>
      </form>

      <h2>Tickets</h2>
      <ul>
        {tickets.map((ticket) => (
          <li key={ticket.id}>
            <strong>{ticket.title}</strong> — {ticket.category} / {ticket.priority}
          </li>
        ))}
      </ul>
    </div>
  );
}
