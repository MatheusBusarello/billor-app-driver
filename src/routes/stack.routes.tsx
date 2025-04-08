import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AppRoutes } from "./app.routes";
import { Loads } from "../screens/Loads";
import { Delivery } from "../screens/Delivery";

type StackRoutesProps = {
  app: undefined;
  loads: undefined;
  delivery: {
    id: string;
  };
};

const { Navigator, Screen } = createNativeStackNavigator<StackRoutesProps>();

export function StackRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen 
        name="app"
        component={AppRoutes}
      />

      <Screen 
        name="loads"
        component={Loads}
      />

      <Screen 
        name="delivery"
        component={Delivery}
      />
    </Navigator>
  )
}