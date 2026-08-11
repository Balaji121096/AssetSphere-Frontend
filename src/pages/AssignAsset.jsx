import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import API from "../api/axios";

function AssignAsset() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);
    const [employeeId, setEmployeeId] = useState("");

    useEffect(() => {
        const loadEmployees = async () => {
            try {
                const response = await API.get("/employees");

                console.log("Employee API:", response.data);

                setEmployees(response.data.data || []);

            } catch (error) {
                console.error(error);
                alert(
                    error.response?.data?.message ||
                    "Failed to load employees"
                );
            }
        };

        loadEmployees();
    }, []);

    const handleAssign = async (e) => {
        e.preventDefault();

        if (!employeeId) {
            alert("Please select employee");
            return;
        }

        try {
            await API.put(`/assets/assign/${id}`, {
                employee_id: Number(employeeId)
            });

            alert("Asset assigned successfully");

            navigate("/assets");

        } catch (error) {
            console.error(error);

            alert(
                error.response?.data?.message ||
                "Failed to assign asset"
            );
        }
    };

    const getEmployeeName = (employee) => {
        if (employee.employee_name) {
            return employee.employee_name;
        }

        if (employee.name) {
            return employee.name;
        }

        const fullName = `${employee.first_name || ""} ${
            employee.last_name || ""
        }`.trim();

        return fullName || `Employee ${employee.employee_id}`;
    };

    return (
        <div
            style={{
                display: "flex",
                minHeight: "100vh",
                background: "#f5f5f5"
            }}
        >
            <Sidebar />

            <div style={{ flex: 1 }}>
                <Navbar />

                <div style={{ padding: "25px" }}>
                    <h1>Assign Asset</h1>

                    <p>Assign this hardware asset to an employee.</p>

                    <form onSubmit={handleAssign}>
                        <label>Employee</label>

                        <br />

                        <select
                            value={employeeId}
                            onChange={(e) =>
                                setEmployeeId(e.target.value)
                            }
                            required
                            style={{
                                padding: "10px",
                                width: "350px",
                                marginTop: "8px"
                            }}
                        >
                            <option value="">
                                Select Employee
                            </option>

                            {employees.map((employee) => (
                                <option
                                    key={employee.employee_id}
                                    value={employee.employee_id}
                                >
                                    {getEmployeeName(employee)}
                                </option>
                            ))}
                        </select>

                        <br />
                        <br />

                        <button type="submit">
                            Assign Asset
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/assets")}
                            style={{ marginLeft: "10px" }}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AssignAsset;