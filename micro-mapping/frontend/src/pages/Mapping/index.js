import { Loader } from "@googlemaps/js-api-loader";
import { Box } from "@material-ui/core";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import { renderPoints } from "../../helpers/utils";
import Panel from "../Layout/Panel";
import MapControl from "./MapControl";
import OrderInformation from "./OrderInformation";

const loader = new Loader({
  apiKey: process.env.REACT_APP_GOOGLE_API_KEY,
  version: "weekly",
  libraries: ["places"],
});

const socket = io(process.env.REACT_APP_MICRO_MAPPING_URL);

const Mapping = () => {
  const { id } = useParams();

  const [order, setOrder] = useState();
  const [map, setMap] = useState();
  const [startMarker, setStartMarker] = useState();
  const [endMarker, setEndMarker] = useState();
  const [position, setPosition] = useState();

  const snackbar = useSnackbar();

  useEffect(() => {
    async function load() {
      const { data } = await axios.get(
        `${process.env.REACT_APP_MICRO_MAPPING_URL}/orders/${id}`
      );

      setOrder(data);

      console.log(data);

      const [lat, lng] = data.location_geo;
      const position = { lat: parseFloat(lat), lng: parseFloat(lng) };
      window.google = await loader.load();
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: position,
        zoom: 15,
      });

      const start = new window.google.maps.Marker({
        title: "Início",
        icon: "http://maps.google.com/mapfiles/kml/pal4/icon7.png",
      });

      const end = new window.google.maps.Marker({
        position: position,
        map: map,
        title: "Destino",
      });

      setMap(map);
      setStartMarker(start);
      setEndMarker(end);
    }

    load();
  }, [id]);

  useEffect(() => {
    socket.on(`order.${id}.new-position`, (payload) => {
      console.log(payload);
      setPosition(payload);
    });
  }, [id]);

  useEffect(() => {
    console.log(map);
    console.log(position);
    if (!map || !position) {
      return;
    }

    if (position.lat === 0 && position.lng === 0) {
      snackbar.enqueueSnackbar("Motorista chegou no destino", {
        variant: "success",
        anchorOrigin: {
          horizontal: "right",
          vertical: "bottom",
        },
      });
      return;
    }

    startMarker.setPosition({ lat: position.lat, lng: position.lng });
    startMarker.setMap(map);
    const bounds = new window.google.maps.LatLngBounds();

    bounds.extend(startMarker.getPosition());
    bounds.extend(endMarker.getPosition());

    map.fitBounds(bounds);
  }, [endMarker, map, position, snackbar, startMarker]);

  return (
    <div id="map">
      {map && <Panel points={renderPoints()} />}
      {map && (
        <MapControl
          map={map}
          position={window.google.maps.ControlPosition.TOP_RIGHT}
        >
          <Box m={"10px"}>
            <OrderInformation order={order} />
          </Box>
        </MapControl>
      )}
    </div>
  );
};
export default Mapping;
