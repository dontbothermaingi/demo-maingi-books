import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Typography from "@mui/material/Typography"; // Import Typography from Material-UI

function TruckEdit() {
  const { truckId } = useParams(); // Get truckId from URL parameters
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    truck_number: "",
    vehicle_type: "",
    manufacturer: "",
    driver: "",
    trailer: "",
  });

  // State to track loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch truck details to prefill the form
    fetch(`https://maingi-server-3.onrender.com/trucks/${truckId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch truck details");
        }
        return response.json();
      })
      .then((data) => {
        // Set the form data with the fetched truck details
        setFormData({
          truck_number: data.truck_number || "",
          vehicle_type: data.vehicle_type || "",
          manufacturer: data.manufacturer || "",
          driver: data.driver || "",
          trailer: data.trailer || "",
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching truck details:", error);
        setError(error.message);
        setLoading(false);
      });
  }, [truckId]); // Dependency array: triggers the effect whenever truckId changes

  function handleChange(event) {
    const { name, value } = event.target; // Correct destructuring
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    fetch(`https://maingi-server-3.onrender.com/trucks/${truckId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Truck updated successfully:", data);
        // Navigate to the trucks page after successful update
        navigate("/trucks");
      })
      .catch((error) => {
        console.error("Error updating truck:", error);
      });
  }

  if (loading) return <p>Loading truck details...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <Typography textAlign="center" fontSize="30px" fontWeight="bold">
        EDIT VEHICLE
      </Typography>

      <form className="bill-form" onSubmit={handleSubmit}>
        <div className="bill-input">
          <label>VEHICLE TYPE</label>
          <select
            name="vehicle_type"
            value={formData.vehicle_type}
            className="bill-inputfield"
            onChange={handleChange}
          >
            <option value="">Select Vehicle Type</option>
            <option value="Heavy Commercial Vehicle">
              Heavy Commercial Vehicle
            </option>
            <option value="Light Commercial Vehicle">
              Light Commercial Vehicle
            </option>
          </select>
        </div>

        <div className="bill-input">
          <label>VEHICLE NUMBER PLATE</label>
          <input
            type="text"
            name="truck_number"
            value={formData.truck_number}
            placeholder="Vehicle number plate"
            className="bill-inputfield"
            onChange={handleChange}
          />
        </div>
        <div className="bill-input">
          <label>TRAILER NUMBER PLATE</label>
          <input
            type="text"
            name="trailer"
            value={formData.trailer}
            placeholder="Trailer number plate"
            className="bill-inputfield"
            onChange={handleChange}
          />
        </div>
        <div className="bill-input">
          <label>DRIVER</label>
          <input
            type="text"
            name="driver"
            value={formData.driver}
            placeholder="Driver"
            className="bill-inputfield"
            onChange={handleChange}
          />
        </div>
        <div className="bill-input">
          <label>MANUFACTURER</label>
          <input
            type="text"
            name="manufacturer"
            value={formData.manufacturer}
            placeholder="Manufacturer"
            className="bill-inputfield"
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="button">
          UPDATE VEHICLE
        </button>
      </form>
    </div>
  );
}

export default TruckEdit;
