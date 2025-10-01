import { useNavigator } from "./hooks/useNavigator";
import { NotFoundPage } from "./components/NotFoundPage/NotFoundPage";

export const NotFound = () => {
  const navigate = useNavigator();

  return <NotFoundPage onBack={() => navigate("/")} />;
};
export { NotFound };
