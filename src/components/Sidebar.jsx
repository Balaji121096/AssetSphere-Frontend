import {
  FaHome,
  FaDesktop,
  FaLaptop,
  FaUsers,
  FaBuilding,
  FaChartBar,
  FaCog,
  FaSignOutAlt
} from "react-icons/fa";

function Sidebar() {
  return (
    <div
      style={{
        width: "240px",
        height: "100vh",
        background: "#1e293b",
        color: "#fff",
        padding: "20px",
        boxSizing: "border-box"
      }}
    >
      <h2>AssetSphere</h2>

      <hr />

      <p><FaHome /> Dashboard</p>

      <p><FaDesktop /> Hardware</p>

      <p><FaLaptop /> Software</p>

      <p><FaUsers /> Employees</p>

      <p><FaBuilding /> Vendors</p>

      <p><FaChartBar /> Reports</p>

      <p><FaCog /> Settings</p>

      <hr />

      <p><FaSignOutAlt /> Logout</p>
    </div>
  );
}

export default Sidebar;