import { useParams } from "react-router-dom";

export const User = () => {
  const { username } = useParams();

  return <div>BILLY BOY {username}</div>;
};
