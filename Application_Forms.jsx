import React, { useState } from 'react';
import styles from './Application_Forms.module.css';
import axios from 'axios';
export default function Application_Forms() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    isSubscribed: false,
    role: ''
  });

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    const fieldValue = type === 'checkbox' ? checked : value;


    

    setFormData({
      ...formData,
      [name]: fieldValue
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    console.log(formData); // ✅ This is safe
    await axios.post("http://localhost:5000/api/users", formData);
    alert("Form submitted successfully!");
  } catch (err) {
    console.error("Submission error:", err);
    alert("Submission done.");
  }
};


  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.heading}>Application Form</h2>

   

      <div className={styles.field}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
        />
      </div>

      <div className={styles.checkbox}>
        <label htmlFor="isSubscribed">Subscribe:</label>
        <input
          type="checkbox"
          id="isSubscribed"
          name="isSubscribed"
          checked={formData.isSubscribed}
          onChange={handleChange}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="role">Role:</label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="loan officer">Loan Officer</option>
          <option value="borrower">Borrower</option>
        </select>
      </div>

      <button className={styles.submit} type="submit">Submit</button>
    </form>
  );
}
