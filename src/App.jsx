
import { useState, useEffect } from "react";
import "./App.css";
function AddClientModal({ isOpen, onClose, onSubmit }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [location, setLocation] = useState("");
  const [appointment, setAppointment] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedAppointment = appointment.map((appt) =>
      appt.replace("T", " ")
    );
    const updatedAppointments = [formattedAppointment];
    onSubmit({
      firstName,
      lastName,
      location,
      appointments: updatedAppointments,
    });
    onClose();
  };
  const handleAppointmentChange = (e) => {
    const newAppointment = e.target.value;
    setAppointment([...appointment, newAppointment]);
  };
  return (
    isOpen && (
      <div className="modal">
        <div className="modal-content">
          <span className="close" onClick={onClose}>
            X
          </span>
          <h2>Add New Client</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <br></br>
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <br></br>
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <br></br>
            <label htmlFor="appointment">Appointment:</label>
            <input
              type="datetime-local"
              id="appointment"
              value={appointment}
              onChange={handleAppointmentChange}
            />
            <br></br>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    )
  );
}
function App() {
  const [clients, setClients] = useState(
    JSON.parse(localStorage.getItem("clients")) || [
      {
        id: 1,
        firstName: "John",
        lastName: "Doshi",
        location: "Indore",
        appointments: ["2024-03-15T10:00"],
      },
      {
        id: 2,
        firstName: "Janeki",
        lastName: "Smita",
        location: "Ayodhya",
        appointments: ["2024-03-17T11:30"],
      },
    ]
  );
  const [notification, setNotification] = useState(false);
  const [show, setShow] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("clients", JSON.stringify(clients));
  }, [clients]);

  const handleEditClient = (clientId, field, value) => {
    setClients((clients) => {
      return clients.map((client) => {
        if (client.id === clientId) {
          if (client[field] !== value) {
            setNotification(true);
          }
          return { ...client, [field]: value };
        }
        return client;
      });
    });
  };

  const handleEditClientAlert = (value) => {
    if (value && notification) {
      setShow(true);
      setTimeout(() => {
        setShow(false);
        setNotification(false);
      }, 2000);
    }
  };
  const handleAddAppointment = (clientId, datetime) => {
    setClients(
      clients.map((client) => {
        if (client.id === clientId) {
          const addClient = {...client,appointments: [...client.appointments, datetime]}
          window.alert("Notification: Appointment added successfully!");
          return addClient;
        }
        return client;
      })
    );
  };

  const handleEditAppointment = (clientId, appointmentIndex, datetime) => {
    const formatted = datetime.replace(" ", "T");
    setClients(
      clients.map((client) => {
        if (client.id === clientId) {
          const updatedAppointment = [...client.appointments];
          updatedAppointment[appointmentIndex] = formatted;
          return { ...client, appointments: updatedAppointment };
        }
        return client;
      })
    );
  };

  const handleDeleteAppointment = (clientId, appointmentIndex) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      setClients((clients) => {
        const updatedClient = clients.map((client) => {
          if (client.id === clientId) {
            const updatedAppointment = client.appointments.filter(
              (_, index) => index !== appointmentIndex
            );
            return { ...client, appointments: updatedAppointment };
          }
          return client;
        });
        return updatedClient;
      });
    }
  };

  const handleAddClient = (clientData) => {
    const newId = clients.length + 1;
    const newClient = { id: newId, ...clientData };
    setClients([...clients, newClient]);
    window.alert("Notification: Client information added successfully!");
  };
  const handleDeleteClient = (clientId) => {
    if (window.confirm("Are you sure you want to delete this client info?")) {
      setClients((clients) => {
        const updatedClient = clients.filter((client) => 
          clientId !== client.id
          );
          return updatedClient;
        });
    }
  };
  return (
    <div className="App">
      <h1>Fitness Trainer Dashboard</h1>
      {show && (
        <div className="show">
          <p>Notification: Client information updated successfully!</p>
        </div>
      )}
      <button onClick={() => setIsModalOpen(true)}>Add New Client</button>
      <AddClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddClient}
      />
      <table>
        <colgroup>
          <col style={{ width: "10%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "30%" }} />
          <col style={{ width: "30%" }}/>
        </colgroup>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Location</th>
            <th>Appointments</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id}>
              <td>
                <input
                  id={`firstname-${client.id}`}
                  type="text"
                  style={{ border: "none" }}
                  value={client.firstName}
                  onChange={(e) =>
                    handleEditClient(client.id, "firstName", e.target.value)
                  }
                  onBlur={() => handleEditClientAlert(true)}
                />
              </td>
              <td>
                <input
                  id={`lastname-${client.id}`}
                  type="text"
                  style={{ border: "none" }}
                  value={client.lastName}
                  onChange={(e) =>
                    handleEditClient(client.id, "lastName", e.target.value)
                  }
                  onBlur={() => handleEditClientAlert(true)}
                />
              </td>
              <td>
                <input
                  id={`location-${client.id}`}
                  type="text"
                  style={{ border: "none" }}
                  value={client.location}
                  onChange={(e) =>
                    handleEditClient(client.id, "location", e.target.value)
                  }
                  onBlur={() => handleEditClientAlert(true)}
                />
              </td>
              <td>
                <ul>
                  {client.appointments &&
                    client.appointments.map((appointment, index) => (
                      <li key={index}>
                        <input
                          type="datetime-local"
                          value={appointment}
                          onChange={(e) =>
                            handleEditAppointment(
                              client.id,
                              index,
                              e.target.value
                            )
                          }
                        />
                        <button
                          onClick={() =>
                            handleDeleteAppointment(client.id, index)
                          }
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  <li>
                    <form
                      onSubmit={(e) =>
                        handleAddAppointment(
                          client.id,
                          e.target.elements["add-appointment"].value
                        )
                      }
                    >
                      <input
                        type="datetime-local"
                        name="add-appointment"
                        id={`add-appointment-${client.id}`}
                      />
                      <button type="submit">Add</button>
                    </form>
                  </li>
                </ul>
              </td>
              <td>
                <button onClick={() => handleDeleteClient(client.id)}>Delete Client</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
