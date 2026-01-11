import React from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

export default function MyAutocomplete({ onSelectPlace }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Optional settings */
    },
    debounce: 300,
    apiKey: import.meta.env.VITE_GOOGLE_PLACES_API_KEY,
  });

  const handleSelect = async (description) => {
    setValue(description, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address: description });
      const { lat, lng } = await getLatLng(results[0]);

      console.log("Selected:", description);
      console.log("Coordinates:", lat, lng);

      // notify parent if callback provided
      if (typeof onSelectPlace === "function") {
      onSelectPlace(description, { lat, lng });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <input
        value={value}
        disabled={!ready}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search city, country, address..."
        className="border p-2 rounded w-full"
      />

      {status === "OK" && (
        <ul className="bg-white border rounded mt-1 shadow">
          {data.map(({ place_id, description }) => (
            <li
              key={place_id}
              onClick={() => handleSelect(description)}
              className="p-2 cursor-pointer hover:bg-gray-100"
            >
              {description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
