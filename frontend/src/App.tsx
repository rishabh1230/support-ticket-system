import { useEffect, useState } from "react";

interface Ticket {
  id?: number;
  title: string;
  description: string;
  category?: string;
  priority?: string;
  status?: string;
}

function App() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  // Load existing tickets
  useEffect(() => {
    fetch("http://localhost:8000/api/tickets/")
      .then(res => res.json())
      .then(data => setTickets(data))
      .catch(err => console.error("Fetch error:", err));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAiResult(null);

    try {
      // 1️⃣ Call AI classification
      const classifyRes = await fetch(
        "http://localhost:8000/api/tickets/classify/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description }),
        }
      );

      const classification = await classifyRes.json();
      console.log("AI RESPONSE:", classification);

      const safeCategory =
        classification?.suggested_category || "general";

      const safePriority =
        classification?.suggested_priority || "low";

      const safeStatus = "open";

      setAiResult({
        suggested_category: safeCategory,
        suggested_priority: safePriority,
      });

      // 2️⃣ Create ticket with ALL required fields
      const ticketRes = await fetch(
        "http://localhost:8000/api/tickets/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            category: safeCategory,
            priority: safePriority,
            status: safeStatus,
          }),
        }
      );

      if (!ticketRes.ok) {
        const errorData = await ticketRes.json();
        console.error("Validation error:", errorData);
        alert("Ticket creation failed. Check console.");
        setLoading(false);
        return;
      }

      const newTicket = await ticketRes.json();
      setTickets(prev => [...prev, newTicket]);

      setTitle("");
      setDescription("");

    } catch (err) {
      console.error("Submit error:", err);
      alert("Something went wrong.");
    }

    setLoading(false);
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-600";
      case "high":
        return "bg-orange-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-600";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "open":
        return "bg-blue-600";
      case "closed":
        return "bg-gray-700";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold text-blue-600 mb-8">
          🎫 AI Support Ticket System
        </h1>

        {/* FORM */}
        <div className="bg-white shadow-xl rounded-2xl p-6 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="text"
              placeholder="Ticket Title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />

            <textarea
              placeholder="Describe the issue..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={4}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Submit Ticket"}
            </button>

          </form>
        </div>

        {/* AI RESULT */}
        {aiResult && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-8">
            <h2 className="font-semibold text-blue-700 mb-2">
              🤖 AI Classification Result
            </h2>
            <div className="flex gap-4">
              <span className="px-3 py-1 bg-gray-200 rounded-full text-sm capitalize">
                Category: {aiResult.suggested_category}
              </span>
              <span className="px-3 py-1 bg-gray-200 rounded-full text-sm capitalize">
                Priority: {aiResult.suggested_priority}
              </span>
            </div>
          </div>
        )}

        {/* TICKETS */}
        <div className="grid gap-6">
          {tickets.map((ticket, index) => (
            <div
              key={ticket.id || index}
              className="bg-white shadow-md rounded-xl p-5 border"
            >
              <h2 className="text-xl font-semibold mb-2">
                {ticket.title}
              </h2>

              <p className="text-gray-600 mb-4">
                {ticket.description}
              </p>

              <div className="flex gap-3 flex-wrap">
                <span className="px-3 py-1 bg-gray-200 rounded-full text-sm capitalize">
                  {ticket.category}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-white text-sm capitalize ${getPriorityColor(ticket.priority)}`}
                >
                  {ticket.priority}
                </span>

                <span
                  className={`px-3 py-1 rounded-full text-white text-sm capitalize ${getStatusColor(ticket.status)}`}
                >
                  {ticket.status}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;
