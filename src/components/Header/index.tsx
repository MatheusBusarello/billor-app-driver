import { TouchableOpacity } from "react-native";
import { useTheme } from "styled-components/native";
import { Container, Title } from "./styles";
import { ArrowLeft } from 'phosphor-react-native'
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

type Props = {
  title: string;
}

export function Header({ title }: Props) {
  const { COLORS }= useTheme();
  const { goBack } = useNavigation()
  const insets = useSafeAreaInsets();

  const paddingTop = insets.top + 42;

  return (
    <Container style={{ paddingTop }}>
      <TouchableOpacity activeOpacity={0.7} onPress={goBack}>
        <ArrowLeft size={24} weight="bold" color={COLORS.BRAND_LIGHT}/>
      </TouchableOpacity>

      <Title>
        {title}
      </Title>
    </Container>
  )
}