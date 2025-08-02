
// Dashboard.jsx

export default function Dashboard({ user }) {
  return (
    <>
      <h1>Welcome, {user.username}!</h1>
      <p>This is your dashboard content.</p>
    </>
  );
}