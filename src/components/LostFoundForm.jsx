"use client";

import { useState } from "react";
import { createLostItem } from "../lib/api";

const LostFoundForm = ({ user, onCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return setError("Sign in failed. Try again.");
    setLoading(true);
    setError("");
    try {
      let imageUrl = null;
      if (file) {
        const toBase64 = (f) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result.split(",")[1]);
            reader.onerror = reject;
            reader.readAsDataURL(f);
          });
        const b64 = await toBase64(file);
        imageUrl = `data:${file.type || "image/jpeg"};base64,${b64}`;
      }
      await createLostItem({
        user_id: user.uid,
        user_email: user.email,
        username: user.username || "",
        title,
        description,
        location,
        contact,
        image_url: imageUrl,
      });
      setTitle("");
      setDescription("");
      setLocation("");
      setContact("");
      setFile(null);
      onCreated?.();
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not create entry");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" id="lostfound">
      <div className="card__header">
        <h3>Report a found item</h3>
        <p className="muted">Help return valuables and earn trust.</p>
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Found wallet near library"
            required
          />
        </label>
        <label>
          Description
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Black leather wallet with student ID"
            required
          />
        </label>
        <label>
          Location
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Front desk, science building"
            required
          />
        </label>
        <label>
          Contact
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Email or phone"
            required
          />
        </label>
        <label className="file-input">
          <span>{file ? file.name : "Attach optional photo"}</span>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn secondary" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default LostFoundForm;
