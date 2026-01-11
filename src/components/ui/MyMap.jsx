import { Map, Marker } from "@vis.gl/react-google-maps";

export default function MyMap() {
  return (
    <Map
      style={{ width: "100%", height: "300px" }}
      defaultZoom={10}
      defaultCenter={{ lat: 28.6139, lng: 77.2090 }}
    >
      <Marker position={{ lat: 28.6139, lng: 77.2090 }} />
    </Map>
  );
}
