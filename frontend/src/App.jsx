import React, { useEffect, useState } from "react";
import { FaMinusCircle, FaPaintBrush, FaGem } from "react-icons/fa";
import "./index.css";
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
    freshpolish: null,
    repolish: null,
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
  const [checkboxValues, setCheckboxValues] = useState({
    enamel: false,
    polish: false,
    less: false,
  });
  const [subtractFromWallFlags, setSubtractFromWallFlags] = useState({});
  const [roomImages, setRoomImages] = useState({});
  const [newRoomName, setNewRoomName] = useState("");
  const [newSurfaceNames, setNewSurfaceNames] = useState({});
  const [selectedSurfaceNames, setSelectedSurfaceNames] = useState({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleRoomChange = (roomIndex, surfaceIndex, key, value) => {
    const updatedRooms = [...rooms];
    updatedRooms[roomIndex].surfaces[surfaceIndex][key] = value;
    setRooms(updatedRooms);
    setHasUnsavedChanges(true);
  };

  // const handleImageUpload = (roomName, files) => {
  //   setRoomImages((prev) => ({
  //     ...prev,
  //     [roomName]: [...(prev[roomName] || []), ...files],
  //   }));
  // };4
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        // Save your data (replace `roomData` with your actual data)
        localStorage.setItem("unsavedRoomData", JSON.stringify(rooms));
        localStorage.setItem("unsavedRemarks", JSON.stringify(remarks)); // If applicable

        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges, rooms]);
  useEffect(() => {
    const savedRooms = localStorage.getItem("unsavedRoomData");
    const savedRemarks = localStorage.getItem("unsavedRemarks");

    if (savedRooms) {
      const confirmRestore = window.confirm(
        "You have unsaved changes. Do you want to restore them?"
      );

      if (confirmRestore) {
        setRooms(JSON.parse(savedRooms));
        setHasUnsavedChanges(true);

        if (savedRemarks) {
          setRemarks(JSON.parse(savedRemarks));
        }
      } else {
        localStorage.removeItem("unsavedRoomData");
        localStorage.removeItem("unsavedRemarks");
      }
    }
  }, []);

  const handleImageUpload = (roomName, files) => {
    setRoomImages((prev) => {
      const existingFiles = prev[roomName] || [];

      // Filter out duplicates
      const newFiles = files.filter((file) => {
        console.log("new file");
        const isDuplicate = existingFiles.some(
          (existing) =>
            existing.name === file.name && existing.size === file.size
        );
        if (isDuplicate) {
          console.log("duplicate: ", isDuplicate);
          window.alert(
            `Image "${file.name}" already exists in room "${roomName}"`
          );
        }
        return !isDuplicate;
      });

      return {
        ...prev,
        [roomName]: [...existingFiles, ...newFiles],
      };
    });
    setHasUnsavedChanges(true);
  };
  const handleCheckboxChange = (key, isChecked) => {
    setCheckboxValues((prev) => ({ ...prev, [key]: isChecked }));

    if (isChecked) {
      handleWoodFinish(key, 12); // or any value you want to add
    }
  };

  const handleDeleteImage = (roomName, index) => {
    setHasUnsavedChanges(true);
    setRoomImages((prev) => {
      const updatedImages = [...(prev[roomName] || [])];
      updatedImages.splice(index, 1);
      return { ...prev, [roomName]: updatedImages };
    });
  };
  const handleRemarksChange = (roomIndex, value) => {
    setHasUnsavedChanges(true);
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
  const handleWoodFinish = (key, value) => {
    setWoodFinish((prev) => ({
      ...prev,
      [key]: (prev[key] || 0) + value,
    }));
  };
  const removeRoom = (roomIndex) => {
    const updatedRooms = rooms.filter((_, index) => index !== roomIndex);
    setRooms(updatedRooms);
  };

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
    setHasUnsavedChanges(true);
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
    // setHasUnsavedChanges(true);
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
                    <div className="flex flex-col gap-3 p-4 border rounded-md">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={checkboxValues.less}
                          onChange={(e) =>
                            handleCheckboxChange("less", e.target.checked)
                          }
                        />
                        <FaMinusCircle className="text-red-500" />
                        <span>Add to less</span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={checkboxValues.enamel}
                          onChange={(e) =>
                            handleCheckboxChange("enamel", e.target.checked)
                          }
                        />
                        <FaPaintBrush className="text-blue-500" />
                        <span>Add to enamel</span>
                      </label>

                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={checkboxValues.polish}
                          onChange={(e) =>
                            handleCheckboxChange("polish", e.target.checked)
                          }
                        />
                        <FaGem className="text-yellow-600" />
                        <span>Add to polish</span>
                      </label>

                      {surface.name === "Window and grill" && (
                        <select className="border px-2 py-1 mt-2">
                          <option value="" disabled selected>
                            Select
                          </option>
                          <option value="Window">Window</option>
                          <option value="Grill">Grill</option>
                          <option value="Both">Both</option>
                        </select>
                      )}

                      <input
                        type="text"
                        placeholder="Enter side"
                        className="border px-2 py-1 mt-2"
                      />
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
                      // placeholder=""
                      // className=""
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
              <div className="mb-4">
                <label className="block mb-1 font-medium">
                  Upload Images for {room.name}
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) =>
                    handleImageUpload(room.name, Array.from(e.target.files))
                  }
                  className="border px-2 py-1"
                />

                {/* Image previews with delete */}
                <div className="flex flex-wrap gap-4 mt-2">
                  {roomImages[room.name]?.map((file, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`${room.name} Image ${idx}`}
                        className="w-20 h-20 object-cover border rounded"
                      />
                      <button
                        onClick={() => handleDeleteImage(room.name, idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center hover:bg-red-700"
                        title="Delete"
                      >
                        ✖
                      </button>
                    </div>
                  ))}
                </div>
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
              {total.toFixed(2)} sq.ft walls: celing: enamel: polish:
            </div>
          );
        })}
      </div>
    </div>
  );
}
