import Loading from "../components/Reusable/Loading";
import { modes } from "../hooks/useServiceConfig";
import RoomsMenu from "../components/Rooms/RoomsMenu";

function RoomsPage() {
  return (
    <>
      <Loading mode={modes.all} />
      <RoomsMenu />;
    </>
  );
}

export default RoomsPage;
