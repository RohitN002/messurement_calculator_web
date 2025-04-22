import React, { useState } from "react";

const initialAreas = [
  "Ceiling",
  "Wall-East",
  "Wall-West",
  "Wall-North",
  "Wall-South",
  "Door",
  "Window and grill",
  "Jams",
  "Water Proofing",
];
const polish = ["Fresh Polish", "Repolish"];
const defaultRoomNames = ["Hall", "Kitchen", "Dining", "Bedroom"];

export default function InteriorForm() {
  const [woodFinish, setWoodFinish] = useState({
    enamel: null,
    polish: null,
  });
  const [rooms, setRooms] = useState(
    defaultRoomNames.map((roomName) => ({
      name: roomName,
      surfaces: initialAreas.map((area) => ({
        name: area,
        length: "",
        width: "",
      })),
      remarks: "",
    }))
  );
  const [subtractFromWallFlags, setSubtractFromWallFlags] = useState({});

  const [newRoomName, setNewRoomName] = useState("");
  const [newSurfaceNames, setNewSurfaceNames] = useState({});
  const [selectedSurfaceNames, setSelectedSurfaceNames] = useState({});

  const handleRoomChange = (roomIndex, surfaceIndex, key, value) => {
    const updatedRooms = [...rooms];
    updatedRooms[roomIndex].surfaces[surfaceIndex][key] = value;
    setRooms(updatedRooms);
  };

  const handleRemarksChange = (roomIndex, value) => {
    const updatedRooms = [...rooms];
    updatedRooms[roomIndex].remarks = value;
    setRooms(updatedRooms);
  };

  const addRoom = () => {
    if (!newRoomName.trim()) return;

    setRooms([
      ...rooms,
      {
        name: newRoomName.trim(),
        surfaces: initialAreas.map((area) => ({
          name: area,
          length: "",
          width: "",
        })),
        remarks: "",
      },
    ]);
    setNewRoomName("");
  };

  const removeRoom = (roomIndex) => {
    const updatedRooms = rooms.filter((_, index) => index !== roomIndex);
    setRooms(updatedRooms);
  };

  // const addSurface = (roomIndex) => {
  //   const updatedRooms = [...rooms];
  //   updatedRooms[roomIndex].surfaces.push({
  //     name: `Surface-${updatedRooms[roomIndex].surfaces.length + 1}`,
  //     length: "",
  //     width: "",
  //   });
  //   setRooms(updatedRooms);
  // };
  const addSurface = (roomIndex) => {
    const updatedRooms = [...rooms];
    const name =
      newSurfaceNames[roomIndex] ||
      `Surface-${updatedRooms[roomIndex].surfaces.length + 1}`;
    updatedRooms[roomIndex].surfaces.push({
      name,
      length: "",
      width: "",
    });

    // Reset the name input after adding
    setNewSurfaceNames({ ...newSurfaceNames, [roomIndex]: "" });
    setRooms(updatedRooms);
  };

  const removeSurface = (roomIndex, surfaceIndex) => {
    const updatedRooms = [...rooms];
    updatedRooms[roomIndex].surfaces = updatedRooms[roomIndex].surfaces.filter(
      (_, index) => index !== surfaceIndex
    );
    setRooms(updatedRooms);
  };

  const calculateArea = (length, width) => {
    const l = parseFloat(length);
    const w = parseFloat(width);
    return isNaN(l) || isNaN(w) ? 0 : l * w;
  };
  const [expandedRooms, setExpandedRooms] = useState({});
  const toggleRoom = (roomIndex) => {
    setExpandedRooms((prev) => ({
      ...prev,
      [roomIndex]: !prev[roomIndex],
    }));
  };

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter room name"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          className="border p-2"
        />
        <button
          onClick={addRoom}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add Room +
        </button>
      </div>

      {rooms.map((room, roomIndex) => (
        <div key={roomIndex} className="border p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold">{room.name}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleRoom(roomIndex)}
                className="text-blue-500 font-semibold"
              >
                {expandedRooms[roomIndex] ? "Minimize ▲" : "Expand ▼"}
              </button>
              <button
                onClick={() => removeRoom(roomIndex)}
                className="text-red-500 font-semibold"
              >
                Remove Room ✖
              </button>
            </div>
          </div>

          {expandedRooms[roomIndex] && (
            <>
              {/* your existing surface mapping & inputs go here */}
              {room.surfaces.map((surface, surfaceIndex) => (
                <div
                  key={surfaceIndex}
                  className="flex items-center gap-2 mb-2"
                >
                  {(surface.name === "Window and grill" ||
                    surface.name === "Door") && (
                    <div>
                      <span>Add to less</span>
                      <span>Add to enamel </span>
                      <span>Add to polish</span>
                      <input type="text" placeholder="side" />
                    </div>
                  )}

                  <label className="w-40">{surface.name}</label>
                  <input
                    type="number"
                    placeholder="Length"
                    value={surface.length}
                    onChange={(e) =>
                      handleRoomChange(
                        roomIndex,
                        surfaceIndex,
                        "length",
                        e.target.value
                      )
                    }
                    className="border px-2 py-1 w-24"
                  />
                  <input
                    type="number"
                    placeholder="Width"
                    value={surface.width}
                    onChange={(e) =>
                      handleRoomChange(
                        roomIndex,
                        surfaceIndex,
                        "width",
                        e.target.value
                      )
                    }
                    className="border px-2 py-1 w-24"
                  />

                  <span>
                    Total:{" "}
                    {calculateArea(surface.length, surface.width).toFixed(2)}{" "}
                    sq.ft
                  </span>
                  <button
                    onClick={() => removeSurface(roomIndex, surfaceIndex)}
                    className="text-red-500"
                  >
                    ✖
                  </button>
                </div>
              ))}

              {/* Input for adding surface */}
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Enter surface name"
                  value={newSurfaceNames[roomIndex] || ""}
                  onChange={(e) =>
                    setNewSurfaceNames({
                      ...newSurfaceNames,
                      [roomIndex]: e.target.value,
                    })
                  }
                  className="border px-2 py-1"
                />
                <select
                  value={selectedSurfaceNames[roomIndex] || ""}
                  onChange={(e) =>
                    setSelectedSurfaceNames({
                      ...selectedSurfaceNames,
                      [roomIndex]: e.target.value,
                    })
                  }
                  className="border px-2 py-1"
                >
                  <option value="">Select Surface Area</option>
                  {initialAreas.map((area, idx) => (
                    <option key={idx} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
                {(selectedSurfaceNames[roomIndex] === "Door" ||
                  selectedSurfaceNames[roomIndex] === "Window and grill") && (
                  <label className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={subtractFromWallFlags[roomIndex] || false}
                      onChange={(e) =>
                        setSubtractFromWallFlags({
                          ...subtractFromWallFlags,
                          [roomIndex]: e.target.checked,
                        })
                      }
                    />
                    Subtract this area from wall calculation
                  </label>
                )}

                <button
                  onClick={() => addSurface(roomIndex)}
                  className="text-blue-500 text-sm"
                >
                  + Add Surface
                </button>
              </div>

              <input
                type="text"
                value={room.remarks}
                placeholder="Remarks"
                onChange={(e) => handleRemarksChange(roomIndex, e.target.value)}
                className="border w-full mt-2 p-2"
              />
            </>
          )}
        </div>
      ))}

      <div className="mt-4 border-t pt-4">
        <h6 className="font-semibold text-lg mb-2">Total Area Summary</h6>
        {rooms.map((room, roomIndex) => {
          const total = room.surfaces.reduce(
            (acc, surface) =>
              acc + calculateArea(surface.length, surface.width),
            0
          );
          return (
            <div key={roomIndex}>
              <span className="font-semibold">{room.name}:</span>{" "}
              {total.toFixed(2)} sq.ft
            </div>
          );
        })}
      </div>
    </div>
  );
}
