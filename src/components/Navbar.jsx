function Navbar() {
  return (
    <div
      style={{
        height: "70px",
        background: "#ffffff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 20px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
      }}
    >
      <h2>Dashboard</h2>

      <div>
        Welcome, <strong>Admin</strong>
      </div>
    </div>
  );
}

export default Navbar;