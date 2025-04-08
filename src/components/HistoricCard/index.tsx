import { TouchableOpacityProps } from "react-native";
import { Check, ClockClockwise } from "phosphor-react-native";

import { Container, Departure, Info, LoadIdentify, Thumbnail } from "./styles";
import { useTheme } from "styled-components/native";

export type HistoricCardProps = {
  id: string;
  loadIdentify: string;
  created: string;
  isSync: boolean;
  imageUrl?: string;
};

type Props = TouchableOpacityProps & {
  data: HistoricCardProps;
};

export function HistoricCard({ data, ...rest }: Props) {
  const { COLORS } = useTheme();

  return (
    <Container {...rest}>
      {data.imageUrl && (
        <Thumbnail source={{ uri: data.imageUrl }} />
      )}

      <Info style={{ marginLeft: data.imageUrl ? 12 : 0 }}>
        <LoadIdentify>{data.loadIdentify}</LoadIdentify>
        <Departure>{data.created}</Departure>
      </Info>

      {data.isSync ? (
        <Check size={24} color={COLORS.BRAND_LIGHT} />
      ) : (
        <ClockClockwise size={24} color={COLORS.GRAY_400} />
      )}
    </Container>
  );
}
